// 处理 OPTIONS 请求
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS', 
      'Access-Control-Allow-Headers': '*'
    }
  });
}

// 处理 POST 请求
export async function POST(request) {
  try {
    // 获取请求数据
    const postData = await request.json();

    // 检查是否有推文数据
    if (!postData) {
      return Response.json(
        { error: '缺少请求数据' },
        { status: 400 }
      );
    }

    // 获取 OAuth 认证头信息
    const oauthHeader = request.headers.get('authorization');

    if (!oauthHeader) {
      return Response.json(
        { error: '缺少认证信息' },
        { status: 400 }
      );
    }

    // Twitter API v2 地址
    const apiUrl = 'https://api.twitter.com/2/tweets';

    // 发送请求到 Twitter API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': oauthHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    // 获取响应数据
    const data = await response.json();

    // 返回 Twitter API 的响应
    return Response.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Twitter API Error:', error);
    return Response.json(
      { error: '请求Twitter API失败' },
      { status: 500 }
    );
  }
}
