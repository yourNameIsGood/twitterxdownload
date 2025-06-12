// src/app/api/test-db/route.js
import dbConnect from '@/lib/db';
import Tweets from '@/lib/models/tweets';


const HiddenScreenNames = [
    "whyyoutouzhele",
    "lammichaeltw",
    "Sexytoxiaoshu",
    "justice_trail",
    "xiaolei404",
    "ezshine"
]

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const baseFilter = {
        screen_name: { $nin: HiddenScreenNames }
    };

    let allData;
    let count = 0;
    if (!action || action === 'recent') {
      const result = await Tweets.aggregate([
        {
          $facet: {
            data: [
              { $match: { ...baseFilter,is_hidden: { $ne: 1 }, tweet_media: { $ne: null, $ne: '' } } },
              { $sort: { created_at: -1 } }, 
              { $limit: 15 }
            ],
            count: [
              { $count: "total" }
            ]
          }
        }
      ]);
      allData = result[0].data;
      count = result[0].count[0]?.total || 0;
    } else if (action === 'random') {
      allData = await Tweets.aggregate([
        { $match: baseFilter },
        { $sample: { size: 10 } }
      ]);
    } else if (action === 'creators') {
      allData = await Tweets.aggregate([
        { $match: baseFilter },
        { $group: {
          _id: "$screen_name", 
          count: { $sum: 1 },
          name: { $first: "$name" },
          screen_name: { $first: "$screen_name" },
          profile_image: { $first: "$profile_image" }
        }},
        { $project: {
          _id: 0,
          name: 1,
          screen_name: "$_id",
          count: 1,
          profile_image: 1
        }},
        { $sort: { count: -1 } },
        { $limit: 6 }
      ]);
    } else if (action === 'detail') {
        const tweet_id = searchParams.get('tweet_id');
        allData = await Tweets.find({ tweet_id }).limit(1);
    } else if (action === 'search') {
        const name = searchParams.get('name');
        const screen_name = searchParams.get('screen_name');
        const text = searchParams.get('text');
        const content_type = searchParams.get('content_type');
        const date_range = searchParams.get('date_range');

        // 构建查询条件
        const query = {
            ...(name ? { name: { $regex: name, $options: 'i' } } : {}),
            ...(screen_name ? { screen_name: { $regex: screen_name, $options: 'i' } } : {}),
            ...(text ? { tweet_text: { $regex: text, $options: 'i' } } : {})
        };

        // 内容类型过滤
        if (content_type === 'video') {
            query.tweet_media = { $regex: '.mp4' };
        } else if (content_type === 'image') {
            query.tweet_media = { 
                $ne: null,
                $ne: '',
                $not: { $regex: '.mp4' }
            };
        }

        // 时间范围过滤
        if (date_range === 'week') {
            query.post_at = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        } else if (date_range === 'month') {
            query.post_at = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        } else if (date_range === 'quarter') {
            query.post_at = { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
        }

        // 执行查询并获取结果
        const result = await Tweets.aggregate([
            { $match: query },
            { $sort: { post_at: -1 } },
            { $limit: 15 }
        ]);

        allData = result;
    }
    
    return Response.json({ 
      success: true, 
      count: count,
      data: allData 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}