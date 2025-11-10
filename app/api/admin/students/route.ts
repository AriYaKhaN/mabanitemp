import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // دریافت TA ID از header یا query
    const { searchParams } = new URL(request.url);
    const taId = searchParams.get('taId');

    if (!taId) {
      return NextResponse.json(
        { error: 'TA ID الزامی است' },
        { status: 400 }
      );
    }

    const taIdNum = parseInt(taId);

    const connectionUri = 'mongodb://mabanitest:ts2CJFY1pvxbac33kOhbs2tAq@udb.qepal.com:8302/?authSource=admin';

    let client;
    try {
      client = new MongoClient(connectionUri);
      await client.connect();

      const db = client.db('mabanitest');
      const studentsCollection = db.collection('students');

      // اگر ادمین کل باشد (taId = 0)، همه دانشجویان را نشان بده
      // اگر TA معمولی باشد، فقط دانشجویان با ta برابر آن ID را نشان بده
      const query = taIdNum === 0 ? {} : { ta: taIdNum.toString() };

      const students = await studentsCollection.find(query).toArray();

      return NextResponse.json({
        success: true,
        students: students.map(student => ({
          id: student._id.toString(),
          name: student.name,
          studentCode: student.studentCode,
          section: student.section,
          ta: student.ta,
          createdAt: student.createdAt
        })),
        total: students.length,
        taId: taIdNum
      });

    } catch (dbError: any) {
      console.error('خطا در دریافت دانشجویان:', dbError);
      return NextResponse.json(
        { error: 'خطای دیتابیس' },
        { status: 500 }
      );
    } finally {
      if (client) await client.close();
    }

  } catch (error) {
    console.error('خطا در دریافت دانشجویان:', error);
    return NextResponse.json(
      { error: 'خطای سرور داخلی' },
      { status: 500 }
    );
  }
}