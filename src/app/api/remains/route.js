export async function GET() {
  try {
    const response = await fetch('https://api.twitterxdownload.com/api/remains', {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    
    return Response.json({ 
      success: true,
      data: data.data
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}