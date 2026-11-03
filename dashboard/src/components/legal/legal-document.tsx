import type { LegalSection } from '@/content/legal';

type LegalDocumentProps = {
  title: string;
  notice: string;
  updatedLabel?: string;
  sections: LegalSection[];
};

export function LegalDocument({
  title,
  notice,
  updatedLabel,
  sections,
}: LegalDocumentProps) {
  return (
    <div className="container-narrow py-14 sm:py-20">
      <p className="rounded-[12px] border border-hairline bg-bone px-4 py-3 text-sm leading-relaxed text-body">
        {notice}
      </p>

      <header className="mt-8 border-b border-hairline pb-8">
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold tracking-tight text-ink">
          {title}
        </h1>
        {updatedLabel ? <p className="mt-3 text-sm text-mute">{updatedLabel}</p> : null}
      </header>

      <nav aria-label="Table of contents" className="mt-8 rounded-[16px] border border-hairline bg-bone p-5">
        <p className="text-sm font-bold text-ink">Contents</p>
        <ol className="mt-3 columns-1 gap-6 sm:columns-2">
          {sections.map((section) => (
            <li key={section.id} className="mb-2 break-inside-avoid">
              <a
                href={`#${section.id}`}
                className="text-sm font-medium text-body underline-offset-2 hover:text-ink hover:underline"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-12">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-body">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
