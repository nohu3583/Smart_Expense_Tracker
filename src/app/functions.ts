import * as readline from 'readline';
import { createAccount as createMongoAccount, getAccount, updateBalance, getAccountBalance, getAccountCurrency, Account, amount_of_accounts, find_active_account, deleteAccount, updates_specific_field, switch_logged_in_status} from '../mongodb/account';
import { addExpense as addMongoExpense, Expense, getExpenses, getExpensesByCategory, getExpensesByDate, getExpensesByAmount, deleteExpense, updateExpense,getExpensesByDescription
    ,updateallaccountowner, deleteallexpense} from '../mongodb/expense';
import * as crypto from 'crypto';

export const expense_categories = ["1. Food", " 2. Housing", " 3. Transportation", " 4. Health and wellness", " 5. Shopping", " 6. Entertainment", " 7. Other"]

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
  }

export async function registerUser() {
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

export async function loginUser() {
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

export async function addExpense() {
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
  
  //change balance for active account
  const account = await getAccount(active_account);
  if (account) { // check if account exists than update balance so that it is changed after each expense
    account.balance -= parseInt(amount);
    await updateBalance(account.accountOwner, account.balance);
  }
}
export async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

export async function getExpensesForUser() {
  console.log("Menu for choosing expenses");
  console.log("1. Get all expenses");
  console.log("2. Get expenses by category");
  console.log("3. Get expenses by date");
  console.log("4. Get expenses by amount");
  console.log("5. Get expenses by description");

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
    default:
      console.log("Invalid option. Try again.");
  }
}



export async function account_options() {
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


export async function awaitUserInput() {
  askQuestion("Press enter to continue: ");
}
