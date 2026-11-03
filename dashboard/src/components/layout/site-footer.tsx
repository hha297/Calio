'use client';

import Link from 'next/link';

import { BrandMark } from '@/components/brand/brand-mark';
import { siteConfig } from '@/config/site';
import { useMessages } from '@/i18n/locale-provider';

export function SiteFooter() {
  const t = useMessages();
  const year = new Date().getFullYear();
  const social = [
    { href: siteConfig.social.twitter, label: 'X / Twitter' },
    { href: siteConfig.social.instagram, label: 'Instagram' },
    { href: siteConfig.social.github, label: 'GitHub' },
  ].filter((item) => item.href);

  const columns = [
    {
      title: t.footer.product,
      links: [
        { href: '/features', label: t.nav.features },
        { href: '/#how-it-works', label: t.nav.howItWorks },
        { href: '/#download', label: t.nav.download },
        { href: '/#faq', label: t.nav.faq },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { href: '/about', label: t.nav.about },
        { href: '/support#contact', label: t.footer.contact },
        { href: '/feedback', label: t.nav.feedback },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { href: '/privacy', label: t.nav.privacy },
        { href: '/terms', label: t.nav.terms },
      ],
    },
    {
      title: t.footer.support,
      links: [
        { href: '/support', label: t.nav.support },
        { href: '/support#contact', label: t.footer.contactSupport },
        { href: '/feedback', label: t.footer.sendFeedback },
      ],
    },
  ] as const;

  return (
    <footer className="border-t border-hairline bg-bone">
      <div className="container-site section-pad !py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <BrandMark size="md" />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-body">{t.footer.blurb}</p>
            <p className="mt-4 text-sm font-semibold text-ink">{siteConfig.domain}</p>
            {social.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-3">
                {social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm font-semibold text-body underline-offset-4 hover:text-ink hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-bold text-ink">{column.title}</p>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-body transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 text-sm text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {t.footer.rights}
          </p>
          <p>{t.footer.estimates}</p>
        </div>
      </div>
    </footer>
  );
}
