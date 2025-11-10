import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

interface AdminRegisterData {
  fullName: string;
  email: string;
  password: string;
  taId: string; // اضافه کردن TA ID
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, taId }: AdminRegisterData = await request.json();

    // اعتبارسنجی TA ID
    const taIdNum = parseInt(taId);
    if (taIdNum !== 0 && (taIdNum < 5 || taIdNum > 9)) {
      return NextResponse.json(
        { error: 'شناسه TA باید بین 5-9 یا 0 باشد' },
        { status: 400 }
      );
    }

    const connectionUri = 'mongodb://mabanitest:ts2CJFY1pvxbac33kOhbs2tAq@udb.qepal.com:8302/?authSource=admin';

    let client;
    try {
      client = new MongoClient(connectionUri);
      await client.connect();

      const db = client.db('mabanitest');
      const adminsCollection = db.collection('admins');

      // بررسی وجود ادمین با این ایمیل یا TA ID
      const existingAdmin = await adminsCollection.findOne({
        $or: [
          { email: email.toLowerCase() },
          { taId: taIdNum }
        ]
      });

      if (existingAdmin) {
        return NextResponse.json(
          { error: 'این ایمیل یا شناسه TA قبلاً ثبت شده است' },
          { status: 400 }
        );
      }

      // هش کردن رمز عبور
      const hashedPassword = await bcrypt.hash(password, 12);

      // ایجاد ادمین جدید
      const newAdmin = {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        taId: taIdNum,
        role: taIdNum === 0 ? 'super_admin' : 'ta',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // ذخیره ادمین
      const result = await adminsCollection.insertOne(newAdmin);

      return NextResponse.json(
        { 
          success: true,
          message: 'ادمین با موفقیت ثبت نام شد',
          adminId: result.insertedId.toString(),
          taId: taIdNum
        },
        { status: 201 }
      );

    } catch (dbError: any) {
      if (dbError.code === 13) {
        return NextResponse.json(
          { 
            success: false,
            error: 'خطای دسترسی به دیتابیس'
          },
          { status: 403 }
        );
      }
      throw dbError;
    } finally {
      if (client) await client.close();
    }

  } catch (error) {
    console.error('خطا در ثبت نام ادمین:', error);
    return NextResponse.json(
      { error: 'خطای سرور داخلی' },
      { status: 500 }
    );
  }
}