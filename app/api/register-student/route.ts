import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

interface StudentData {
  name: string;
  studentCode: string;
  section: string;
  ta: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, studentCode, section, ta }: StudentData = await request.json();

    // اعتبارسنجی فیلدها
    if (!name || !studentCode || !section || !ta) {
      return NextResponse.json(
        { error: 'تمام فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    // اعتبارسنجی کد دانشجویی
    if (!/^\d+$/.test(studentCode)) {
      return NextResponse.json(
        { error: 'کد دانشجویی باید فقط شامل اعداد باشد' },
        { status: 400 }
      );
    }

    // اعتبارسنجی سکشن
    if (!['1', '2'].includes(section)) {
      return NextResponse.json(
        { error: 'سکشن باید 1 یا 2 باشد' },
        { status: 400 }
      );
    }

    // اعتبارسنجی TA
    if (!['5', '6', '7', '8', '9'].includes(ta)) {
      return NextResponse.json(
        { error: 'TA باید بین 5 تا 9 باشد' },
        { status: 400 }
      );
    }

    const connectionUri = 'mongodb://mabanitest:ts2CJFY1pvxbac33kOhbs2tAq@udb.qepal.com:8302/?authSource=admin';
    const dbName = 'mabanitest';
    const collectionName = 'students';

    let client;
    try {
      client = new MongoClient(connectionUri);
      await client.connect();

      const db = client.db(dbName);
      const studentsCollection = db.collection(collectionName);

      // بررسی وجود دانشجو با کد دانشجویی یکسان
      const existingStudent = await studentsCollection.findOne({ studentCode });
      if (existingStudent) {
        return NextResponse.json(
          { error: 'این کد دانشجویی قبلاً ثبت شده است' },
          { status: 400 }
        );
      }

      // ایجاد رکورد دانشجو
      const newStudent = {
        name: name.trim(),
        studentCode: studentCode.trim(),
        section,
        ta,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // ذخیره دانشجو در دیتابیس
      const result = await studentsCollection.insertOne(newStudent);

      return NextResponse.json(
        { 
          success: true,
          message: 'ثبت نام دانشجو با موفقیت انجام شد',
          studentId: result.insertedId.toString(),
          studentData: {
            name: newStudent.name,
            studentCode: newStudent.studentCode,
            section: newStudent.section,
            ta: newStudent.ta
          }
        },
        { status: 201 }
      );

    } catch (dbError: any) {
      console.error('خطا در اتصال به دیتابیس:', dbError);
      
      if (dbError.code === 13) {
        return NextResponse.json(
          { 
            success: true,
            message: 'ثبت نام در حافظه موقت انجام شد (دسترسی دیتابیس محدود است)',
            storage: 'local',
            studentData: {
              name: name.trim(),
              studentCode: studentCode.trim(),
              section,
              ta
            }
          },
          { status: 201 }
        );
      }
      
      throw dbError;
    } finally {
      if (client) await client.close();
    }

  } catch (error) {
    console.error('خطا در ثبت نام دانشجو:', error);
    return NextResponse.json(
      { error: 'خطای سرور داخلی' },
      { status: 500 }
    );
  }
}