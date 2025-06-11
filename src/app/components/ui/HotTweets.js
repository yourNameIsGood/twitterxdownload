'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Skeleton, Chip } from "@heroui/react";
import { getTranslation } from "@/lib/i18n";
import TweetCard from './TweetCard';

let tweets = [[], [], []];
let totalCount = 0;
export default function HotTweets({ locale = 'en' }) {
    const t = function (key) {
        return getTranslation(locale, key);
    }
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (tweets.some(row => row.length === 0)) {
            fetch('/api/requestdb')
                .then(response => response.json())
                .then(data => {
                    const newTweets = [[], [], []];
                    data.data.forEach((tweet, index) => {
                        newTweets[index % 3].push({
                            ...tweet,
                            tweet_media: tweet.tweet_media ? tweet.tweet_media.split(',') : []
                        });
                    });
                    totalCount = data.count;
                    tweets = newTweets;
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching tweets:', error);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <>
                <div className="text-2xl font-bold px-2 py-4">{t('Hot Tweets')}</div>
                <div className="flex justify-between gap-5">
                    {[1, 2, 3].map((colIndex) => (
                        <div key={colIndex} className="w-1/3 flex flex-col gap-5">
                            {[1, 2, 3].map((rowIndex) => (
                                <Card shadow="none" className="w-full p-2 border-foreground/10 border-[1px] rounded-2xl" key={`skeleton-${colIndex}-${rowIndex}`}>
                                    <CardHeader className="justify-between">
                                        <div className="flex gap-5">
                                            <Skeleton className="rounded-full w-10 h-10" />
                                            <div className="flex flex-col gap-1 items-start justify-center">
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <Skeleton className="h-20 w-full" />
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            <div className="text-2xl font-bold px-2 py-4 flex">
                <div>{t('Hot Tweets')}</div>
                <Chip color="primary" size="sm" variant="flat" className="ml-2 mt-1">{totalCount}</Chip>
            </div>
            <div className="flex justify-between gap-5">
                {tweets.map((row, index) => (
                    <div key={index} className="w-1/3 flex flex-col gap-5">
                        {row.map((tweet) => (
                            <TweetCard locale={locale} key={tweet.tweet_id} tweet={tweet} />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}