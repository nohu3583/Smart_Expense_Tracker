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
async function getAccount(username: string) : Promise<Account | undefined | null> {
  const db = await connectDB();
  if (!db) return;
  return db.collection(COLLECTION_NAME).findOne({username}) as unknown as Account;
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

async function amount_of_accounts() : Promise<number> {
  const db = await connectDB();
  if (!db) return 0;
  
  const accounts = await db.collection(COLLECTION_NAME).find().toArray();
  return accounts.length;
}

async function find_active_account() : Promise<string> {
  const db = await connectDB();
  if (!db) return "";
  
  const account = await db.collection(COLLECTION_NAME).findOne(
    { loggedIn: true },
    { projection: { username: 1, _id: 0 } }
  );
  return account ? account.username : "";
}


async function getAllUsernames(): Promise<string[]> {
  const db = await connectDB();
  if (!db) return [];

  const accounts = await db.collection(COLLECTION_NAME)
    .find({}, { projection: { username: 1, _id: 0 } }) // Only fetch `username`
    .toArray();

  return accounts.map(account => account.username);
}

export async function updates_specific_field(fieldName: string, account: string, value: any) {
  const db = await connectDB();
  if (!db) return;

  if (!fieldName) {
    console.log("Invalid field selection.");
    return;
  }

  await db.collection(COLLECTION_NAME).updateOne(
    { username: account },  // Assuming username is unique
    { $set: { [fieldName]: value } }
  );
}



export { createAccount, getAccount, updateBalance, deleteAccount, getAccountBalance, getAccountCurrency, amount_of_accounts, find_active_account, getAllUsernames};