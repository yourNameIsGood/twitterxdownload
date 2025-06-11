'use client';
import { Input, Select, SelectItem, Button,Spinner } from "@heroui/react";
import { RiSearchLine } from "@remixicon/react";
import { getTranslation } from "@/lib/i18n";
import { useState, useEffect } from "react";
import TweetCard from "@/app/components/ui/TweetCard";

export default function Tweets({ params: { locale } }) {
    const t = function(key){
        return getTranslation(locale, key);
    }
    const contentTypes = [
        { key: "all", label: t('All') },
        { key: "video", label: t('Video') },
        { key: "image", label: t('Image') }
    ];

    const dateRanges = [
        { key: "all", label: t('All') },
        { key: "week", label: t('Week') },
        { key: "month", label: t('Month') },
        { key: "quarter", label: t('Quarter') }
    ];

    const [name, setName] = useState('');
    const [screen_name, setScreenName] = useState('');
    const [text, setText] = useState('');
    const [content_type, setContentType] = useState('all');
    const [date_range, setDateRange] = useState('all');
    const [loading, setLoading] = useState(false);
    const [tweets, setTweets] = useState([[], [], []]);

    const [shouldSearch, setShouldSearch] = useState(false);

    useEffect(() => {
        if (shouldSearch) {
            handleSearch();
            setShouldSearch(false);
        }
    }, [shouldSearch]);

    const handleSearch = async () => {
        setLoading(true);
        const response = await fetch(`/api/requestdb?action=search&name=${name}&screen_name=${screen_name}&text=${text}&content_type=${content_type}&date_range=${date_range}`);
        const data = await response.json();
        
        const newTweets = [[], [], []];
        data.data.forEach((tweet, index) => {
            newTweets[index % 3].push({
                ...tweet,
                tweet_media: tweet.tweet_media ? tweet.tweet_media.split(',') : []
            });
        });
        setTweets(newTweets);
        setLoading(false);
    }

    const handleClear = () => {
        setName('');
        setScreenName('');
        setText('');
        setTweets([[], [], []]);
    }

    return (
        <div className="page-container">
            <div className='section'>
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-xl font-semibold">{t('Search Conditions')}</h2>
                </div>

                <div className="flex w-full gap-4">
                    {/* 用户名搜索 */}
                    <Input
                        disabled={loading}
                        label="Name"
                        variant="bordered"
                        size="sm"
                        radius="lg"
                        className="w-1/3"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setShouldSearch(true);
                            }
                        }}
                    />

                    {/* 用户昵称搜索 */}
                    <Input
                        disabled={loading}
                        label="Screen Name"
                        variant="bordered"
                        size="sm"
                        radius="lg"
                        className="w-1/3"
                        value={screen_name}
                        onChange={(e) => setScreenName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setShouldSearch(true);
                            }
                        }}
                    />

                    {/* 推文内容搜索 */}
                    <Input
                        disabled={loading}
                        label="Text"
                        variant="bordered"
                        size="sm"
                        radius="lg"
                        className="w-full"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setShouldSearch(true);
                            }
                        }}
                    />

                    <Button
                        disabled={loading}
                        color="primary"
                        variant="solid"
                        size="lg"
                        radius="xs"
                        className="px-8"
                        onPress={handleSearch}
                    >
                        {t('Search')}
                    </Button>
                    <Button
                        disabled={loading}
                        color="default"
                        variant="bordered"
                        size="lg"
                        radius="xs"
                        className="px-8"
                        onPress={handleClear}
                    >
                        {t('Clear')}
                    </Button>
                </div>
            </div>
            <div className="section">
                <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
                    <div className='flex-1 flex items-center gap-2'>{t('Search Results')}{loading && <Spinner className="ml-2" size="sm" color="primary" variant="simple"/>}</div>
                    <div className='flex gap-4 w-1/4'>
                        {/* 内容类型过滤 */}
                        <div className='w-1/2'>
                            <Select
                                disabled={loading}
                                label={t('Content Type')}
                                variant="underlined"
                                defaultSelectedKeys={["all"]}
                                value={content_type}
                                onChange={(e) => {
                                    setContentType(e.target.value);
                                    setShouldSearch(true);
                                }}
                            >
                                {contentTypes.map((type) => (
                                    <SelectItem key={type.key} value={type.key}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* 时间范围过滤 */}
                        <div className='w-1/2'>
                            <Select
                                disabled={loading}
                                label={t('Date Range')}
                                variant="underlined"
                                defaultSelectedKeys={["all"]}
                                value={date_range}
                                onChange={(e) => {
                                    setDateRange(e.target.value);
                                    setShouldSearch(true);
                                }}
                            >
                                {dateRanges.map((range) => (
                                    <SelectItem key={range.key} value={range.key}>
                                        {range.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </h3>
                {tweets.some(row => row.length > 0) ? (
                    <div className="flex justify-between gap-5 mt-8">
                        {tweets.map((row, index) => (
                            <div key={index} className="w-1/3 flex flex-col gap-5">
                                {row.map((tweet) => (
                                    <TweetCard locale={locale} key={tweet.tweet_id} tweet={tweet} />
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-44 text-default-500">
                        <RiSearchLine size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-sm mt-2">{t('Search results will be displayed here')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}