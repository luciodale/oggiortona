import type { EventRow } from "../../types/database";
import { AdminEventCard } from "./AdminEventCard";

type AdminEventListProps = {
  events: Array<EventRow & { ownerEmail: string | null; ownerName: string | null }>;
  loading: boolean;
  onToggle: (id: number) => void;
  onDelete?: (id: number) => void;
};

export function AdminEventList({ events, loading, onToggle, onDelete }: AdminEventListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="py-12 text-center font-family-display text-lg italic text-muted/50">
        Nessun risultato
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {events.map((e) => (
        <AdminEventCard
          key={e.id}
          event={e}
          onToggle={() => onToggle(e.id)}
          onDelete={onDelete ? () => onDelete(e.id) : undefined}
        />
      ))}
    </div>
  );
}
