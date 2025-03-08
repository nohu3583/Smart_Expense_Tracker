import { connectDB } from "./database";

const COLLECTION_NAME = "Expense";

export interface Expense {
  amount: number;
  category: string;
  date: Date;
  accountOwner: string;
  description: string;
}

// Add a new expense
async function addExpense(expense: Expense) {
  const db = await connectDB();
  if (!db) return;
  
  const result = await db.collection(COLLECTION_NAME).insertOne(expense);
  console.log("✅ Expense Added:", result.insertedId);
}

// Get expenses for an account
async function getExpenses(accountOwner: string) {
  const db = await connectDB();
  if (!db) return;
  
  return db.collection(COLLECTION_NAME).find({ accountOwner }).toArray();
}

async function getExpensesByCategory(accountOwner: string, category: string) {
  const db = await connectDB();
    if (!db) return;

    return db.collection(COLLECTION_NAME).find({ accountOwner, category }).toArray();
}

async function getExpensesByDate(accountOwner: string, date: Date) {
  const db = await connectDB();
    if (!db) return;

    return db.collection(COLLECTION_NAME).find({ accountOwner, date }).toArray();
}

async function getExpensesByAmount(accountOwner: string, amount: number) {
  const db = await connectDB();
    if (!db) return;

    return db.collection(COLLECTION_NAME).find({ accountOwner, amount }).toArray();
}

async function getExpensesByDescription(accountOwner: string, description: string) {
  const db = await connectDB();
    if (!db) return;
    return db.collection(COLLECTION_NAME).find({ accountOwner, description }).toArray();
}
async function deleteExpense(accountOwner: string, date : Date, description: string) {
  const db = await connectDB();
    if (!db) return;
    
    await db.collection(COLLECTION_NAME).deleteOne({ accountOwner, description });
    console.log("Expense Deleted");
}

async function updateExpense(account : string , date : Date, description : string,  new_expense: Expense) {  
  const db = await connectDB();
    if (!db) return;
  
    await db.collection(COLLECTION_NAME).updateOne(
      { accountOwner: account, date: date, description: description},
      { $set: new_expense})
}
async function updateallaccountowner(old_account : string, new_account : string) {
  const db = await connectDB();
    if (!db) return;
  
    await db.collection(COLLECTION_NAME).updateMany(
      { accountOwner: old_account},
      { $set: {accountOwner: new_account}})
}

async function deleteallexpense(account : string) {
  const db = await connectDB();
    if (!db) return;
    
    await db.collection(COLLECTION_NAME).deleteMany({ accountOwner: account });
    console.log("All Expenses Deleted");
}


export {addExpense, getExpenses, getExpensesByCategory, getExpensesByDate, getExpensesByAmount, deleteExpense, updateExpense, getExpensesByDescription
, updateallaccountowner, deleteallexpense
};
