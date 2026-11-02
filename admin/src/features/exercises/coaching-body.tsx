/** Mirrors mobile CoachingBody: preserve line breaks; indent numbered/bulleted steps. */
export function CoachingBody({ text }: { text: string }) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(
      (line, index, all) =>
        line.trim().length > 0 || (index > 0 && index < all.length - 1),
    );

  if (lines.length <= 1) {
    return <p className="whitespace-pre-wrap text-sm leading-relaxed text-body">{text.trim()}</p>;
  }

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={`blank-${index}`} className="h-1" />;
        const isStep = /^(\d+[\).\]]|-|•|\*)\s+/.test(trimmed);
        return (
          <p
            key={`${index}-${trimmed.slice(0, 24)}`}
            className={`text-sm leading-relaxed text-body ${isStep ? 'pl-1' : ''}`}
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
