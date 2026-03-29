import { useState } from "react";
import { useBroadcast } from "../../hooks/useBroadcast";

export function AdminBroadcast() {
  const { subscriberCount, loading, sending, result, error, send } = useBroadcast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function handleSubmit() {
    if (!title.trim() || !body.trim()) return;
    send(title.trim(), body.trim());
  }

  if (loading) return null;

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <h2 className="text-sm font-semibold text-primary">
        Notifica broadcast
      </h2>
      <p className="mt-1 text-xs text-muted">
        {subscriberCount} {subscriberCount === 1 ? "iscritto" : "iscritti"}
      </p>

      <form action={handleSubmit} className="mt-3 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titolo"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary placeholder:text-muted/50"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Messaggio"
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary placeholder:text-muted/50"
        />
        <button
          type="submit"
          disabled={sending || !title.trim() || !body.trim() || subscriberCount === 0}
          className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Invio..." : "Invia notifica"}
        </button>
      </form>

      {result && (
        <p className="mt-2 text-xs text-emerald-700">
          Inviate: {result.sent}, fallite: {result.failed}
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
