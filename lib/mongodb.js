import { MongoClient } from "mongodb";

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI); // Use your MongoDB URI
  await client.connect();
  const db = client.db("Silk"); // Assuming the DB name is 'Silk'

  cachedDb = db;
  return db;
}
