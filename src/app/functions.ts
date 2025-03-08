import * as readline from 'readline';
import { createAccount as createMongoAccount, getAccount, updateBalance, getAccountBalance, getAccountCurrency, Account, amount_of_accounts, find_active_account, deleteAccount, updates_specific_field, switch_logged_in_status} from '../mongodb/account';
import { addExpense as addMongoExpense, Expense, getExpenses, getExpensesByCategory, getExpensesByDate, getExpensesByAmount, deleteExpense, updateExpense,getExpensesByDescription
    ,updateallaccountowner, deleteallexpense} from '../mongodb/expense';
import * as crypto from 'crypto';
import fs from 'fs';
import csvParser from 'csv-parser';
import { stringify } from "csv-stringify";


// Defining the expense categories
export const expense_categories = ["1. Food", " 2. Housing", " 3. Transportation", " 4. Health and wellness", " 5. Shopping", " 6. Entertainment", " 7. Other"]

// Defining the readline interface
export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


/**
* Asks the user a question and returns the answer as a promise.
* @example
* // askquestion("Enter a number: ");
* // returns Promise<string>
* @param {string} query - question to ask the user
* @precondition - no preconditions
* @returns {Promise<string>} Returns a promise that resolves to the user's answer
*/
export function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
  }

/**
* Registers a new user by asking for a username and password.
* If the username already exists, the function will return without creating a new account.
* If the username does not exist, the function will ask for an account number, balance, and currency.
* The function will then create a new account and return.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value, updates the database with the new account
*/
export async function registerUser() : Promise<void> {
    console.log("Register New User");
    const username = await askQuestion("Enter username: ");
    const password = await askQuestion("Enter password: ");
    const hashed_password = crypto.createHash('sha256').update(password).digest("hex");
    
    if (await getAccount(username)) {
      console.log("Username already exists!");
      return;
    }
    else {
      console.log("User registered successfully, but no account has been registered yet.");
      const account_number = await askQuestion("Enter account number: ");
      const balance = await askQuestion("Enter balance: ");
      const currency = await askQuestion("Enter currency: ");
      const account : Account = {
        accountOwner: account_number,
        balance: parseInt(balance),
        currency: currency,
        username : username,
        password : hashed_password, 
        loggedIn : false
      }
      console.log("Account created successfully!");
      await createMongoAccount(account);
    }
  }
/**
* Function to log in a user by asking for a username and password.
* If the user is already logged in, the function will return without logging in the user.
* If the user does not exist, the function will return without logging in the user.
* If the password is incorrect, the function will return without logging in the user.
* If the user is successfully logged in, the function will update the database and return.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value, updates loggedIn status in the database.
*/
export async function loginUser() : Promise<void> {
  const username = await askQuestion("Enter username: ");

  const account = await getAccount(username);
  if (account?.loggedIn === true) {
    console.log("User already logged in!");
    return;
  }
  if (account === null) {
        console.log("User does not exist!");
        return;
    }
  const password = await askQuestion("Enter password: ");
  const hashed_password = crypto.createHash('sha256').update(password).digest("hex");
  if (account?.password !== hashed_password) {
    console.log("Incorrect password!");
    return;
  }
  console.log("User logged in successfully!");

  const active_account = await find_active_account();
  if (active_account !== "") { 
    await switch_logged_in_status(active_account);
  }
  await switch_logged_in_status(username);
}
/**
* Function to log out a user.
* If no user is logged in, the function will return without logging out the user.
* If the user is successfully logged out, the function will update the database and sets loggedIn status to false.
* @returns {Promise<void>} Returns a promise that resolves when the function completes, no return.
*/
export async function logoutUser() {
  const active_account = await find_active_account();
  if (active_account === "") {
    console.log("No user is logged in!");
    return;
  }
  const account = await getAccount(active_account);
  await switch_logged_in_status(active_account);
  console.log("User logged out successfully!");
}

/**
* Adds a new expense to the database.
* If no user is logged in, the function will return without adding the expense.
* The user can choose to add an expense manually or import from a CSV file.
* If manual, the function will ask for amount, date, category, and description.
* The function will then add the expense to the database and update the account balance.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, no return.
*/
export async function addExpense() : Promise<void> {
  const question = await askQuestion("Do you want to add manually or import from CSV? (manual/csv): ");
  if (question === "csv") {
    const inputfile = await askQuestion("Enter the name of the CSV file: ");
    await csvparser(inputfile);
    return;
  }
  const active_account = await find_active_account();
  if (active_account === "") {
    console.log("No user is logged in!");
    return;
  }
  const amount = await askQuestion("Enter amount: ");
  const date = await askQuestion("Enter date: ");
  let date_parsed = new Date(date); // check if date is in correct format
  while (isNaN(date_parsed.getTime())) {
    console.log("Invalid date format. Try again.");
    const date = await askQuestion("Enter date: ");
    date_parsed = new Date(date);
  }
  let category: string = await askQuestion("What category does this fall under? \n" + expense_categories + ":  ");
  
  while (1 > parseFloat(category) || parseFloat(category) > 7) {
    category = await askQuestion("Invalid category. Please enter a number between 1-7.");
  }
  const description = await askQuestion("Enter description: ");

  const expense : Expense = {
    amount: parseInt(amount),
    category: category,
    date: date_parsed,
    accountOwner: active_account,
    description : description
    }
  await addMongoExpense(expense);
  console.log("Expense added successfully!");
  
  const account = await getAccount(active_account);
  if (account) { 
    account.balance -= parseInt(amount);
    await updateBalance(account.accountOwner, account.balance);
  }
}
/**
* Function that creates a delay for a specified number of milliseconds.
* @param {number} ms - number of milliseconds to wait
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
export async function wait(ms: number) : Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
* Function to change or delete an expense.
* If no user is logged in, the function will return without changing or deleting the expense.
* The user can choose to change or delete an expense.
* If changing, the function will ask for the description and date of the expense to change, then ask for the new details.
* The function will then update the expense in the database.
* If deleting, the function will ask for the date and description of the expense to delete.
* The function will then delete the expense from the database.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/

export async function change_or_delete_expense() {
  console.log("Menu for changing or deleting expenses");
  console.log("1. Change expense");
  console.log("2. Delete expense");
  const active_account = await find_active_account();
  const choice = await askQuestion("Choose an option: ");
  switch (choice) {
    case "1":
      const description = await askQuestion("Enter description for the expense you want to change: ");
      const date = await askQuestion("Enter date for the expense you want to change: ");
      const parsed_date = new Date(date);
      console.log("Expense found, please enter the new details for the expense.");
      const amount = await askQuestion("Enter amount: ");
      const category = await askQuestion("Enter category: ");
      const new_description = await askQuestion("Enter new description: ");
      const new_date = await askQuestion("Enter date: ");
      const new_date_parsed = new Date(new_date);

      const updated_expense : Expense = {
        amount: parseInt(amount),
        category: category,
        date: new_date_parsed,
        accountOwner: active_account,
        description: new_description
      }
      await updateExpense(active_account, parsed_date, description, updated_expense);
      break;
    case "2":
      const date2 = await askQuestion("Enter date for the expense you want to delete: ");
      const parsed_date2 = new Date(date2);
      const description2 = await askQuestion("Enter description for the expense you want to delete: ");
      await deleteExpense(active_account, parsed_date2, description2);
      break;
    default:
      console.log("Invalid option. Try again.");
  }
}
/**
* Function to get expenses for a user.
* If no user is logged in, the function will return without getting the expenses.
* The user can choose to get all expenses, expenses by category, date, amount, or description.
* The function will then display the expenses based on the user's choice.
* The user can also export the expenses to a CSV file.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
export async function getExpensesForUser() {
  console.log("Menu for choosing expenses");
  console.log("1. Get all expenses");
  console.log("2. Get expenses by category");
  console.log("3. Get expenses by date");
  console.log("4. Get expenses by amount");
  console.log("5. Get expenses by description");
  console.log("6. Export expenses to CSV file");

  const choice = await askQuestion("Choose an option: ");
  const active_account = await find_active_account();
  if (active_account === "") {
    console.log("No user is logged in!");
    return;
  }
  switch (choice) {
    case "1":
      const expenses = await getExpenses(active_account);
      console.log(expenses);
      break;
    case "2":
      const category = await askQuestion("Enter category: ");
      const expenses_category = await getExpensesByCategory(active_account, category);
      console.log(expenses_category);
      break;
    case "3":
      const date = await askQuestion("Enter date: ");
      const parsed_date = new Date(date);
      const expenses_date = await getExpensesByDate(active_account, parsed_date);
      console.log(expenses_date);
      break;
    case "4":
      const amount = await askQuestion("Enter amount: ");
      const expenses_amount = await getExpensesByAmount(active_account, parseInt(amount));
      console.log(expenses_amount);
      break;
    case "5":
      const description = await askQuestion("Enter description: ");
      const expenses_description = await getExpensesByDescription(active_account, description);
      console.log(expenses_description);
      break;
    case "6":
      await exportExpenseCsvFile();
      break;
    default:
      console.log("Invalid option. Try again.");
  }
}

/**
* Function for account options.
* If no user is logged in, the function will return without displaying the account options.
* The user can choose to get account information, change account information, or delete the account.
* The function will then display the account information, change the account information, or delete the account based on the user's choice.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
export async function account_options() : Promise<void> {
  console.log("Menu for account options");
  console.log("1. Get account information");
  console.log("2. Change account information");
  console.log("3. Delete account");

  const choice = await askQuestion("Choose an option: ");
  const active_account = await find_active_account();
  if (!active_account) {
    console.log("No user is logged in!");
    return;
  }

  const account = await getAccount(active_account);
  if (!account) {
    console.log("Error: Account not found.");
    return;
  }

  switch (choice) {
    case "1":
      console.log(account);
      break;
      
    case "2":
      const options = ["1. Account Number", "2. Balance", "3. Currency", "4. Username", "5. Password"];
      const change_to = await askQuestion("What in your account do you want to change? \n" + options.join("\n") + "\nEnter choice: ");
      
      const account_to_be_changed = await getAccount(active_account);
      if (!account_to_be_changed) {
        console.log("Error: Account not found.");
        return;
      }

      let value: any = "temp";
      switch (change_to) {
        case "1":
          value = await askQuestion("Enter new account number: ");
          break;
        case "2":
          while (isNaN(value)) {
          value = await askQuestion("Enter new balance: ");
          value = parseFloat(value);
          if (isNaN(value)) {
            console.log("Balance must be a number. Try again.");
          }
          }
          break;
        case "3":
          while (value.length !== 3) {
          value = (await askQuestion("Enter new currency: ")).toUpperCase();
          if (value.length !== 3) {
            console.log("Currency must be 3 characters long. Try again.");
          }
        }
          break;
        case "4":
          value = await askQuestion("Enter new username: ");
          break;
        case "5":
          value = await askQuestion("Enter new password: ");
          value = crypto.createHash('sha256').update(value).digest("hex");
          break;
        default:
          console.log("Invalid option. Try again.");
          return;
      }

      // Map numbers to actual field names
      const fieldNames = {
        "1": "accountOwner",
        "2": "balance",
        "3": "currency",
        "4": "username",
        "5": "password",
      };

      if (fieldNames[change_to]) {
        await updates_specific_field(fieldNames[change_to], active_account, value);
        console.log("Account updated successfully!");
      }
      break;

    case "3":
      const confirm = await askQuestion("Are you sure you want to delete your account? (yes/no): ");
      if (confirm.toLowerCase() === "yes") {
        await deleteAccount(active_account);
        console.log("Account deleted successfully!");
        await deleteallexpense(active_account);
      }
      break;

    default:
      console.log("Invalid option. Try again.");
  }
}

/**
* Simple function that uses askquestion to wait for an input to continue.
* @param - no parameters
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
export async function awaitUserInput() : Promise<void>{
  askQuestion("Press enter to continue: ");
}

/**
* Function that takes a csv file as input, the file is expenses that we want to add to expense database.
* If there are problems in the file nothing will happen. But if there are no problems the expense database and also the account balace will be updated.
* @param {string} inputfile - The file path to the file that should be added
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
export async function csvparser(inputfile: string) : Promise<void> {
  const active_account = await find_active_account();
  if (active_account === "") {
      console.log("No user is logged in!");
      return;
  }
  const active_account_info = await getAccount(active_account);
  const account_balance = active_account_info!.balance;
  let total_expense = 0;

  return new Promise<void>((resolve, reject) => {
      const expenses: Expense[] = [];
      fs.createReadStream(inputfile)
          .pipe(csvParser())
          .on("data", (row: Expense) => {
              if (row.accountOwner !== active_account) {
                  console.log("Error: Account number does not match the active account. Skipping row.");
                  return;
              }

              const amount = parseFloat(row.amount as unknown as string);
              if (isNaN(amount) || amount <= 0) {
                  console.log("Error: Amount must be a number. Skipping row.");
                  return;
              }

              total_expense += amount;

              expenses.push({
                  amount: amount,
                  category: row.category,
                  date: new Date(row.date),
                  accountOwner: active_account,
                  description: row.description,
              });
          })
          .on("end", async () => {
              if (total_expense > account_balance) {
                  console.log("Import failed. Total expenses exceed available balance in account");
                  return;
              }

              if (expenses.length > 0) {
                  for (let i = 0; i < expenses.length; i++) {
                      await addMongoExpense(expenses[i]);
                      console.log("Expense added successfully!");
                  }
              } else {
                  console.log("No valid expenses found in the file.");
              }
              resolve();
          }) 
          .on("error", (error: Error) => { 
              console.log("Error: ", error.message);
              reject(error);
          });
  });
}
/**
* Exports all the expenses for the active user to a csv file.
* @param {string} inputfile - The file path to the file that should be added
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
export async function exportExpenseCsvFile() : Promise<void> {
  const active_account = await find_active_account();
  if (active_account === "") {
      console.log("No user is logged in!");
      return;
  }

  const expenses = await getExpenses(active_account);
  if (!expenses || expenses.length === 0) {
      console.log("No expenses found for the active account.");
      return;
  }

  // Define CSV file name
  const filename = `expenses_${active_account}.csv`;
  const writableStream = fs.createWriteStream(filename);

  // Define CSV headers
  const columns = ["amount", "category", "date", "accountOwner", "description"];

  const stringifier = stringify({ header: true, columns });

  // Pipe CSV data into the writable stream
  stringifier.pipe(writableStream);

  // Add each expense row
  expenses.forEach(expense => {
      stringifier.write({
          amount: expense.amount,
          category: expense.category,
          date: expense.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          accountOwner: expense.accountOwner,
          description: expense.description,
      });
  });

  // End the stream
  stringifier.end();

  writableStream.on("finish", () => {
      console.log(`Expenses successfully exported to ${filename}`);
  });

  writableStream.on("error", (error : Error) => {
      console.error("Error writing to CSV file:", error);
  });
}
