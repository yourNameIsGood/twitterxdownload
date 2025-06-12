import dbConnect from '@/lib/db';
import Tweets from '@/lib/models/tweets';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const adminpwd = searchParams.get('adminpwd');
        const tweet_id = searchParams.get('tweet_id');

        if(!tweet_id){
            return Response.json({ success: false, error: 'Tweet ID is required' }, { status: 400 });
        }

        if(!adminpwd || adminpwd !== process.env.ADMIN_PASSWORD){
            return Response.json({ success: false, error: 'Invalid admin password' }, { status: 401 });
        }

        await dbConnect();

        // 执行更新
        await Tweets.findOneAndUpdate(
            { tweet_id: tweet_id },
            { 
                $set: { 
                    is_hidden: 1
                } 
            },
            { 
                new: true,
                runValidators: true,
                strict: true
            }
        );
        
        return Response.json({ 
            success: true
        });
  
    } catch (error) {
        return Response.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
  }