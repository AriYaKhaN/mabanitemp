import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    // تست اتصال به دیتابیس
    const usersCollection = await getCollection('users');
    
    // تست عملیات ساده - استفاده از متدهای معتبر
    const count = await usersCollection.countDocuments();
    const collections = await usersCollection.db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: 'اتصال به دیتابیس موفقیت‌آمیز بود',
      database: {
        name: usersCollection.db.databaseName,
        collections: collections.map(col => col.name),
        usersCount: count
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('خطا در اتصال به دیتابیس:', error);
    
    return NextResponse.json({
      success: false,
      error: 'خطا در اتصال به دیتابیس',
      details: error instanceof Error ? error.message : 'خطای ناشناخته',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}