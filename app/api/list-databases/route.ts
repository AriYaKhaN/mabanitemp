import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  let client;

  try {
    // ابتدا بدون نام دیتابیس وصل می‌شویم
    const baseUri = uri?.split('/').slice(0, 3).join('/') + '/?authSource=admin';
    client = new MongoClient(baseUri!);
    await client.connect();

    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();

    return NextResponse.json({
      success: true,
      databases: databases.databases.map((db: any) => ({
        name: db.name,
        size: db.sizeOnDisk,
        empty: db.sizeOnDisk === 0
      }))
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}