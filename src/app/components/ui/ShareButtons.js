'use client';

import { Button } from "@heroui/react";
import { RiFileCopyLine,RiTwitterXLine,RiFacebookFill,RiRedditLine } from "@remixicon/react";


export default function ShareButtons() {

    const handleCopy = () => {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;
        
        // 使用剪贴板API复制内容
        document.addEventListener('copy', function(e) {
            e.clipboardData.setData('text/html', articleContent.innerHTML);
            e.clipboardData.setData('text/plain', articleContent.innerHTML);
            e.preventDefault();
        });
        document.execCommand('copy');
    }
    const handleShareToTwitter = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
    }
    const handleShareToFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
    const handleShareToReddit = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.reddit.com/submit?url=${url}`, '_blank');
    }


    return (
        <div className="flex flex-row gap-2 mt-6 justify-between">
            <Button isIconOnly color="primary" size="md" title="Copy" aria-label="Copy" onPress={handleCopy}>
                <RiFileCopyLine />
            </Button>
            <Button isIconOnly color="primary" size="md" title="Share to Twitter" aria-label="Share to Twitter" onPress={handleShareToTwitter}>
                <RiTwitterXLine />
            </Button>
            <Button isIconOnly color="primary" size="md" title="Share to Facebook" aria-label="Share to Facebook" onPress={handleShareToFacebook}>
                <RiFacebookFill />
            </Button>
            <Button isIconOnly color="primary" size="md" title="Share to Reddit" aria-label="Share to Reddit" onPress={handleShareToReddit}>
                <RiRedditLine />
            </Button>
        </div>
    )
}