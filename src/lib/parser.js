
function parseFullText(fullText,tweet) {
    // return fullText;
    // Extract all t.co links
    const urlRegex = /(https?:\/\/[a-zA-Z0-9_\-\.]+(?:\/[^\s]*)?(?:https?:\/\/[^\s]*)?)/g;
    const tcoLinks = fullText.match(urlRegex) || [];

    // Replace t.co links with their expanded URLs if available
    if (tcoLinks.length > 0 && tweet.legacy?.entities?.urls) {
        for (let i = 0; i < tcoLinks.length; i++) {
            const tcoLink = tcoLinks[i];
            const urlEntity = tweet.legacy.entities.urls.find(url => url.url === tcoLink);
            
            if (urlEntity) {
                // Replace with expanded URL
                fullText = fullText.replace(tcoLink, `${urlEntity.expanded_url}`);
            } else {
                // If no matching expanded URL found, remove the t.co link
                fullText = fullText.replace(tcoLink, '');
            }
        }
    }

    // if(tweet.legacy && tweet.legacy.quoted_status_permalink){
    //     // quote 引用
    //     fullText += `\n\n<a href="${tweet.legacy.quoted_status_permalink.expanded}" target="_blank" rel="noopener noreferrer">${tweet.legacy.quoted_status_permalink.expanded}</a>`;
    // }

    // 将 &amp; 转换为 &
    fullText = fullText.replace(/&amp;/g, '&');
    return fullText;
}
function parseTweetData(oriData) {
    try {
        const entries = oriData.data.threaded_conversation_with_injections_v2.instructions[0].entries;
        const tweets = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            // Process main tweet
            if (entry.content?.__typename === "TimelineTimelineItem") {
                if (entry.content.itemContent?.tweet_results?.result) {
                    const tweet = entry.content.itemContent.tweet_results.result;

                    const user = tweet.core.user_results.result.legacy;
                    const screen_name = user.screen_name;
                    // 使用BigInt处理Twitter ID，因为Twitter ID可能超出JavaScript Number类型的安全整数范围
                    let legacy = tweet.legacy || tweet.tweet.legacy;
                    const tweetId = BigInt(legacy.id_str);
                    
                    let fullText = tweet.note_tweet?.note_tweet_results.result.text || legacy.full_text || '';
                    fullText = parseFullText(fullText,tweet);

                    // 检查是否有URLs并添加到文章内容
                    // if (legacy.entities?.urls && legacy.entities.urls.length > 0) {
                    //     for (let k = 0; k < legacy.entities.urls.length; k++) {
                    //         const url = legacy.entities.urls[k];
                    //         fullText += `${url.expanded_url}`;
                    //     }
                    // }
                    
                    const tweetData = {
                        text: fullText,
                        medias: []
                    };

                    // Extract media URLs
                    if (legacy.extended_entities?.media) {
                        for (let j = 0; j < legacy.extended_entities.media.length; j++) {
                            const media = legacy.extended_entities.media[j];
                            if (media.type === 'photo') {
                                tweetData.medias.push({
                                    url: media.media_url_https,
                                    type: 'photo'
                                });
                            } else if (media.type === 'video') {
                                // Get highest quality video URL
                                const variants = media.video_info.variants;
                                const mp4Variants = variants.filter(v => v.content_type === 'video/mp4');
                                if (mp4Variants.length > 0) {
                                    // Sort by bitrate, choose highest quality
                                    mp4Variants.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                                    tweetData.medias.push({
                                        url: mp4Variants[0].url,
                                        type: 'video',
                                        id_str: media.id_str,
                                        duration_millis: media.video_info.duration_millis,
                                        status_id: tweetId,
                                        screen_name: screen_name
                                    });
                                }
                            }
                        }
                    }

                    tweets.push(tweetData);
                }
            }
            // Process replies and tweets in thread
            else if (entry.content?.__typename === "TimelineTimelineModule") {
                // Process items in module, only process tweets in thread, not replies
                if (entry.content.items && Array.isArray(entry.content.items)) {
                    for (let j = 0; j < entry.content.items.length; j++) {
                        const item = entry.content.items[j];
                        
                        // Check if it's a tweet in thread (not a reply)
                        if (item.item?.itemContent?.tweet_results?.result) {
                            const tweet = item.item.itemContent.tweet_results.result;
                            if(!tweet.legacy)continue;
                            const tweetId = tweet.legacy?BigInt(tweet.legacy.id_str):'';
                            const user = tweet.core.user_results.result.legacy;
                            const screen_name = user.screen_name;
                            
                            // Check if it's a tweet in thread (by checking if it's a self-thread or same author as original tweet)
                            const tweetDisplayType = item.item.itemContent.tweetDisplayType;
                            const isThreadTweet = tweetDisplayType === 'SelfThread';
                            
                            // Only process tweets in thread
                            if (isThreadTweet) {
                                let fullText = tweet.note_tweet?.note_tweet_results.result.text || tweet.legacy?.full_text || '';
                                fullText = parseFullText(fullText,tweet);

                                // 检查是否有URLs并添加到文章内容
                                // if (tweet.legacy?.entities?.urls && tweet.legacy.entities.urls.length > 0) {
                                //     for (let k = 0; k < tweet.legacy.entities.urls.length; k++) {
                                //         const url = tweet.legacy.entities.urls[k];
                                //         fullText += `${url.expanded_url}`;
                                //     }
                                // }
                                
                                const tweetData = {
                                    text: fullText,
                                    medias: []
                                };

                                // Extract media URLs
                                if (tweet.legacy?.extended_entities?.media) {
                                    for (let k = 0; k < tweet.legacy.extended_entities.media.length; k++) {
                                        const media = tweet.legacy.extended_entities.media[k];
                                        if (media.type === 'photo') {
                                            tweetData.medias.push({
                                                url: media.media_url_https,
                                                type: 'photo'
                                            });
                                        } else if (media.type === 'video') {
                                            const variants = media.video_info.variants;
                                            const mp4Variants = variants.filter(v => v.content_type === 'video/mp4');
                                            if (mp4Variants.length > 0) {
                                                mp4Variants.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                                                tweetData.medias.push({
                                                    url: mp4Variants[0].url,
                                                    type: 'video',
                                                    id_str: media.id_str,
                                                    duration_millis: media.video_info.duration_millis,
                                                    video_status_url: `https://x.com/${screen_name}/status/${tweetId}/video/1`,
                                                    status_id: tweetId,
                                                    screen_name: screen_name
                                                });
                                            }
                                        }
                                    }
                                }

                                tweets.push(tweetData);
                            }
                        }
                    }
                }
            }
        }

        console.log('Parsed ' + tweets.length + ' tweets');
        return tweets;
    } catch (error) {
        console.error('Error parsing tweet data:', error);
        
        return [];
    }
}
function parseTweetData2(oriData) {
    try {
        const entries = oriData.data.threaded_conversation_with_injections_v2.instructions[0].entries;
        let articleContent = '';
        
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            // Process main tweet
            if (entry.content?.__typename === "TimelineTimelineItem") {
                if (entry.content.itemContent?.tweet_results?.result) {
                    const tweet = entry.content.itemContent.tweet_results.result;

                    let fullText = tweet.note_tweet?.note_tweet_results.result.text || tweet.legacy?.full_text || '';
                    // Remove all t.co links
                    fullText = parseFullText(fullText,tweet);
                    
                    // Add text to article content with white-space: pre-wrap to preserve line breaks
                    articleContent += `<pre>${fullText}</pre>`;

                    // 检查是否有URLs并添加到文章内容
                    if (tweet.legacy?.entities?.urls && tweet.legacy.entities.urls.length > 0) {
                        articleContent += `<pre>`;
                        for (let k = 0; k < tweet.legacy.entities.urls.length; k++) {
                            const url = tweet.legacy.entities.urls[k];
                            articleContent += `<a href="${url.expanded_url}" target="_blank" rel="noopener noreferrer">${url.display_url}</a><br>`;
                        }
                        articleContent += `</pre>`;
                    }

                    // Extract media URLs and add to article content
                    if (tweet.legacy?.extended_entities?.media) {
                        // articleContent += `<pre>`;
                        for (let j = 0; j < tweet.legacy.extended_entities.media.length; j++) {
                            const media = tweet.legacy.extended_entities.media[j];
                            if (media.type === 'photo') {
                                articleContent += `<img src="${media.media_url_https}" alt="Image ${j+1}" />\n`;
                            } else if (media.type === 'video' || media.type === 'animated_gif') {
                                // Get highest quality video URL
                                const variants = media.video_info.variants;
                                const mp4Variants = variants.filter(v => v.content_type === 'video/mp4');
                                if (mp4Variants.length > 0) {
                                    // Sort by bitrate, choose highest quality
                                    mp4Variants.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                                    articleContent += `<video controls src="${mp4Variants[0].url}"></video>\n`;
                                }
                            }
                        }
                        // articleContent += `</pre>`;
                    }
                }
            }
            // Process replies and tweets in thread
            else if (entry.content?.__typename === "TimelineTimelineModule") {
                // Process items in module, only process tweets in thread, not replies
                if (entry.content.items && Array.isArray(entry.content.items)) {
                    for (let j = 0; j < entry.content.items.length; j++) {
                        const item = entry.content.items[j];
                        
                        // Check if it's a tweet in thread (not a reply)
                        if (item.item?.itemContent?.tweet_results?.result) {
                            const tweet = item.item.itemContent.tweet_results.result;
                            
                            // Check if it's a tweet in thread (by checking if it's a self-thread or same author as original tweet)
                            const tweetDisplayType = item.item.itemContent.tweetDisplayType;
                            const isThreadTweet = tweetDisplayType === 'SelfThread';
                            
                            // Only process tweets in thread
                            if (isThreadTweet) {
                                let fullText = tweet.note_tweet?.note_tweet_results.result.text || tweet.legacy?.full_text || '';
                                fullText = parseFullText(fullText,tweet);
                                
                                // Add text to article content with white-space: pre-wrap to preserve line breaks
                                articleContent += `<pre>${fullText}</pre>`;

                                // Extract media URLs and add to article content
                                if (tweet.legacy?.extended_entities?.media) {
                                    // articleContent += `<pre>`;
                                    for (let k = 0; k < tweet.legacy.extended_entities.media.length; k++) {
                                        const media = tweet.legacy.extended_entities.media[k];
                                        if (media.type === 'photo') {
                                            articleContent += `<img src="${media.media_url_https}" alt="Image ${k+1}" />\n`;
                                        } else if (media.type === 'video' || media.type === 'animated_gif') {
                                            const variants = media.video_info.variants;
                                            const mp4Variants = variants.filter(v => v.content_type === 'video/mp4');
                                            if (mp4Variants.length > 0) {
                                                mp4Variants.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                                                articleContent += `<video controls src="${mp4Variants[0].url}"></video>\n`;
                                            }
                                        }
                                    }
                                    // articleContent += `</pre>`;
                                    articleContent += '\n';
                                }
                            }
                        }
                    }
                }
            }
        }

        return articleContent;
    } catch (error) {
        console.error('Error parsing tweet data:', error);
        return '';
    }
}

export { parseTweetData };