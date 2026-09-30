import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import { formatDisplayDate, getArticles } from '@/lib/posts';
import { PUBLICATIONS } from '@/lib/publications';
import { getTopics } from '@/lib/topics';
import { AUTHOR_EMAIL, AUTHOR_ORCID, AUTHOR_SCHOLAR, ORGANIZATION_SCHEMA, PERSON_SCHEMA, RSS_ALTERNATE_TYPES, SITE_DESCRIPTION, SITE_NAME, SITE_URL, WEBSITE_SCHEMA } from '@/lib/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: { absolute: 'BillCharles Blog — Philosophy, Post-Marxism & Cryptography' },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/', types: RSS_ALTERNATE_TYPES },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'BillCharles Blog — Philosophy, Post-Marxism & Cryptography',
    description: SITE_DESCRIPTION,
  },
};

const homeJsonLd = [WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, PERSON_SCHEMA];

const READING = [
  { title: 'Organs without Bodies: On Deleuze and Consequences', author: 'Slavoj Žižek' },
  { title: 'Spinoza: Philosophie Pratique', author: 'Gilles Deleuze' },
  { title: 'The World as Will and Representation', author: 'Arthur Schopenhauer' },
  { title: 'Street Corner Society', author: 'William Foote Whyte' },
  { title: 'Objectivity', author: 'Lorraine J. Daston' },
];

const CONNECT = [
  { k: 'Email', href: `mailto:${AUTHOR_EMAIL}`, label: AUTHOR_EMAIL },
  { k: 'ORCID', href: AUTHOR_ORCID, label: '0009-0000-4322-5195' },
  { k: 'Scholar', href: AUTHOR_SCHOLAR, label: 'Google Scholar profile' },
  {
    k: 'GitHub',
    href: 'https://github.com/UYMIDGameStudio/billcharles-blog',
    label: 'UYMIDGameStudio/billcharles-blog',
  },
];

export default function Home() {
  const articles = getArticles();
  const publicationSlugs = new Set(PUBLICATIONS.map((item) => item.articleSlug));
  const featured = articles.find((post) => publicationSlugs.has(post.slug)) ?? articles[0];
  const essays = articles.filter((post) => post.slug !== featured?.slug && !publicationSlugs.has(post.slug)).slice(0, 3);
  const topics = getTopics();

  return (
    <main>
      <JsonLd data={homeJsonLd} />
      <SiteHeader activeNav="home" />
      <div className={styles.journal}>
        <header className={styles.masthead}>
          <div className={styles.edition}><span>A personal journal</span><span>Philosophy · Knowledge · Systems</span></div>
          <div className={styles.nameRow}>
            <h1>Bill Charles<span>.</span></h1>
            <p><span lang="zh-Hans">王鑫桦</span><br />Wang Xinhua</p>
          </div>
        </header>

        <section className={styles.cover} aria-label="Featured writing and author">
          {featured && <article className={styles.lead}>
            <div className={styles.storyMeta}><span className={styles.accentLabel}>{publicationSlugs.has(featured.slug) ? 'Featured research' : 'Latest writing'}</span><span>{featured.category}</span><time dateTime={featured.date}>{formatDisplayDate(featured.date)}</time></div>
            <h2 lang={featured.lang}><Link href={'/articles/' + encodeURIComponent(featured.slug)}>{featured.shortTitle ?? featured.title}</Link></h2>
            <p className={styles.leadExcerpt} lang={featured.lang}>{featured.excerpt}</p>
            <Link href={'/articles/' + encodeURIComponent(featured.slug)} className={styles.readLink}>Read the essay <span aria-hidden>↗</span></Link>
          </article>}
          <aside className={styles.author} aria-label="About the author">
            <Image src="/image_0.png" alt="Abstract geometric portrait used by Bill Charles" width={240} height={240} sizes="(min-width: 800px) 200px, 96px" className={styles.portrait} />
            <div>
              <p className={styles.authorLabel}>Behind the writing</p>
              <p className={styles.authorIntro}>I write on Western philosophy, post-Marxism and psychoanalysis, with an interest in cryptography and decentralized systems.</p>
              <Link href="/about" className={styles.smallLink}>More about me <span aria-hidden>↗</span></Link>
            </div>
          </aside>
        </section>

        <section id="writing" className={styles.writing} aria-labelledby="writing-title">
          <div className={styles.sectionHead}><h2 id="writing-title">From the journal</h2><Link href="/articles">All articles <span aria-hidden>↗</span></Link></div>
          <div className={styles.essayGrid}>
            {essays.map((post, i) => <article className={styles.essay} key={post.slug}>
              <div className={styles.storyMeta}><span>{post.category}</span><span className={styles.index} aria-hidden>{String(i + 1).padStart(2, '0')}</span></div>
              <h3 lang={post.lang}><Link href={'/articles/' + encodeURIComponent(post.slug)}>{post.shortTitle ?? post.title}</Link></h3>
              <p lang={post.lang}>{post.excerpt}</p>
              <div className={styles.essayFoot}><time dateTime={post.date}>{formatDisplayDate(post.date)}</time><Link href={'/articles/' + encodeURIComponent(post.slug)} aria-label={'Read ' + post.title}>Read <span aria-hidden>↗</span></Link></div>
            </article>)}
          </div>
        </section>

        <section className={styles.inquiries} aria-labelledby="inquiries-title">
          <div className={styles.inquiryIntro}>
            <p className={styles.accentLabel}>Lines of inquiry</p>
            <h2 id="inquiries-title">What changes.<br /><em>What remains.</em></h2>
            <p>From the identity of a theory to the structures of public life: questions pursued through philosophy, essays, and the study of decentralized systems.</p>
          </div>
          <div className={styles.topicList}>
            {topics.map((topic) => <Link href={'/topics/' + topic.slug} key={topic.slug}>
              <span><strong>{topic.name}</strong><span className={styles.topicDescription}>{topic.description}</span></span>
              <span className={styles.topicCount}>{topic.posts.length} <span className="sr-only">articles</span><span aria-hidden>↗</span></span>
            </Link>)}
          </div>
        </section>

        <section className={styles.publications} aria-labelledby="publications-title">
          <div className={styles.sectionHead}><h2 id="publications-title">Research &amp; publications</h2><Link href="/publications">Full records <span aria-hidden>↗</span></Link></div>
          <p className={styles.sectionNote}>Academic work published under Wang Xinhua.</p>
          <ol className={styles.bibliography}>
            {PUBLICATIONS.map((pub) => <li key={pub.doi}>
              <span className={styles.pubYear}>{pub.year}</span>
              <div><h3>{pub.articleSlug ? <Link href={'/articles/' + encodeURIComponent(pub.articleSlug)}>{pub.title}</Link> : pub.title}</h3><p>{pub.venue} · Version {pub.version}</p></div>
              <div className={styles.pubLinks}>{pub.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden>↗</span></a>)}</div>
            </li>)}
          </ol>
        </section>

        <section className={styles.desk} aria-label="Reading and correspondence">
          <div className={styles.reading}>
            <p className={styles.accentLabel}>On the desk</p><h2>Currently reading</h2>
            <ul>{READING.map((book) => <li key={book.title}><cite>{book.title}</cite><span>{book.author}</span></li>)}</ul>
          </div>
          <div id="connect" className={styles.correspondence}>
            <p className={styles.accentLabel}>Correspondence</p><h2>Keep the conversation<br /><em>open.</em></h2>
            <p>Open to correspondence on philosophy, post-Marxism, and DAO research. <span lang="zh-Hans">欢迎中文交流。</span></p>
            <a className={styles.readLink} href={'mailto:' + AUTHOR_EMAIL}>Write to me <span aria-hidden>↗</span></a>
            <div className={styles.profiles}>{CONNECT.filter((profile) => profile.k !== 'Email').map((profile) => <a key={profile.k} href={profile.href} target="_blank" rel="noopener noreferrer">{profile.k} <span aria-hidden>↗</span></a>)}</div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
