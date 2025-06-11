const auth_api = 'https://edge.microsoft.com/translate/auth';
const translate_api = 'https://api.cognitive.microsofttranslator.com/translate';

let auth_token = '';

async function translate(text, targetLang){

    try {
        // 获取授权令牌
        if (!auth_token) {
            const authToken = await fetch(auth_api, {
                method: 'GET',
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,ja;q=0.8",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded",
                    "pragma": "no-cache",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                referrer: "https://twitterxdownload.com/",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: null,
                mode: "cors",
                credentials: "omit"
            });

            if (!authToken.ok) {
                console.error('授权请求失败:', authToken.status, authToken.statusText);
                return text;
            }

            auth_token = await authToken.text();
        }
        
        if (!auth_token) {
            console.error('授权令牌为空');
            return text;
        }
        
        // 构建请求体
        const requestBody = [{
            Text: text
        }];
        
        // 发送翻译请求
        const response = await fetch(`${translate_api}?to=${targetLang}&api-version=3.0&includeSentenceLength=true`, {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${auth_token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('翻译请求失败:', response.status, response.statusText, errorText);
            return text;
        }
        
        // 解析响应
        const result = await response.json();
        
        // 如果有翻译结果，返回翻译后的文本
        if (result && result.length > 0 && result[0].translations && result[0].translations.length > 0) {
            return result[0].translations[0].text;
        }
    } catch (error) {
        console.error('翻译失败:', error);
    }

    return text;
}

export { translate };