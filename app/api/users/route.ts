import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// const MONGODB_URI = process.env.MONGODB_URI!;
// const DB_NAME = process.env.DB_NAME || 'your_database_name';

export async function GET(request: NextRequest) {
  let client;

  try {
    client = new MongoClient('mongodb://mabanitest:ts2CJFY1pvxbac33kOhbs2tAq@udb.qepal.com:8302/?authSource=admin');
    await client.connect();

    const database = client.db('mabanitest');
    const usersCollection = database.collection('students');

    // دریافت تمام کاربران
    const users = await usersCollection.find({}).toArray();

    // تبدیل ObjectId به string برای نمایش در کلاینت
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      joinDate: user.joinDate || '',
      status: user.status || 'active',
      role: user.role || 'user',
      avatar: user.avatar || '👤',
      createdAt: user.createdAt || user._id.getTimestamp().toISOString(),
      lastLogin: user.lastLogin || null
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      count: formattedUsers.length
    });

  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'خطا در ارتباط با پایگاه داده'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}