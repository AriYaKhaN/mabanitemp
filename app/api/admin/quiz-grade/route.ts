import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

interface QuizGradeData {
  studentId: string;
  quizGrade: number;
  taId: number;
  description?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, quizGrade, taId, description }: QuizGradeData = await request.json();

    // اعتبارسنجی
    if (!studentId || quizGrade === undefined || taId === undefined) {
      return NextResponse.json(
        { error: 'تمام فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    if (quizGrade < 0 || quizGrade > 20) {
      return NextResponse.json(
        { error: 'نمره باید بین 0 تا 20 باشد' },
        { status: 400 }
      );
    }

    const connectionUri = 'mongodb://mabanitest:ts2CJFY1pvxbac33kOhbs2tAq@udb.qepal.com:8302/?authSource=admin';

    let client;
    try {
      client = new MongoClient(connectionUri);
      await client.connect();

      const db = client.db('mabanitest');
      const studentsCollection = db.collection('students');

      // بررسی وجود دانشجو و دسترسی TA
      const student = await studentsCollection.findOne({ 
        _id: new ObjectId(studentId) 
      });

      if (!student) {
        return NextResponse.json(
          { error: 'دانشجو یافت نشد' },
          { status: 404 }
        );
      }

      // اگر TA معمولی است، بررسی کند که دانشجو مربوط به خودش باشد
      if (taId !== 0 && student.ta !== taId.toString()) {
        return NextResponse.json(
          { error: 'شما فقط می‌توانید برای دانشجویان خودتان نمره ثبت کنید' },
          { status: 403 }
        );
      }

      // آپدیت نمره دانشجو
      const result = await studentsCollection.updateOne(
        { _id: new ObjectId(studentId) },
        { 
          $set: { 
            quizGrade: quizGrade,
            hw1record: description || '', // ذخیره توضیحات
            updatedAt: new Date(),
            gradedBy: taId
          } 
        }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: 'خطا در ثبت نمره' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'نمره با موفقیت ثبت شد',
        studentId: studentId,
        quizGrade: quizGrade,
        description: description
      });

    } catch (dbError: any) {
      console.error('خطا در ثبت نمره:', dbError);
      return NextResponse.json(
        { error: 'خطای دیتابیس' },
        { status: 500 }
      );
    } finally {
      if (client) await client.close();
    }

  } catch (error) {
    console.error('خطا در ثبت نمره:', error);
    return NextResponse.json(
      { error: 'خطای سرور داخلی' },
      { status: 500 }
    );
  }
}