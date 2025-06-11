import { getTranslation } from "@/lib/i18n";
import { Avatar, Button } from "@heroui/react";
import Link from "next/link";
import { parseTweetData } from "@/lib/parser";
import ShareButtons from "@/app/components/ui/ShareButtons";
import Explore from "@/app/components/ui/Explore";

export default async function TweetDetail({params}) {
    const {slug, locale='en'} = params;
    const t = function(key){
        return getTranslation(locale, key);
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const detailResp = await fetch(`${baseUrl}/api/requestdb?action=detail&tweet_id=${slug}`).then(res => res.json());
    const tweet = detailResp.data[0];

    const linkConvert = (text) => {
        // 替换链接
        text = text.replace(/https?:\/\/[^\s]+/g, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500">${url}</a>`;
        });
        
        // 替换 @用户名
        text = text.replace(/@(\w+)/g, (match, username) => {
            return `<a href="https://x.com/${username}" target="_blank" rel="noopener noreferrer" class="text-blue-500">${match}</a>`;
        });
        
        return text;
    }

    const getHTML = () =>{
        const tweets = parseTweetData(JSON.parse(tweet.tweet_data));
        
        return (
            <div 
                className="article-content text-medium text-default-600 whitespace-pre-wrap break-words max-w-full"
            >
                {tweets.map((tweet, index) => (
                    <>
                        <pre dangerouslySetInnerHTML={{__html: linkConvert(tweet.text)}}></pre>
                        { 
                            tweet.medias.map((media, index) => {
                                if(media.type==="photo"){
                                    return <img src={media.url} alt={media.alt} />
                                }else if(media.type==="video"){
                                    return <video controls src={media.url} alt={media.alt} />
                                }
                            })
                        }
                    </>
                ))}
            </div>
        )
    }

    return (
        <div className="page-container flex flex-row gap-6 p-4 mt-4 w-full">
            <div className="flex flex-col flex-1 gap-4 box-border border-foreground/10 border-[1px] rounded-2xl p-8 bg-[#f8f8f8] dark:bg-foreground/5">
                <div className="flex gap-4">
                    <div className="box-border flex-shrink-0 p-1">
                        <Avatar disableAnimation isBordered src={tweet.profile_image} size="lg" radius="full"/>
                    </div>
                    <div className="flex flex-col gap-1 pt-3 flex-1 flex-shrink-0">
                        <h1 className="text-medium font-semibold leading-none text-default-600">{tweet.name}</h1>
                        <p className="text-small text-default-400">@{tweet.screen_name}</p>
                    </div>
                    <div className="flex flex-col gap-2 pt-2 items-end">
                        <Button color="primary" size="sm" radius="full" asChild>
                            <Link href={`https://x.com/${tweet.screen_name}/status/${tweet.tweet_id}`} target="_blank">{t('Goto Tweet')}</Link>
                        </Button>
                        <p className="text-small text-default-400">
                            {new Date(tweet.post_at).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="w-full h-[1px] bg-foreground/10 mt-3"></div>
                <div className="text-medium text-default-600 whitespace-pre-wrap break-words max-w-full mt-3">
                    {getHTML()}
                </div>
            </div>
            <div className="flex flex-col gap-6 w-[300px] flex-shrink-0 box-border">
                <div className="border-foreground/10 border-[1px] rounded-2xl p-8 bg-[#f8f8f8] dark:bg-foreground/5">
                    <div className="text-medium font-semibold">{t('Share')}</div>
                    <div className="w-full h-[1px] bg-foreground/10 mt-3"></div>
                    <ShareButtons />
                </div>
                <Explore locale={locale}/>
            </div>
        </div>
    )
}