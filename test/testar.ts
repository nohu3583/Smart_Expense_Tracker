import {Expense,addExpense, getExpenses, getExpensesByCategory, getExpensesByDate, getExpensesByAmount, deleteExpense, updateExpense, getExpensesByDescription
    , updateallusername, deleteallexpense, get_total_expense_account} from "../src/mongodb/expense";
import {Account, createAccount, getAccount, updateBalance, deleteAccount, amount_of_accounts, find_active_account, getAllUsernames, switch_logged_in_status, updates_specific_field }
from "../src/mongodb/account"

async function test() {
    const expense : Expense = {
        amount: 200,
        category: "Food",
        currency : "SEK",
        date: new Date(2003, 6, 16),
        username: "bombaclat",
        description: "Dyr Kebabtalrik"
        }
    await addExpense(expense);
    const expenses = await getExpenses("bombaclat")
    console.log(expenses![0].date);
    console.log(typeof (expenses![0].date));
    const dates = new Date(2003, 6, 16);
    console.log(dates);
    console.log((dates.getDate() === expenses![0].date.getDate()));
}

test()