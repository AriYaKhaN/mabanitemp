import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

interface AdminLoginData {
  email: string;
  password: string;
  taId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, taId }: AdminLoginData = await request.json();

    // اعتبارسنجی فیلدها
    if (!email || !password || !taId) {
      return NextResponse.json(
        { error: 'تمام فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

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

      // پیدا کردن ادمین
      const admin = await adminsCollection.findOne({ 
        email: email.toLowerCase(),
        taId: taIdNum // بررسی اینکه TA ID هم مطابقت دارد
      });

      if (!admin) {
        return NextResponse.json(
          { error: 'ادمینی با این مشخصات یافت نشد' },
          { status: 400 }
        );
      }

      // بررسی رمز عبور
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'رمز عبور نامعتبر است' },
          { status: 400 }
        );
      }

      // اطلاعات ادمین برای بازگشت (بدون پسورد)
      const adminInfo = {
        id: admin._id.toString(),
        fullName: admin.fullName,
        email: admin.email,
        taId: admin.taId,
        role: admin.taId === 0 ? 'super_admin' : 'ta',
        createdAt: admin.createdAt
      };

      return NextResponse.json({
        success: true,
        message: 'ورود موفقیت‌آمیز بود',
        admin: adminInfo
      });

    } catch (dbError: any) {
      console.error('خطا در ورود ادمین:', dbError);
      return NextResponse.json(
        { error: 'خطای دیتابیس' },
        { status: 500 }
      );
    } finally {
      if (client) await client.close();
    }

  } catch (error) {
    console.error('خطا در ورود ادمین:', error);
    return NextResponse.json(
      { error: 'خطای سرور داخلی' },
      { status: 500 }
    );
  }
}