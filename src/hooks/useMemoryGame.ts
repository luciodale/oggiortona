import { useState, useCallback, useRef } from "react";

type Card = {
  id: number;
  icon: string;
  label: string;
};

type GameState = "playing" | "won";

const ICONS: Array<{ icon: string; label: string }> = [
  { icon: "\u{1F41F}", label: "pesce" },
  { icon: "\u{1F355}", label: "pizza" },
  { icon: "\u{1F377}", label: "vino" },
  { icon: "\u{1F366}", label: "gelato" },
  { icon: "\u{2600}\u{FE0F}", label: "sole" },
  { icon: "\u{1F3B6}", label: "musica" },
];

function shuffle<T>(arr: Array<T>): Array<T> {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = temp;
  }
  return a;
}

function buildDeck() {
  const pairs = ICONS.flatMap((item, i) => [
    { id: i * 2, ...item },
    { id: i * 2 + 1, ...item },
  ]);
  return shuffle(pairs);
}

export function useMemoryGame() {
  const [cards, setCards] = useState<Array<Card>>(buildDeck);
  const [flipped, setFlipped] = useState<Array<number>>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [state, setState] = useState<GameState>("playing");
  const lockRef = useRef(false);

  const flipCard = useCallback(
    function flipCard(id: number) {
      if (lockRef.current) return;
      if (flipped.includes(id)) return;

      const card = cards.find((c) => c.id === id);
      if (!card || matched.has(card.icon)) return;

      const next = [...flipped, id];
      setFlipped(next);

      if (next.length === 2) {
        setMoves((m) => m + 1);
        const [firstId, secondId] = next;
        const first = cards.find((c) => c.id === firstId)!;
        const second = cards.find((c) => c.id === secondId)!;

        if (first.icon === second.icon) {
          const nextMatched = new Set(matched);
          nextMatched.add(first.icon);
          setMatched(nextMatched);
          setFlipped([]);
          if (nextMatched.size === ICONS.length) {
            setState("won");
          }
        } else {
          lockRef.current = true;
          setTimeout(() => {
            setFlipped([]);
            lockRef.current = false;
          }, 600);
        }
      }
    },
    [cards, flipped, matched],
  );

  const reset = useCallback(function reset() {
    setCards(buildDeck());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setState("playing");
    lockRef.current = false;
  }, []);

  return {
    cards,
    flipped,
    matched,
    moves,
    state,
    flipCard,
    reset,
  };
}
