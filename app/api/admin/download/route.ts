import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const fileType = searchParams.get('fileType'); // hw1File, hw2File, etc.

    if (!studentId || !fileType) {
      return NextResponse.json(
        { error: 'شناسه دانشجو و نوع فایل الزامی است' },
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

      // پیدا کردن دانشجو
      const student = await studentsCollection.findOne({ 
        _id: new ObjectId(studentId) 
      });

      if (!student) {
        return NextResponse.json(
          { error: 'دانشجو یافت نشد' },
          { status: 404 }
        );
      }

      // بررسی وجود فایل
      const fileUrl = student[fileType as keyof typeof student];
      
      if (!fileUrl || typeof fileUrl !== 'string') {
        return NextResponse.json(
          { error: 'فایل یافت نشد' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        fileUrl: fileUrl,
        fileName: `${student.name}_${fileType}.${getFileExtension(fileUrl)}`,
        studentName: student.name
      });

    } catch (dbError: any) {
      console.error('خطا در دریافت فایل:', dbError);
      return NextResponse.json(
        { error: 'خطای دیتابیس' },
        { status: 500 }
      );
    } finally {
      if (client) await client.close();
    }

  } catch (error) {
    console.error('خطا در دریافت فایل:', error);
    return NextResponse.json(
      { error: 'خطای سرور داخلی' },
      { status: 500 }
    );
  }
}

// تابع برای استخراج پسوند فایل از URL
function getFileExtension(url: string): string {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const parts = pathname.split('.');
  return parts[parts.length - 1] || 'file';
}