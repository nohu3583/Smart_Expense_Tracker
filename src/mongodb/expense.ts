import { connectDB } from "./database";

const COLLECTION_NAME = "Expense";

export interface Expense {
  amount: number;
  currency : string;
  category: string;
  date: Date;
  username: string;
  description: string;
  exchangerate? : number
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
  const date = expense.date;
  
  
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

  return db.collection(COLLECTION_NAME)
    .find({ username })
    .project({ _id: 0 })
    .toArray();
}
/**
* Filters and returns an array of expenses for a user based on a single category
* @param {string} username - On what user the filter should be done.
* @param {string} category - What category the filter should be for.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes.
*/
async function getExpensesByCategory(username: string, category: string) {
  const db = await connectDB();
    if (!db) return;

    return db.collection(COLLECTION_NAME)
    .find({ username, category }, { projection: { _id: 0 } }) // Exclude _id
    .toArray();
}

async function getExpensesByDate(username: string, date: Date) {
  const db = await connectDB();
  if (!db) return;

  // Ensure the date has no time component
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  return db.collection(COLLECTION_NAME)
    .find({ 
      username, 
      date: { $gte: startOfDay, $lte: endOfDay } // Matches any date within the same day
    }, 
    { projection: { _id: 0 } })
    .toArray();
}


async function getExpensesByAmount(username: string, amount: number) {
  const db = await connectDB();
    if (!db) return;

    return db.collection(COLLECTION_NAME).find({ username, amount }, {projection : {_id : 0}}).toArray();
}

async function getExpensesByDescription(username: string, description: string) {
  const db = await connectDB();
    if (!db) return;
    return db.collection(COLLECTION_NAME).find({ username, description }, {projection : {_id : 0}}).toArray();
}

async function deleteExpense(username: string, date: Date, description: string): Promise<void> {
  const db = await connectDB();
  if (!db) return;

  // Use the Date object directly in the query
  const result = await db.collection(COLLECTION_NAME).deleteOne({
    username,
    date, // Pass the Date object directly
    description,
  });

  if (result.deletedCount === 0) {
    console.log("Expense not found");
  } else {
    console.log("Expense Deleted");
  }
}

async function updateExpense(username_input : string , date : Date, description : string,  new_expense: Expense) {  
  const db = await connectDB();
    if (!db) return;
    
    await db.collection(COLLECTION_NAME).updateOne(
      {username_input,  date: date.getTime(), description},
      { 
          $set: { 
              username: new_expense.username, 
              amount: new_expense.amount, 
              category: new_expense.category,
              date: new_expense.date, 
              description: new_expense.description
          } 
      }
  );
}
async function updateallusername(old_username_input : string, new_username_input : string) {
  const db = await connectDB();
    if (!db) return;
  
    await db.collection(COLLECTION_NAME).updateMany(
      { username: old_username_input},
      { $set: {username: new_username_input}})
}
async function deleteallexpense(username: string) {
  const db = await connectDB();
  if (!db) return;

  const result = await db.collection(COLLECTION_NAME).deleteMany({ username : username });

  console.log(`All expenses delted, amount of expenses deleted: ${result.deletedCount}`);
}


async function get_total_expense_account(username: string): Promise<number | undefined> {
  const db = await connectDB();
  if (!db) return;

  const username_inputs = await db.collection(COLLECTION_NAME)
    .find({ username }, { projection: { amount: 1, _id: 0 } }) 
    .toArray();

  let sum : number = 0;
  for (let i = 0; i < username_inputs.length; i++) {
    sum += username_inputs[i].amount;
  }

  return sum; 
}


export {addExpense, getExpenses, getExpensesByCategory, getExpensesByDate, getExpensesByAmount, deleteExpense, updateExpense, getExpensesByDescription
, updateallusername, deleteallexpense, get_total_expense_account};
