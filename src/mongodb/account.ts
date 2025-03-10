import { get } from "http";
import { connectDB } from "./database.js";

const COLLECTION_NAME = "Account";

export interface Account {
  accountOwner: string;
  balance: number;
  currency: string;
  username: string;
  password: string;
  loggedIn: boolean;
  limit_account? : number
}

/**
* Creates a new account in the mongodb account database.
* @param {Account} account - The account that should be created in database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value, updates the database with the new account
*/
async function createAccount(account: Account) : Promise<void> {
  const db = await connectDB();
  if (!db) return;
  
  const result = await db.collection(COLLECTION_NAME).insertOne(account);
  console.log("Account Created:", result.insertedId);
}
/**
* Returns a account based on the username given, if connection failed it returns undefined and if the username is not found null.

* @param {string} username - The username that should be found in the database.
* @precondition - no preconditions
* @returns {Promise<Account | undefined | null>} Returns a promise that resolves when the function completes, if found returns the entire account, if not found returns null
* and if the connection fails it returns undefined. 
*/

async function getAccount(username: string) : Promise<Account | undefined | null> {
  const db = await connectDB();
  if (!db) return;
  return db.collection(COLLECTION_NAME).findOne({username}) as unknown as Account;
}

/**
* Updates the account balance after a expense has been registered.
* @example 
* Balance for user example_user goes from 9000 to 8500
* updateBalance(example_user, 500);
* @param {string} username - The username that should be found in the database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, if found returns the entire account, if not found returns null
* and if the connection fails it returns undefined. 
*/
async function updateBalance(username: string, amount: number) : Promise<void> {
  const db = await connectDB();
  if (!db) return;
  
  await db.collection(COLLECTION_NAME).updateOne(
    { username },
    { $inc: { balance: amount } }
  );
  console.log("Balance Updated");
}

/**
* Deletes an account based on given username.
* @param {string} username - The username for account that should be deleted from the database.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, if found deletes account, otherwise
* if the connection fails it returns undefined. 
*/
async function deleteAccount(username: string) : Promise<void> {
  const db = await connectDB();
  if (!db) return;
  
  await db.collection(COLLECTION_NAME).deleteOne({ username });
  console.log("Account Deleted");
}
/**
* Function to return the amount of account created
* @param - No parameter.
* @precondition - no preconditions
* @returns {Promise<number>} Returns a promise that resolves when the function completes, returns the number of accounts created.
**/
async function amount_of_accounts() : Promise<number> {
  const db = await connectDB();
  if (!db) return 0;
  
  const accounts = await db.collection(COLLECTION_NAME).find().toArray();
  return accounts.length;
}

/**
* Return the acitve account, based loggedin parameter.
* @example
* user1
* find_active_account()
* @param - No parameter.
* @precondition - no preconditions
* @returns {Promise<string>} Returns a promise that resolves when the function completes, returns the string of username.
**/
async function find_active_account() : Promise<string> {
  const db = await connectDB();
  if (!db) return "";
  
  const account = await db.collection(COLLECTION_NAME).findOne(
    { loggedIn: true },
    { projection: { username: 1, _id: 0 } }
  );
  return account ? account.username : "";
}

/**
* Returns the array of all users that have been created.
* @example 
* [user1, user2, user3]
* getAllUsernames();
* @param - No parameter.
* @precondition - no preconditions
* @returns {Promise<string[]>} Returns a promise that resolves when the function completes, returns array of the users created.
**/
async function getAllUsernames(): Promise<string[]> {
  const db = await connectDB();
  if (!db) return [];

  const accounts = await db.collection(COLLECTION_NAME)
    .find({}, { projection: { username: 1, _id: 0 } }) // Only fetch `username`
    .toArray();

  return accounts.map(account => account.username);
}
/**
* Updates a specific feild based on what the user wants to change.
* @param {string} fieldName - The name of the field that the user wants to check.
* @param {string} account - The account that should be changed. 
* @param {number | string} value - The new value that should be changed to.
* @precondition - no preconditions
* @returns {Promise<string>} Returns a promise that resolves when the function completes, updates the database on a specific field based on
* what the user wants. 
**/
async function updates_specific_field(fieldName: string, account: string, value: number | string) : Promise<void> {
  const db = await connectDB();
  if (!db) return;

  if (!fieldName) {
    console.log("Invalid field selection.");
    return;
  }

  await db.collection(COLLECTION_NAME).updateOne(
    { username: account },  
    { $set: { [fieldName]: value } }
  );
}

async function switch_logged_in_status(username: string) {
  const db = await connectDB();
  if (!db) return;

  const account = await getAccount(username);
  let status = account?.loggedIn
  if (status === true) {
    status = false;
  } else {
    status = true;
  }

  await db.collection(COLLECTION_NAME).updateOne(
    { username },
    { $set: { loggedIn: status } }
  );
}



export { createAccount, getAccount, updateBalance, deleteAccount, amount_of_accounts, find_active_account, getAllUsernames, switch_logged_in_status, updates_specific_field };