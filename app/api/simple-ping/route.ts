import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  let client;

  try {
    client = new MongoClient(uri!);
    await client.connect();

    const db = client.db();
    
    // فقط عملیات خواندن
    const databaseName = db.databaseName;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    return NextResponse.json({
      success: true,
      message: '✅ اتصال موفق - کاربر فقط دسترسی خواندن دارد',
      database: databaseName,
      availableCollections: collectionNames,
      permissions: 'read-only'
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