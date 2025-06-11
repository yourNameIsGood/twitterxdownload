'use client';

import { Button } from "@heroui/react";
import { RiFileCopyLine,RiTwitterXLine,RiFacebookFill,RiRedditLine } from "@remixicon/react";


export default function ShareButtons() {
    return (
        <div className="flex flex-row gap-2 mt-6 justify-between">
            <Button isIconOnly color="primary" size="md" title="Copy" aria-label="Copy">
                <RiFileCopyLine />
            </Button>
            <Button isIconOnly color="primary" size="md" title="Share to Twitter" aria-label="Share to Twitter">
                <RiTwitterXLine />
            </Button>
            <Button isIconOnly color="primary" size="md" title="Share to Facebook" aria-label="Share to Facebook">
                <RiFacebookFill />
            </Button>
            <Button isIconOnly color="primary" size="md" title="Share to Reddit" aria-label="Share to Reddit">
                <RiRedditLine />
            </Button>
        </div>
    )
}