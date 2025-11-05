import { MongoClient, Db, Collection, Document } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in .env.local');
}

const uri = process.env.MONGODB_URI;

// تنظیمات پیشرفته برای اتصال
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// لاگ امن (بدون نمایش پسورد)
console.log('🔄 Attempting to connect to MongoDB...');
const safeUri = uri.replace(
  /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 
  'mongodb$1://$2:****@'
);
console.log('🔗 Connection string:', safeUri);

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

try {
  if (process.env.NODE_ENV === 'development') {
    // در حالت توسعه
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect().then(() => {
        console.log('✅ Connected to MongoDB successfully');
        return client;
      }).catch(error => {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        throw error;
      });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // در حالت production
    client = new MongoClient(uri, options);
    clientPromise = client.connect().then(() => {
      console.log('✅ Connected to MongoDB successfully');
      return client;
    }).catch(error => {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      throw error;
    });
  }
} catch (error) {
  console.error('❌ MongoDB connection error:', error);
  throw error;
}

export default clientPromise;

export async function getDatabase(dbName?: string): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error('❌ Error getting database:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function getCollection<T extends Document = Document>(
  collectionName: string, 
  dbName?: string
): Promise<Collection<T>> {
  try {
    const db = await getDatabase(dbName);
    return db.collection<T>(collectionName);
  } catch (error) {
    console.error(`❌ Error getting collection ${collectionName}:`, error);
    throw error;
  }
}