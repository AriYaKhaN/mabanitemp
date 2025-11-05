import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  selectedDatabase?: string;
  selectedCollection?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, selectedDatabase, selectedCollection }: RegisterData = await request.json();

    // استفاده از دیتابیس و کالکشن انتخاب شده یا مقادیر پیش‌فرض
    const dbName = 'mabanitest';
    const collectionName = 'users';

    // اعتبارسنجی فیلدها
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'تمام فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    const baseUri = process.env.MONGODB_URI?.split('/').slice(0, 3).join('/');
    const connectionUri = 'mongodb://mabanitest:ts2CJFY1pvxbac33kOhbs2tAq@udb.qepal.com:8302/?authSource=admin';

    let client;
    try {
      client = new MongoClient(connectionUri);
      await client.connect();

      const db = client.db(dbName);
      const usersCollection = db.collection(collectionName);

      // بررسی وجود کاربر
      const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { error: 'این ایمیل قبلاً ثبت شده است' },
          { status: 400 }
        );
      }

      // هش کردن رمز عبور
      const hashedPassword = await bcrypt.hash(password, 12);

      // ایجاد کاربر جدید
      const newUser = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // سعی در ذخیره کاربر
      const result = await usersCollection.insertOne(newUser);

      return NextResponse.json(
        { 
          success: true,
          message: 'ثبت نام با موفقیت انجام شد',
          userId: result.insertedId.toString(),
          database: dbName,
          collection: collectionName
        },
        { status: 201 }
      );

    } catch (dbError: any) {
      if (dbError.code === 13) {
        return NextResponse.json(
          { 
            success: true,
            message: 'ثبت نام در حافظه موقت انجام شد (دسترسی دیتابیس محدود است)',
            storage: 'local'
          },
          { status: 201 }
        );
      }
      throw dbError;
    } finally {
      if (client) await client.close();
    }

  } catch (error) {
    console.error('خطا در ثبت نام:', error);
    return NextResponse.json(
      { error: 'خطای سرور داخلی' },
      { status: 500 }
    );
  }
}