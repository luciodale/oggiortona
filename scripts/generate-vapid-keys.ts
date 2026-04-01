// One-time script to generate VAPID key pair for Web Push.
// Run: bun run scripts/generate-vapid-keys.ts

function toBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function main() {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign"],
  );

  const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  // Public key: uncompressed 65-byte point (0x04 || x || y)
  const x = Uint8Array.from(atob(publicJwk.x!.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  const y = Uint8Array.from(atob(publicJwk.y!.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  const uncompressed = new Uint8Array(65);
  uncompressed[0] = 0x04;
  uncompressed.set(x, 1);
  uncompressed.set(y, 33);

  const publicKeyBase64Url = toBase64Url(uncompressed.buffer);
  const privateKeyBase64Url = privateJwk.d!;

  console.log("Add these to your .dev.vars and Cloudflare dashboard:\n");
  console.log(`VAPID_PUBLIC_KEY=${publicKeyBase64Url}`);
  console.log(`VAPID_PRIVATE_KEY=${privateKeyBase64Url}`);
  console.log(`VAPID_SUBJECT=https://oggiaortona.com`);
}

main();
