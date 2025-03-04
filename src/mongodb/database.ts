import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://noahhzr:QfgvtOQflRNLZx3F@cluster0.xyz.mongodb.net/expenseTracker?retryWrites=true&w=majority";

const client = new MongoClient(MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    return client.db("expenseTracker"); // Use your database name
  } catch (error) {
    console.error("❌ MongoDB Atlas Connection Error:", error);
  }
}

export { connectDB, client };
