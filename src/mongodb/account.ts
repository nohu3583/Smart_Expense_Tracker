import { connectDB } from "./database";

const COLLECTION_NAME = "Account";

export interface Account {
  accountOwner: string;
  balance: number;
  currency: string;
  username: string;
  password: string;
  loggedIn: boolean;
}

// Create a new account
async function createAccount(account: Account) {
  const db = await connectDB();
  if (!db) return;
  
  const result = await db.collection(COLLECTION_NAME).insertOne(account);
  console.log("Account Created:", result.insertedId);
}

// Get account by username
async function getAccount(username: string) {
  const db = await connectDB();
  if (!db) return;
  
  return db.collection(COLLECTION_NAME).findOne({ username });
}

// Update account balance
async function updateBalance(username: string, amount: number) {
  const db = await connectDB();
  if (!db) return;
  
  await db.collection(COLLECTION_NAME).updateOne(
    { username },
    { $inc: { balance: amount } }
  );
  console.log("Balance Updated");
}

// Delete account by username
async function deleteAccount(username: string) {
  const db = await connectDB();
  if (!db) return;
  
  await db.collection(COLLECTION_NAME).deleteOne({ username });
  console.log("✅ Account Deleted");
}

// Get account balance by username
async function getAccountBalance(username: string): Promise<number | null> {
  const db = await connectDB();
  if (!db) return null;

  const account = await db.collection(COLLECTION_NAME).findOne(
    { username },
    { projection: { balance: 1, _id: 0 } }
  );
  return account ? account.balance : null;
}

// Get account currency by username
async function getAccountCurrency(username: string): Promise<string> {
  const db = await connectDB();
  if (!db) return "";

  const account = await db.collection(COLLECTION_NAME).findOne(
    { username },
    { projection: { currency: 1, _id: 0 } }
  );
  return account ? account.currency : "";
}

export { createAccount, getAccount, updateBalance, deleteAccount, getAccountBalance, getAccountCurrency };