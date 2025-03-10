import { createAccount,Account, amount_of_accounts, find_active_account, getAllUsernames} from '../mongodb/account';
import {rl, askQuestion, registerUser, loginUser, logoutUser,addExpense, change_or_delete_expense, getExpensesForUser, wait, account_options, awaitUserInput} from  '../app/functions';
import { connectDB } from '../mongodb/database';
const apiURL = 'http://localhost:3000/api/expense';

const sendExpense = async () => {
  const amountInput = document.getElementById('amount') as HTMLInputElement;
  const amount = amountInput.value;

  if (!amount) {
      alert('Please enter an amount.');
      return;
  }

  try {
      const response = await fetch(apiURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
      });

      const data = await response.json();
      alert(data.message);
  } catch (error) {
      console.error('Error sending expense:', error);
  }
};

document.getElementById('submit')?.addEventListener('click', sendExpense);


document.getElementById('submit')?.addEventListener('click', sendExpense);
async function main() {
  while (true) {
    if (await amount_of_accounts() === 0) {
      console.log("\n Smart Expense Tracker");
      console.log("1. Register");
      console.log("2. Exit");
      console.log("3. For testing only, an account to test with is created");
      const choice = await askQuestion("Choose an option: ");
      switch (choice) {
        case "1":
          await registerUser();
          break;
        case "2":
          console.log("Goodbye!");
          rl.close();
          return;
        case "3": //used for testing purposes
          const account : Account = {
            accountOwner : "123456",
            balance : 1000,
            currency : "USD",
            username : "noahhzr",
            password : "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", //hashas från 123456
            loggedIn : true
          }
          await createAccount(account);
          console.log("Testing account created successfully!");
          break;
        default:
          console.log("Invalid option. Try again.");
      }
    } else {
      const active_account = await find_active_account();
      if (active_account !== "") {
        console.log(`User ${active_account} is logged in.`);
      }
      console.log("\n Smart Expense Tracker");
      console.log("1. Register");
      console.log("2. Login");
      console.log("3. Display Users")
      console.log("4. Add Expense");
      console.log("5. Logout");
      console.log("6. Exit");
      console.log("7. More options for expenses, change or delete as well as filtering by multiple options");
      console.log("8. Account options");

      const choice = await askQuestion("Choose an option: ");
      switch (choice) {
        case "1":
          console.clear();
          await registerUser();
          break;
        case "2":
          console.clear();
          await loginUser();
          break;
        case "3":
          getAllUsernames().then(usernames => {
            console.log(`Created users are: ${usernames.join(", ")}`);
          });
          break;
        case "4":
          console.clear();
          await addExpense();
          break;
        case "5":
          await logoutUser();
          break;
        case "6":
          console.log("Goodbye!");
          rl.close();
          return;
        case "7":
          const what_do_do = await askQuestion("Do you want to change or delete an expense, or view expense? (change/delete/view): ");
          if (what_do_do === "change" || what_do_do === "delete") {
            await change_or_delete_expense();
          } else if (what_do_do === "view") {
            await getExpensesForUser();
          } else {
            console.log("Invalid option. Try again.");
          }
          break;
        case "8":
          console.clear();
          await account_options();
          break;
        default:
          console.log("Invalid option. Try again.");

      }
    }
  await wait(2000);
  console.clear();
  }
}

main();