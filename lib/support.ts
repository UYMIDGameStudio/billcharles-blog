// lib/support.ts — "buy me a coffee" / tip links shown on the home page and
// at the bottom of each article. Edit the URLs below to your real accounts.

export type SupportLink = {
  label: string;
  href: string;
  /** Short hint shown beneath the label in the home section. */
  hint?: string;
};

export const SUPPORT_LINKS: SupportLink[] = [
  {
    label: 'Buy me a coffee',
    href: 'https://ko-fi.com/billcharles/tip',
    hint: 'via Ko-fi · card',
  },
];
