import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  let client;
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI در env تعریف نشده'
      }, { status: 500 });
    }

    console.log('اتصال به:', uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://***:***@'));

    // تست اتصال مستقیم
    client = new MongoClient(uri);
    await client.connect();

    // تست دسترسی به دیتابیس
    const db = client.db();
    const adminDb = db.admin();
    
    // اطلاعات سرور
    const serverInfo = await adminDb.serverInfo();
    
    // لیست دیتابیس‌ها
    const databases = await adminDb.listDatabases();
    
    // تست ایجاد کالکشن
    const testCollection = db.collection('test_connection');
    await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'اتصال موفقیت‌آمیز بود'
    });

    const testDoc = await testCollection.findOne({ test: true });
    await testCollection.deleteOne({ test: true });

    return NextResponse.json({
      success: true,
      message: 'اتصال به دیتابیس موفق بود',
      connection: {
        server: serverInfo.version,
        databases: databases.databases.map((db: any) => db.name),
        currentDatabase: db.databaseName
      },
      test: testDoc
    });

  } catch (error: any) {
    console.error('خطای کامل اتصال:', error);
    
    let errorMessage = 'خطای ناشناخته';
    if (error.name === 'MongoServerSelectionError') {
      errorMessage = 'سرور MongoDB در دسترس نیست';
    } else if (error.name === 'MongoNetworkError') {
      errorMessage = 'خطای شبکه - اتصال برقرار نشد';
    } else if (error.name === 'MongoAuthenticationError') {
      errorMessage = 'خطای احراز هویت - نام کاربری یا رمز عبور اشتباه';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'آدرس سرور یافت نشد';
    } else {
      errorMessage = error.message;
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      errorType: error.name,
      errorCode: error.code
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}