export default async function sitemap() {
    const baseUrl = 'https://twitterxdownload.com';

    // 获取最新推文用于 sitemap
    const tweets = await fetch(`${baseUrl}/api/requestdb?action=all`, {
        cache: 'no-store'
    }).then(res => res.json()).then(data => data.data || []).catch(() => []);

    const staticPages = [
        {
            url: `${baseUrl}/en`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/zh-CN`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/ja`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/ko`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/fr`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/zh-HK`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/downloader`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/tweets`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/terms-of-service`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    const tweetPages = tweets.map(tweet => ({
        url: `${baseUrl}/tweets/${tweet.tweet_id}`,
        lastModified: new Date(tweet.post_at || Date.now()),
        changeFrequency: 'never',
        priority: 1.0,
    }));

    return [...staticPages, ...tweetPages];
}

// 导出 sitemap 生成器配置
export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 每天重新生成一次