// app/privacy/page.tsx
import type { Metadata } from 'next';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import { AUTHOR_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} handles data and third-party services.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <SiteHeader />

      <section className="max-w-2xl mx-auto px-6 py-20 prose prose-lg max-w-none prose-headings:text-ink prose-p:text-ink2 prose-a:text-accent prose-a:font-medium prose-strong:text-ink">
        <h1 className="font-sans tracking-tight">Privacy Policy</h1>
        <p className="text-ink3 text-sm font-sans not-prose mb-10">
          Last updated: July 17, 2026
        </p>

        <p>
          {SITE_NAME} is a personal academic blog. It is built to collect as
          little information about visitors as possible. This page explains what
          limited data is involved and which third-party services the site uses.
        </p>

        <h2 className="font-sans">Hosting and server logs</h2>
        <p>
          The site is a static website served through a hosting provider
          (Vercel). Like virtually all web servers, the host may automatically
          record standard technical request data — such as IP address, browser
          user-agent, and the pages requested — for security, abuse prevention,
          and operational purposes. This blog does not combine that data with
          any personal profile.
        </p>

        <h2 className="font-sans">Cookies and analytics</h2>
        <p>
          This blog itself does not set advertising or analytics cookies and
          does not run any cross-site tracking. The “Support me” button is a
          normal link and does not load third-party code.
        </p>

        <h2 className="font-sans">Third-party services</h2>
        <p>
          The home page includes a link to{' '}
          <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer">
            Ko-fi
          </a>
          . Your browser contacts Ko-fi only after you choose to follow that
          link. Ko-fi may then set its own cookies and process data under its own{' '}
          <a
            href="https://more.ko-fi.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy policy
          </a>
          . If you choose to make a payment, that transaction is handled
          entirely by Ko-fi and its payment processors — this site never
          receives your payment details.
        </p>

        <h2 className="font-sans">Contacting me</h2>
        <p>
          If you email{' '}
          <a href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a>, your message and
          email address are used solely to reply to you and are not shared with
          anyone else.
        </p>

        <h2 className="font-sans">External links</h2>
        <p>
          Articles and notes may link to external websites. This blog is not
          responsible for the privacy practices or content of those sites.
        </p>

        <h2 className="font-sans">Changes</h2>
        <p>
          This policy may be updated from time to time; the “last updated” date
          above reflects the most recent revision. The current version always
          lives at <a href={`${SITE_URL}/privacy`}>{SITE_URL}/privacy</a>.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
