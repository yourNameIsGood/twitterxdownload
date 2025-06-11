'use client';
import { getTranslation } from '@/lib/i18n';
import HotTweets from '@/app/components/ui/HotTweets';
import FAQ from '@/app/components/ui/FAQ';
import HotCreators from '@/app/components/ui/HotCreators';
import Hero from '@/app/components/ui/Hero';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home({ params: { locale } }) {
  const t = function (key) {
    return getTranslation(locale, key);
  }
  const router = useRouter();

  const [remainApiCount, setRemainApiCount] = useState(0);

  useEffect(() => {
    fetch('/api/remains')
        .then(response => response.json())
        .then(data => {
            setRemainApiCount(data.data);
        });
  }, []);

  return (
    <>
      <div className="page-container">
        <div className="section">
          <Hero locale={locale} remainApiCount={remainApiCount} onDownload={(url) => {
            console.log(url);
            router.push(`/downloader?url=${url}`);
          }} />
        </div>
        <div className="section">
          <div className="text-2xl font-bold px-2 py-4">{t('Hot Creators')}</div>
          <HotCreators locale={locale} />
        </div>
        <div className="section">
          <HotTweets locale={locale} />
        </div>
        <div className="section">
          <div className="text-2xl font-bold px-2 py-4">{t('Download Twitter video and all content')}</div>
          <div className="px-2">
            <p>
              {t('TwitterXDownload is an online web app to download twitter videos and all content to your computer directly. Twitter videos and Twitter GIFs are embedded in the tweet, so to download twitter videos online, you need to copy the tweet URL/link and paste it in the above text box. Our Twitter X download service will extract the twitter to mp4 link from the tweet and you can save twitter videos to your computer.')}
            </p>
          </div>
        </div>
        <div className="section">
          <div className="text-2xl font-bold px-2 py-4">{t('Frequently Asked Questions')}</div>
          <FAQ locale={locale} />
        </div>
      </div>
    </>
  );
}