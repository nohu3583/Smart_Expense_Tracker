import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://noahhzr:QfgvtOQflRNLZx3F@noahh.vo7o6.mongodb.net/";

const client = new MongoClient(MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    return client.db("expenseTracker"); // Use your database name
  } catch (error) {
    console.error("MongoDB Atlas Connection Error:", error);
  }
}
export {connectDB, client };

