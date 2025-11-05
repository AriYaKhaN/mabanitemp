import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request: Request) {
  const { databaseName } = await request.json();
  const uri = process.env.MONGODB_URI;
  let client;

  try {
    // ساخت URI با دیتابیس انتخاب شده
    const baseUri = uri?.split('/').slice(0, 3).join('/');
    const newUri = `${baseUri}/${databaseName}?authSource=admin`;
    
    client = new MongoClient(newUri!);
    await client.connect();

    const db = client.db(databaseName);
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      collections: collections.map((col: any) => ({
        name: col.name,
        type: col.type || 'collection'
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