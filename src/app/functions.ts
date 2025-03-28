import * as readline from 'readline';
import { createAccount as createMongoAccount, getAccount, updateBalance, Account, find_active_account, deleteAccount, updates_specific_field, switch_logged_in_status} from '../mongodb/account';
import { addExpense as addMongoExpense, Expense, getExpenses, getExpensesByCategory, getExpensesByDate, getExpensesByAmount, deleteExpense, updateExpense,getExpensesByDescription
    ,updateallusername, deleteallexpense, get_total_expense_account} from '../mongodb/expense';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import csv = require('csv-parser');
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
//helper functions

/**
 * Helper function to ask the user to choose a valid expense category.
 * @param {string} prompt - The prompt to display to the user when asking for category selection.
 * @returns {Promise<string>} - The selected category name (e.g., "Food", "Housing", etc.).
 */
async function askCategorySelection(prompt: string): Promise<string> {
  let category: string;
  
  const categoryChoices = Object.entries(expense_categories)
    .map(([key, value]) => `${key}. ${value}`)
    .join("\n");
  do {
    category = await askQuestion(`${prompt}\n${categoryChoices}\nEnter choice (only number): `);
    
    // Validate the category
    if (!expense_categories[category]) {
      console.log("Invalid category. Please enter a number between 1-7.");
    }
  } while (!expense_categories[category]);
  
  return expense_categories[category]; // Return the valid category name
}

/**
 * Helper function to ask the user for a valid date.
 * Ensures the date entered is in a correct format.
 * @param {string} prompt - The prompt to display to the user when asking for the date.
 * @returns {Promise<Date>} - The valid parsed date.
 */
async function askValidDate(prompt: string): Promise<Date> {
  let date: Date;
  let isValid = false;

  do {
    const dateStr = await askQuestion(prompt);
    const normalizedDateStr = dateStr.replace(/\//g, '-');
    const [year, month, day] = normalizedDateStr.split('-').map(Number);

    // Adjust month (JavaScript months are 0-based)
    const adjustedMonth = month - 1;

    date = new Date(year, adjustedMonth, day);

    if (isNaN(date.getTime())) {
      console.log("Invalid date format. Please try again (expected format: YYYY/MM/DD).");
    } else {
      isValid = true;
    }
  } while (!isValid);

  return date;
}

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
* @precondition - no precondition
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
      const question = await askQuestion("Do you want to add limit on your account(yes/no)")
      let account_limit: string | undefined = undefined;
      if (question === "yes") {
        account_limit = await askQuestion("What limit on spending should this account have per 30 days(optional)");
      }

      const account : Account = {
        accountOwner: account_number,
        balance: parseInt(balance),
        currency: currency,
        username : username,
        password : hashed_password, 
        loggedIn : false, 
        limit_account : account_limit ? parseFloat(account_limit) : undefined
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
export async function logoutUser() : Promise<void> {
  const active_account = await find_active_account();
  if (active_account === "") {
    console.log("No user is logged in!");
    return;
  }
  const account = await getAccount(active_account);
  await switch_logged_in_status(active_account);
  console.log("User logged out successfully!");
}

// Defining the expense categories

const expense_categories : Record<string, string>= {
  "1": "Food",
  "2": "Housing",
  "3": "Transportation",
  "4": "Health and wellness",
  "5": "Shopping", 
  "6": "Entertainment",
  "7": "Other"
};

const currencyCodes = [ // All currency that can be added
  "AFA", "ALL", "DZD", "AOA", "ARS", "AMD", "AWG", "AUD", "AZN", "BSD", "BHD", "BDT", "BBD", "BYR", "BEF", "BZD", "BMD", "BTN", "BTC", "BOB", "BAM", "BWP", "BRL", "GBP", "BND", "BGN", "BIF", "KHR", "CAD", "CVE", "KYD", "XOF", "XAF", "XPF", "CLP", "CLF", "CNY", "COP", "KMF", "CDF", "CRC", "HRK", "CUC", "CZK", "DKK", "DJF", "DOP", "XCD", "EGP", "ERN", "EEK", "ETB", "EUR", "FKP", "FJD", "GMD", "GEL", "DEM", "GHS", "GIP", "GRD", "GTQ", "GNF", "GYD", "HTG", "HNL", "HKD", "HUF", "ISK", "INR", "IDR", "IRR", "IQD", "ILS", "ITL", "JMD", "JPY", "JOD", "KZT", "KES", "KWD", "KGS", "LAK", "LVL", "LBP", "LSL", "LRD", "LYD", "LTC", "LTL", "MOP", "MKD", "MGA", "MWK", "MYR", "MVR", "MRO", "MUR", "MXN", "MDL", "MNT", "MAD", "MZM", "MMK", "NAD", "NPR", "ANG", "TWD", "NZD", "NIO", "NGN", "KPW", "NOK", "OMR", "PKR", "PAB", "PGK", "PYG", "PEN", "PHP", "PLN", "QAR", "RON", "RUB", "RWF", "SVC", "WST", "STD", "SAR", "RSD", "SCR", "SLL", "SGD", "SKK", "SBD", "SOS", "ZAR", "KRW", "SSP", "XDR", "LKR", "SHP", "SDG", "SRD", "SZL", "SEK", "CHF", "SYP", "TJS", "TZS", "THB", "TOP", "TTD", "TND", "TRY", "TMT", "UGX", "UAH", "AED", "UYU", "USD", "UZS", "VUV", "VEF", "VND", "YER", "ZMK", "ZWL"
];
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
  const active_account = await find_active_account();
  if (active_account === "") {
    console.log("No user is logged in!");
    return;
  }
  const question = await askQuestion("Do you want to add manually or import from CSV? (manual/csv): ");
  if (question === "csv") {
    const inputfile = await askQuestion("Enter the file of path of your csv file: ");
    await csvparser(inputfile);
    await oncallCheckExpenseLimit();
    return;
  }
  const amount = await askQuestion("Enter amount: ");
  const date = await askValidDate("Enter Valid date, Format is YYYY/MM/DD :")
  const categoryName = await askCategorySelection("What category do you want to change this purchase to be in?");
  const description = await askQuestion("Enter description: ");
  let currency = (await askQuestion("Enter the currency for this purchase")).toUpperCase();

  while (!currencyCodes.includes(currency)) {
    console.log("Not a supported currency, please write a real currency(3 letters)")
    currency = (await askQuestion("Enter the currency for this purchase")).toUpperCase();
  }

  let converted_amount = parseFloat(amount);
  const account = await getAccount(active_account);
  let exchangerate : number | undefined = undefined;

  if (account!.currency !== currency) {
    try {
      exchangerate = await fetchExchangeRate(currency, account!.currency);
      converted_amount = parseFloat(amount) * exchangerate;
    }
    catch (error) {
      console.log("Could not convert the currency, therefor expense not added")
    }
  }
  const expense : Expense = {
    amount: converted_amount,
    currency : currency,
    category: categoryName,
    date: date,
    username: active_account,
    description : description,
    exchangerate : exchangerate
    }
  await addMongoExpense(expense);
  console.log("Expense added successfully!");
  
  if (account) { 
    const amount_change = converted_amount *-1
    await updateBalance(active_account, amount_change);
    await oncallCheckExpenseLimit();
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

export async function change_or_delete_expense() : Promise<void> {
  console.log("Menu for changing or deleting expenses");
  console.log("1. Change expense");
  console.log("2. Delete expense");
  const active_account = await find_active_account();
  const choice = await askQuestion("Choose an option: ");
  switch (choice) {
    case "1":
      const description = await askQuestion("Enter description for the expense you want to change: ");
      const date = await askValidDate("Enter date for the purchase you want to change. Format is YYYY/MM/DD")
      console.log("Expense found, please enter the new details for the expense.");
      const amount = await askQuestion("Enter amount: ");
      const categoryName = await askCategorySelection("What category do you want to change this purchase to be in?");
      const new_description = await askQuestion("Enter new description: ");
      const new_currency = await askQuestion("What currency was this purchase made in")
      const new_date = await askValidDate("Enter new date, Format is YYYY/MM/DD")
      const updated_expense : Expense = {
        amount: parseInt(amount),
        currency: new_currency,
        category: categoryName,
        date: date,
        username: active_account,
        description: new_description
      }
      await updateExpense(active_account, new_date, description, updated_expense);
      break;
    case "2":
      const date2 = await askValidDate("Enter date for the expense you want to delete, Format is YYYY/MM/DD")
      const description2 = await askQuestion("Enter description for the expense you want to delete: ");
      await deleteExpense(active_account, date2, description2);
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
      const awaits = await askQuestion("press any button to continue");
      break;
    case "2":
      const categoryName = await askCategorySelection("What category do you want to change this purchase to be in?");
      const expenses_category = await getExpensesByCategory(active_account, categoryName);
      console.log(expenses_category);
      break;
    case "3":
      const date = await askValidDate("For which date do you want to see your expenses, Format is YYYY/MM/DD")
      const expenses_date = await getExpensesByDate(active_account, date);
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

      let value : string | number | undefined = "temp";
      switch (change_to) {
        case "1":
          value = await askQuestion("Enter new account number: ");
          break;
        case "2":
          value = await askQuestion("Enter new balance: ");
          while (isNaN(parseInt(value)) || parseInt(value) < 0)  {
            console.log("Balance must be a positive number")
            value = await askQuestion("Enter new balance: ");
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
          await updateallusername(account_to_be_changed.username, value);
          break;
        case "5":
          value = await askQuestion("Enter new password: ");
          value = crypto.createHash('sha256').update(value).digest("hex");
          break;
        case "6":
          value = await askQuestion("Enter new limit for spending: ");
          while (isNaN(parseInt(value)) || parseInt(value) < 0)  {
            console.log("The new account limit must be a positive number")
            value = await askQuestion("Enter new balance: ");
          }
        default:
          console.log("Invalid option. Try again.");
          return;
      }

      const fieldNames = {
        "1": "accountOwner",
        "2": "balance",
        "3": "currency",
        "4": "username",
        "5": "password",
        "6": "limit_account"
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
  askQuestion("Press any button to continue: ");
  
}

/**
* Function that takes a csv file as input, the file is expenses that we want to add to expense database.
* If there are problems in the file nothing will happen. But if there are no problems the expense database and also the account balace will be updated.
* @param {string} inputfile - The file path to the file that should be added
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
export async function csvparser(inputfile: string): Promise<void> {
  const active_account = await find_active_account();
  if (!active_account) {
    console.log("No user logged in!");
    return;
  }

  const results: any[] = [];
  const account = await getAccount(active_account);
  if (!account) {
    console.log("Account not found!");
    return;
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(inputfile)
      .pipe(csv())
      .on('data', (data: any) => results.push(data))
      .on('end', async () => {
        try {
          let totalConvertedAmount = 0;

          for (const row of results) {
            // Validate CSV format
            if (!row.Amount || !row.Date || !row.Category || !row.Description || !row.Currency) {
              console.log(`Skipping invalid row: ${JSON.stringify(row)}`);
              continue;
            }

            // Parse the date string (YYYY/MM/DD)
            const [year, month, day] = row.Date.split('/').map(Number);
            const adjustedMonth = month - 1; // Adjust month (0-based)
            const date = new Date(year, adjustedMonth, day);

            if (isNaN(date.getTime())) {
              console.log(`Skipping row with invalid date: ${row.Date}`);
              continue;
            }

            // Validate category
            const categoryKey = Object.keys(expense_categories).find(
              key => expense_categories[key] === row.Category
            );

            if (!categoryKey) {
              console.log(`Skipping row with invalid category: ${row.Category}`);
              continue;
            }

            // Validate currency
            const currency = row.Currency.toUpperCase();
            if (!currencyCodes.includes(currency)) {
              console.log(`Skipping row with invalid currency: ${row.Currency}`);
              continue;
            }

            // Convert to account's currency
            let convertedAmount = parseFloat(row.Amount);
            if (currency !== account.currency) {
              try {
                const exchangeRate = await fetchExchangeRate(currency, account.currency);
                convertedAmount *= exchangeRate;
              } catch (error) {
                console.log(`Skipping row due to currency conversion error: ${row.Amount}`);
                continue;
              }
            }

            totalConvertedAmount += convertedAmount;

            const expense: Expense = {
              amount: parseFloat(row.Amount),
              currency: currency,
              date: date,
              category: row.Category,
              description: row.Description,
              username: active_account,
              exchangerate: convertedAmount / parseFloat(row.Amount), 
            };

            await addMongoExpense(expense);
          }

          // Update account balance
          if (account.balance >= totalConvertedAmount) {
            const change = totalConvertedAmount *-1;
            await updateBalance(account.accountOwner, change);
            console.log("Account balance updated");
          } else {
            console.log("Insufficient balance for expenses");
          }

          console.log(`Successfully imported ${results.length} expenses`);
          await oncallCheckExpenseLimit();
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error: Error) => reject(error));
  });
}

/**
* Exports all the expenses for the active user to a csv file.
* @param - no parameter.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/
export async function exportExpenseCsvFile(): Promise<void> {
  const active_account = await find_active_account();
  if (!active_account) {
    console.log("No user logged in!");
    return;
  }

  const expenses = await getExpenses(active_account);
  const filename = `${active_account}_expenses_${new Date().toISOString().slice(0,10)}.csv`;

  const csvWriter = createCsvWriter({
    path: filename,
    header: [
      { id: 'amount', title: 'Amount' },
      { id: 'category', title: 'Category' },
      { id: 'date', title: 'Date' },
      { id: 'description', title: 'Description' }
    ]
  });

  const records = expenses!.map(expense => ({
    amount: expense.amount,
    category: expense.category,
    date: expense.date.toISOString().split('T')[0],
    description: expense.description
  }));

  await csvWriter.writeRecords(records);
  console.log(`Exported ${expenses!.length} expenses to ${filename}`);
}

/**
* A function to check if the user nears the limit set for their account, notifies based on much has been spent.
* @param - no parameter.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/                    
export async function oncallCheckExpenseLimit(): Promise<void> {
  const activeAccountUsername = await find_active_account();
  if (!activeAccountUsername) return;

  const activeAccount = await getAccount(activeAccountUsername);
  const accountLimit = activeAccount?.limit_account;
  const totalSpent = await get_total_expense_account(activeAccountUsername);

  if (!accountLimit || !totalSpent) return;
  const percentUsed = totalSpent / accountLimit;

  if (percentUsed >= 1) {
    console.log(`Alert: The account limit has been EXCEEDED! Currently at ${percentUsed * 100}% of the max.`);
  } else if (percentUsed >= 0.75) {
    console.log(`Warning: The limit is almost reached (${(percentUsed * 100).toFixed(2)}% used).`);
  } else if (percentUsed >= 0.5) {
    console.log(`ℹNotice: More than 50% of the limit has been used (${(percentUsed * 100).toFixed(2)}%).`);
  }
}

/**
* A function to get excange rates for currency pairs, will be used for exhanges not made in the accounts base currency
* @param - no parameter.
* @precondition - no preconditions
* @returns {Promise<void>} Returns a promise that resolves when the function completes, with no value.
*/   

export async function fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  const API_KEY = "e456750106a89fb5147294e2";
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;

  try {
    const answer = await fetch(url);
    const data = await answer.json();
    if (data.result === "success") {
      return data.conversion_rate;
    } else {
      throw new Error("Failed to fetch exchange rate");
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw error;
  }
}