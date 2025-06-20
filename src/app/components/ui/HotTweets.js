import { Chip } from "@heroui/react";
import { getTranslation } from "@/lib/i18n";
import TweetCard from './TweetCard';
import { headers } from 'next/headers'

export default async function HotTweets({ locale = 'en' }) {
    const t = function (key) {
        return getTranslation(locale, key);
    }

    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'http'
    const baseUrl = `${protocol}://${host}`
    const tweetsResp = await fetch(`${baseUrl}/api/requestdb?action=recent`,{
        cache: 'no-store'
    });
    const tweetsData = await tweetsResp.json();
    
    const totalCount = tweetsData.count;

    const tweets = [[], [], []];
    tweetsData.data.forEach((tweet, index) => {
        tweets[index % 3].push({
            ...tweet,
            tweet_media: tweet.tweet_media ? tweet.tweet_media.split(',') : []
        });
    });

    return (
        <>
            <div className="text-2xl font-bold px-2 py-4 flex">
                <div>{t('Hot Tweets')}</div>
                <Chip color="primary" size="sm" variant="flat" className="ml-2 mt-1">{totalCount}</Chip>
            </div>
            <div className="flex justify-between gap-5 flex-wrap md:flex-nowrap">
                {tweets.map((row, index) => (
                    <div key={index} className="md:w-1/3 w-full flex flex-col gap-5">
                        {row.map((tweet) => (
                            <TweetCard locale={locale} key={tweet.tweet_id} tweet={tweet} />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}