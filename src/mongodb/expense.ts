import { connectDB } from "./database";

const COLLECTION_NAME = "Expense";

export interface Expense {
  amount: number;
  category: string;
  date: Date;
  username: string;
  description: string;
}

/**
* Adds a new expense based on user input.
* @param {Expense} expense - The expense that should be added to the expense database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes.
*/
async function addExpense(expense: Expense) : Promise<void> {
  const db = await connectDB();
  if (!db) return;
  
  const result = await db.collection(COLLECTION_NAME).insertOne(expense);
  console.log("Expense Added:", result.insertedId);
}

/**
* Get one or many expense records based on the given 
* @param {string} username - The expense should be added to the expense database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes.
*/
async function getExpenses(username: string) {
  const db = await connectDB();
  if (!db) return;
  
  return db.collection(COLLECTION_NAME).find({username}).toArray();
}

async function getExpensesByCategory(username: string, category: string) {
  const db = await connectDB();
    if (!db) return;

    return db.collection(COLLECTION_NAME).find({username, category }).toArray();
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

async function deleteExpense(accountOwner: string, date: Date, description: string) {
  const db = await connectDB();
  if (!db) return;

  const result = await db.collection(COLLECTION_NAME).deleteOne({ accountOwner, description });

  if (result.deletedCount === 0) {
    console.log("Expense not found");
  } else {
    console.log("Expense Deleted");
  }
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

async function get_total_expense_account(username: string): Promise<number | undefined> {
  const db = await connectDB();
  if (!db) return;

  const accounts = await db.collection(COLLECTION_NAME)
    .find({ username }, { projection: { amount: 1, _id: 0 } }) 
    .toArray();

  let sum : number = 0;
  for (let i = 0; i < accounts.length; i++) {
    sum += accounts[i].amount;
  }

  return sum; 
}


export {addExpense, getExpenses, getExpensesByCategory, getExpensesByDate, getExpensesByAmount, deleteExpense, updateExpense, getExpensesByDescription
, updateallaccountowner, deleteallexpense, get_total_expense_account};
