// Web Push protocol implementation using Web Crypto API (Cloudflare Workers compatible).
// Implements RFC 8291 (Message Encryption) and RFC 8292 (VAPID).

type PushSubscriptionKeys = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

type VapidKeys = {
  publicKey: string;  // base64url, 65-byte uncompressed
  privateKey: string; // base64url, 32-byte raw d
  subject: string;    // mailto: or https:
};

type PushPayload = {
  title: string;
  body: string;
  url: string;
};

// -- Base64url helpers --

function base64UrlToBytes(b64url: string) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function concat(...arrays: Uint8Array[]) {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    result.set(a, offset);
    offset += a.length;
  }
  return result;
}

// -- VAPID JWT (RFC 8292) --

async function createVapidJwt(endpoint: string, vapid: VapidKeys) {
  const origin = new URL(endpoint).origin;
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600;

  const header = bytesToBase64Url(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify({ aud: origin, exp, sub: vapid.subject })));
  const unsigned = `${header}.${payload}`;

  // Import VAPID private key as JWK for ECDSA signing
  const pubBytes = base64UrlToBytes(vapid.publicKey);
  const x = bytesToBase64Url(pubBytes.slice(1, 33));
  const y = bytesToBase64Url(pubBytes.slice(33, 65));

  const privateKey = await crypto.subtle.importKey(
    "jwk",
    { kty: "EC", crv: "P-256", x, y, d: vapid.privateKey },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );

  // Workers returns IEEE P1363 format (raw r||s, 64 bytes) — exactly what JWT ES256 needs
  const signature = new Uint8Array(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    new TextEncoder().encode(unsigned),
  ));

  const jwt = `${unsigned}.${bytesToBase64Url(signature)}`;
  return { authorization: `vapid t=${jwt}, k=${vapid.publicKey}` };
}

// -- RFC 8291 Payload Encryption --

async function encryptPayload(clientPubKeyB64: string, clientAuthB64: string, payload: Uint8Array) {
  const clientPubBytes = base64UrlToBytes(clientPubKeyB64);
  const clientAuth = base64UrlToBytes(clientAuthB64);

  // Generate ephemeral server ECDH key pair
  const serverKeyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
  const serverPubBytes = new Uint8Array(await crypto.subtle.exportKey("raw", serverKeyPair.publicKey));

  // Import client public key for ECDH
  const clientPubKey = await crypto.subtle.importKey(
    "raw",
    clientPubBytes,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );

  // ECDH shared secret
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "ECDH", public: clientPubKey },
    serverKeyPair.privateKey,
    256,
  ));

  // Random 16-byte salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Stage 1: HKDF — derive IKM from shared secret + client auth
  const infoPrefix = new TextEncoder().encode("WebPush: info\0");
  const info1 = concat(infoPrefix, clientPubBytes, serverPubBytes);

  const hkdfKey1 = await crypto.subtle.importKey("raw", sharedSecret, "HKDF", false, ["deriveBits"]);
  const ikm = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: clientAuth, info: info1 },
    hkdfKey1,
    256,
  ));

  // Stage 2: HKDF — derive CEK (16 bytes) and nonce (12 bytes) from IKM + salt
  const hkdfKey2 = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);

  const cekInfo = new TextEncoder().encode("Content-Encoding: aes128gcm\0");
  const cekBits = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info: cekInfo },
    hkdfKey2,
    128,
  ));

  const nonceInfo = new TextEncoder().encode("Content-Encoding: nonce\0");
  const nonce = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info: nonceInfo },
    hkdfKey2,
    96,
  ));

  // Pad payload with \x02 delimiter (RFC 8188 final record)
  const padded = concat(payload, new Uint8Array([2]));

  // AES-128-GCM encryption
  const cek = await crypto.subtle.importKey("raw", cekBits, "AES-GCM", false, ["encrypt"]);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    cek,
    padded,
  ));

  // Assemble aes128gcm body: salt(16) | rs(4) | idlen(1) | keyid(65) | ciphertext
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096);
  const idlen = new Uint8Array([65]);

  return {
    body: concat(salt, rs, idlen, serverPubBytes, ciphertext),
    encoding: "aes128gcm" as const,
  };
}

// -- Public API --

export async function sendWebPush(subscription: PushSubscriptionKeys, payload: PushPayload, vapid: VapidKeys) {
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const { body, encoding } = await encryptPayload(subscription.p256dh, subscription.auth, payloadBytes);
  const { authorization } = await createVapidJwt(subscription.endpoint, vapid);

  const response = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      "Authorization": authorization,
      "Content-Encoding": encoding,
      "Content-Type": "application/octet-stream",
      "TTL": "86400",
      "Urgency": "high",
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return { success: false as const, status: response.status, message: text };
  }

  return { success: true as const, status: response.status };
}
