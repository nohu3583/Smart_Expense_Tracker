import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://noahhzr:QfgvtOQflRNLZx3F@noahh.vo7o6.mongodb.net/";

export const client = new MongoClient(MONGO_URI);

export async function connectDB() {
  try {
    await client.connect();
    return client.db("expenseTracker"); // Use your database name
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

// Function to start a transaction session
export async function startTransaction() {
  const session = client.startSession();
  session.startTransaction();
  return session;
}

