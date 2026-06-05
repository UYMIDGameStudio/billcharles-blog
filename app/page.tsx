import type { Metadata } from 'next';
import Image from 'next/image';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import {
  AUTHOR_EMAIL,
  AUTHOR_NAME,
  AUTHOR_ORCID,
  RSS_ALTERNATE_TYPES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site';

export const metadata: Metadata = {
  // `absolute` prevents the layout title template from doubling the site name.
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

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: SITE_URL,
    email: `mailto:${AUTHOR_EMAIL}`,
    jobTitle: 'Secretary-General',
    identifier: AUTHOR_ORCID,
    sameAs: [AUTHOR_ORCID],
    knowsAbout: [
      'Western Philosophy',
      'Post-Marxism',
      'Psychoanalysis',
      'Political Economy',
      'Cryptography',
      'DAO',
    ],
  },
];

export default function Home() {
  return (
    <main>
      <JsonLd data={homeJsonLd} />
      <SiteHeader activeNav="home" />

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-24 leading-relaxed">
        
        {/* 1. About me */}
        <section className="relative pt-4">
          <div className="absolute inset-0 bg-stone-200/60 rounded-3xl transform translate-y-4 translate-x-4"></div>
          
          <div className="relative bg-[#FCFAF6] border border-stone-200 p-8 md:p-12 rounded-3xl shadow-sm grid md:grid-cols-[1fr_240px] gap-10 items-start">
            <div className="flex flex-col space-y-5">
              <h1 className="text-3xl font-bold font-sans text-stone-900 tracking-tight mb-2">
                About me
              </h1>
              <div className="text-sm md:text-base space-y-4 text-stone-700">
                <p>
                  Hello! I am Bill Charles. My research directions are Western Philosophy, Post-Marxism, and Psychoanalysis. I serve as the Secretary-General of the organizing committee for the 2nd and 3rd Zhejiang Secondary School Philosophy Conferences (SSPC), and am a co-founder of the Ateleios Diexodos project. I am also currently a high school student.
                </p>
                <p>
                  My intellectual inquiries extend into the realms of Political Economy, Cryptography/DAO research, and Cryptocurrency Venture Capital. For me, these long-term interests are not pursuits of worldly success, but rather a means to seek truth, cultivate rational discipline, and harness the power of thought to shape the world.
                </p>
                <p>
                  This personal blog serves as a platform for the synthesis of information and reflection. Here, I share my articles, essays, and research notes, aiming to provide a space where rigorous thinking meets diverse insights.
                </p>
              </div>
            </div>

            <div className="relative w-full max-w-[240px] mx-auto md:mx-0 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
              <div className="p-2 flex justify-center items-center">
                <Image 
                  src="/image_0.png" 
                  alt="BillCharles geometric abstract avatar" 
                  width={240} 
                  height={240} 
                  priority
                  className="object-contain hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Current Reading */}
        <section className="px-4" id="notes">
          <h2 className="text-2xl font-bold font-sans text-stone-900 mb-6 border-b border-stone-300 pb-3 inline-block">
            Current Reading
          </h2>
          <ul className="text-base space-y-2 text-stone-700 list-inside list-square marker:text-stone-400">
            <li><i>Organs without Bodies :On Deleuze and Consequences</i> Slavoj Zizek</li>
            <li><i>Spinoza Philosophie Pratique</i> Gilles Deleuze</li>
            <li><i>The World as Will and Representation</i> Schopenhauer</li>
            <li><i>Street Corner Society</i> William Foote Whyte</li>
            <li><i>Objectivity</i> Lorraine J. Daston</li>
            <li><span className="font-mono text-xs tracking-widest text-stone-400">.........</span></li>
          </ul>
        </section>

        {/* 3. My happy list */}
        <section>
          <h2 className="text-2xl font-bold font-sans text-stone-900 mb-8 text-center tracking-tight">
            My happy list
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-base text-stone-700">
            <div className="group bg-white border border-stone-200 rounded-2xl p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300 transition-all duration-300 ease-out">
              <h3 className="font-bold uppercase font-sans text-stone-900 text-lg mb-3 tracking-wider group-hover:text-blue-600 transition-colors">COFFEE !</h3>
              <p className="text-sm leading-relaxed">I&apos;m a loyal coffee enthusiast with a soft spot for oat milk lattes. While I frequent commercial shops like Starbucks, I also love the process of extracting my own shots from whole beans at home.</p>
            </div>
            <div className="group bg-white border border-stone-200 rounded-2xl p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300 transition-all duration-300 ease-out">
              <h3 className="font-bold uppercase font-sans text-stone-900 text-lg mb-3 tracking-wider group-hover:text-blue-600 transition-colors">READING</h3>
              <p className="text-sm leading-relaxed">As a long-term bibliophile, I find great fulfillment in the quiet hours spent with a book. Being engrossed in a story brings me a deep, authentic sense of happiness.</p>
            </div>
            <div className="group bg-white border border-stone-200 rounded-2xl p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300 transition-all duration-300 ease-out">
              <h3 className="font-bold uppercase font-sans text-stone-900 text-lg mb-3 tracking-wider group-hover:text-blue-600 transition-colors">LANGUAGES</h3>
              <p className="text-sm leading-relaxed">As a multilingual learner, I&apos;ve been studying German since 8th grade and picked up Japanese in high school. For me, language is more than just a tool for communication—it is a vessel for diverse cultures.</p>
            </div>
            <div className="group bg-white border border-stone-200 rounded-2xl p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-stone-300 transition-all duration-300 ease-out">
              <h3 className="font-bold uppercase font-sans text-stone-900 text-lg mb-3 tracking-wider group-hover:text-blue-600 transition-colors">SOCIAL SCIENCE</h3>
              <p className="text-sm leading-relaxed">My intellectual interest in social sciences and philosophy was sparked by Karl Marx&apos;s Das Kapital. Following middle school, I further refined my analytical framework at the National University of Singapore (NUS) Social Sciences Summer School. To me, social theory is more than an academic discipline; it is a vital lens through which I decode the inner workings of society and the intricate dynamics of power.</p>
            </div>
          </div>
        </section>

        {/* 4. Professional Affiliations */}
        <section className="px-4">
          <h2 className="text-2xl font-bold font-sans text-stone-900 mb-8 text-center">
            Professional Affiliations
          </h2>
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <h3 className="text-lg font-bold font-mono text-stone-800 bg-stone-100 px-4 py-2 rounded-md inline-block border border-stone-200">
              Bill(B.)Charles(His/He)
            </h3>
            <div className="text-base space-y-2.5 text-stone-700 font-sans border-t border-stone-200 pt-6">
              <p><strong>Title:</strong> Secretary-General</p>
              <p><strong>Field:</strong> Philosophy and Humanities · Western Philosophy</p>
              <p><strong>Email:</strong> <a href="mailto:billcharles310012@gmail.com" className="hover:text-stone-900 transition-colors">billcharles310012@gmail.com</a></p>
              <p><strong>Phone:</strong> +1 9096823066</p>
              <p>
                <strong>ORCID:</strong>{' '}
                <a 
                  href="https://orcid.org/0009-0000-4322-5195" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline text-stone-500 hover:text-stone-900 transition-colors"
                >
                  0009-0000-4322-5195
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 5. Column */}
        <section className="px-4" id="articles">
          <h2 className="text-2xl font-bold font-sans text-stone-900 mb-10 text-center">Column</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-2xl mx-auto mb-12 font-sans">
            <div className="space-y-4">
              <h3 className="text-base font-bold font-mono uppercase tracking-widest text-stone-800 border-b border-stone-200 pb-2">Cryptography Column</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-stone-600 font-mono">
                <li>Web3</li>
                <li>DAO</li>
                <li>ZK Rollups</li>
              </ul>
            </div>
            <div className="space-y-4 md:mt-0 mt-4">
              <h3 className="text-base font-bold font-mono uppercase tracking-widest text-stone-800 border-b border-stone-200 pb-2">Humanities Column</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-stone-600 font-mono">
                <li>Philosophy</li>
                <li>Psychology</li>
                <li>Psychoanalysis</li>
                <li>Literature</li>
              </ul>
            </div>
          </div>
          <p className="text-base text-stone-500 font-mono text-center text-sm pt-8 border-t border-stone-200">
            For Chinese E： <a href="mailto:billcharles310012@gmail.com" className="text-stone-800 hover:underline">billcharles310012@gmail.com</a>
          </p>
        </section>

      </div>

      <SiteFooter />
    </main>
  );
}