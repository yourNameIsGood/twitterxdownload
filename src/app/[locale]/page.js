import { getTranslation } from '@/lib/i18n';
import HotTweets from '@/app/components/ui/HotTweets';
import FAQ from '@/app/components/ui/FAQ';
import HotCreators from '@/app/components/ui/HotCreators';
import Hero from '@/app/components/ui/Hero';
import { redirect } from 'next/navigation';

// set to true to enable home listing
const enableHomeListing = false;

export default async function Home({ params: { locale } }) {
  const t = function (key) {
    return getTranslation(locale, key);
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const remainApiResp = await fetch(`${baseUrl}/api/remains`,{
    cache: 'no-store'
  });
  const remainApiCountData = await remainApiResp.json();
  const remainApiCount = remainApiCountData.data;

  return (
    <>
      <div className="page-container">
        <div className="section">
          <Hero locale={locale} remainApiCount={remainApiCount} onDownload={async (url) => {
            'use server';
            redirect(`/downloader?url=${url}`);
          }} />
        </div>
        {enableHomeListing && (
        <>
          <div className="section">
            <h3 className="text-2xl font-bold px-2 py-4">{t('Hot Creators')}</h3>
            <HotCreators locale={locale} />
          </div>
          <div className="section">
            <HotTweets locale={locale} />
          </div>
        </>
        )}
        <div className="section">
          <h3 className="text-2xl font-bold px-2 py-4">{t('Download Twitter video and all content')}</h3>
          <div className="px-2">
            <p>
              {t('TwitterXDownload is an online web app to download twitter videos and all content to your computer directly. Twitter videos and Twitter GIFs are embedded in the tweet, so to download twitter videos online, you need to copy the tweet URL/link and paste it in the above text box. Our Twitter X download service will extract the twitter to mp4 link from the tweet and you can save twitter videos to your computer.')}
            </p>
          </div>
        </div>
        <div className="section">
          <h3 className="text-2xl font-bold px-2 py-4">{t('Frequently Asked Questions')}</h3>
          <FAQ locale={locale} />
        </div>
      </div>
    </>
  );
}