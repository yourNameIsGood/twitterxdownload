'use client';

import { useEffect, useState } from 'react';
import { Card, CardFooter, CardHeader, Button, Avatar, Skeleton,ScrollShadow } from "@heroui/react";
import { getTranslation } from "@/lib/i18n";
let creators = [];

export default function HotCreators({ locale = 'en' }) {
    const t = function (key) {
        return getTranslation(locale, key);
    }
    const [creatorsState, setCreatorsState] = useState(creators);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (creators.length === 0) {
            fetch('/api/requestdb?action=creators')
                .then(response => response.json())
                .then(data => {
                    setCreatorsState(data.data);
                    creators = data.data;
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching tweets:', error);
                    setIsLoading(false);
                });
        }else{
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-between gap-5 overflow-x-auto pr-6">
                {[1,2,3,4,5,6].map((index) => (
                    <Card
                        shadow="none"
                        className="select-none box-border border-foreground/10 border-[1px] min-w-[160px] max-w-[20%] p-2 flex-shrink-0"
                        radius="lg"
                        key={`skeleton-${index}`}
                    >
                        <CardHeader className="justify-between gap-5">
                            <Skeleton className="rounded-full w-10 h-10" />
                            <div className="flex flex-col gap-1 items-start justify-center overflow-hidden flex-1">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </CardHeader>
                        <CardFooter className="justify-between before:bg-white/10 overflow-hidden w-[calc(100%_-_8px)]">
                            <Skeleton className="h-6 w-[100px] rounded-full m-auto" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <>
            <ScrollShadow className="w-full flex gap-5" orientation="horizontal">
                {creatorsState.map((creator) => (
                    <Card
                        shadow="none"
                        disableRipple
                        className="select-none box-border border-foreground/10 border-[1px] min-w-[160px] max-w-[20%] p-2 flex-shrink-0"
                        radius="lg"
                        key={creator.screen_name}
                    >
                        <CardHeader className="justify-between gap-5">
                            <Avatar
                                disableAnimation={true}
                                isBordered
                                radius="full"
                                size="md"
                                src={creator.profile_image}
                            />
                            <div className="flex flex-col gap-1 items-start justify-center overflow-hidden flex-1">
                                <h4 className="w-full text-small font-semibold leading-none text-default-600 text-ellipsis overflow-hidden whitespace-nowrap">{creator.name}</h4>
                                <h5 className="w-full text-small tracking-tight text-default-400 text-ellipsis overflow-hidden whitespace-nowrap">@{creator.screen_name}</h5>
                            </div>
                        </CardHeader>
                        <CardFooter className="justify-between before:bg-white/10 overflow-hidden w-[calc(100%_-_8px)]">
                            <Button
                                className="text-tiny text-white m-auto w-[100px]"
                                color="primary"
                                radius="full"
                                size="sm"
                                onPress={() => {
                                    window.open(`https://x.com/intent/follow?screen_name=${creator.screen_name}`, '_blank');
                                }}
                            >
                                {t('Follow')}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </ScrollShadow>
        </>
    );
}