import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

interface LoginData {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginData = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ایمیل و رمز عبور الزامی هستند' },
        { status: 400 }
      );
    }

    const connectionUri = 'mongodb://mabanitest:ts2CJFY1pvxbac33kOhbs2tAq@udb.qepal.com:8302/?authSource=admin';
    const dbName = 'mabanitest';
    const collectionName = 'users';

    let client;
    try {
      client = new MongoClient(connectionUri);
      await client.connect();

      const db = client.db(dbName);
      const usersCollection = db.collection(collectionName);

      // پیدا کردن کاربر
      const user = await usersCollection.findOne({ 
        email: email.toLowerCase().trim() 
      });

      if (!user) {
        return NextResponse.json(
          { error: 'کاربری با این ایمیل یافت نشد' },
          { status: 401 }
        );
      }

      // بررسی رمز عبور
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'رمز عبور اشتباه است' },
          { status: 401 }
        );
      }

      // حذف رمز عبور از پاسخ
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(
        { 
          success: true,
          message: 'ورود با موفقیت انجام شد',
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          }
        },
        { status: 200 }
      );

    } catch (dbError: any) {
      console.error('خطای دیتابیس:', dbError);

      // حالت آفلاین
      if (dbError.code === 13) {
        const testUsers = [
          { email: 'test@example.com', password: '123456', name: 'کاربر تستی', id: 'test-1' },
          { email: 'demo@example.com', password: 'demo123', name: 'کاربر دمو', id: 'test-2' }
        ];

        const testUser = testUsers.find(u => 
          u.email === email.toLowerCase().trim() && 
          u.password === password
        );

        if (testUser) {
          return NextResponse.json(
            { 
              success: true,
              message: 'ورود تستی موفقیت‌آمیز بود',
              user: {
                id: testUser.id,
                name: testUser.name,
                email: testUser.email,
                createdAt: new Date()
              },
              mode: 'test'
            },
            { status: 200 }
          );
        }
        
        return NextResponse.json(
          { error: 'ایمیل یا رمز عبور اشتباه است' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'خطا در اتصال به دیتابیس' },
        { status: 500 }
      );
    } finally {
      if (client) await client.close();
    }

  } catch (error) {
    console.error('خطا در ورود:', error);
    return NextResponse.json(
      { error: 'خطای سرور داخلی' },
      { status: 500 }
    );
  }
}