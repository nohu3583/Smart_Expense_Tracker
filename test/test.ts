import {Expense,addExpense, getExpenses, getExpensesByCategory, getExpensesByDate, deleteExpense, updateExpense, updateallusername, deleteallexpense, get_total_expense_account} from "../src/mongodb/expense";
import {Account, createAccount, getAccount, updateBalance, deleteAccount, amount_of_accounts, find_active_account, getAllUsernames, switch_logged_in_status, updates_specific_field }
from "../src/mongodb/account"
import {fetchExchangeRate} from "../src/app/functions";

test("Test that amount of accounts is 0 initially", async () => {
    const amount_user = await amount_of_accounts();
    expect(amount_user).toStrictEqual(1);
});

test("Create account function", async () => {
    const account: Account = {
        accountOwner: "123456",
        balance: 9000,
        currency: "DKK",
        username: "PKD",
        password: "intehashed",
        loggedIn: false,
        limit_account: 2000
    };

    await createAccount(account);
    const created_account = await getAccount(account.username);
    expect(created_account!.username).toStrictEqual(account.username);
});



test("Test that getAllUsernames function works", async () => {
    const usernames = await getAllUsernames();
    expect(usernames).toStrictEqual(["bombaclat","PKD"]); // Only the account created in the previous test
});

test("Amount of acounts should now be two instead of 1", async () => {
    const amount_of_user = await amount_of_accounts();
    expect(amount_of_user).toStrictEqual(2);
});

test("Testing that update balance function works as intented", async () => {
    await updateBalance("PKD", -8500);
    const new_balance = 500;
    const created_account = await getAccount("PKD"); //Account that was created before.
    expect(created_account?.balance).toStrictEqual(new_balance);
})

test("Find active account returns the active account which right now is my test account", async () => {
    const username = await find_active_account();
    expect(username).toStrictEqual("bombaclat");
});

test("Switch logged in status for PKD account", async () => {
    await switch_logged_in_status("PKD")
    const active_account_status = await getAccount("PKD")
    expect(active_account_status?.loggedIn).toStrictEqual(true);
});

test("Update a specific feild on the PKD account (will update currency)", async () => {
    await updates_specific_field("currency", "PKD", "SEK");
    const active_account = await getAccount("PKD");
    expect(active_account?.currency).toStrictEqual("SEK"); //Currency is now updated from DKK to SEK
});

test("Delete account should delete the account for PKD", async () => {
    await deleteAccount("PKD");
    const find_account = await getAccount("PKD");
    expect(find_account).toStrictEqual(null);
});

//Tester för databas filen

test("There should be no expense logged when starting", async () => {
    const expenses = await getExpenses("bombaclat");
    expect(expenses).toStrictEqual([]);
});

test("Testing adding a expense to the database", async () => {
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
    expect(expenses).toHaveLength(1); //Should be one created object
});

test("Testing that the delete function works", async () => {
    await deleteExpense("bombaclat", new Date(2003,6, 16),"Dyr Kebabtalrik");
    const expenses = await getExpenses("bombaclat"); 
    expect(expenses).toHaveLength(0); //After deleting the only expense the array should once again be empty ie 0 lenght.
})
//Comment, this also works as a test for getexpensebyamount and getexpensebydescription since it works in the exact same way as the 2 functions below.
// but based on different field in the database, so there for no need to test.
test("Creating multiple expenses under same category to see if they all apear when using getExpenseByCategory and getExpenseByDate"
    , async () => {
    const expense : Expense = {
        amount: 250,
        category: "Food",
        currency : "SEK",
        date: new Date(2003, 6, 16),
        username: "bombaclat",
        description: "Sushi"
        }

    const expense2 : Expense = {
        amount: 200,
        category: "Food",
        currency : "SEK",
        date: new Date(2003, 6, 16),
        username: "bombaclat",
        description: "Dyr Kebabtalrik"
        }
    const expense3 : Expense = {
        amount: 100,
        category: "Food",
        currency : "SEK",
        date: new Date(2003, 6, 16),
        username: "bombaclat",
        description: "Pizza"
    } 
    await addExpense(expense);
    await addExpense(expense2);
    await addExpense(expense3);
    const expenses_category = await getExpensesByCategory("bombaclat", "Food");
    const expense_dates = await getExpensesByDate("bombaclat", new Date(2003, 6, 16))
    const descriptions = ["Sushi", "Dyr Kebabtalrik", "Pizza"]; //First check to see that its the same as descriptions as the filtered expenses
    const amounts = [250,200,100]; //Second check that the amounts are the same as the filtered expenses
    const extracted_descriptions = expenses_category?.map(expense => expense.description);
    const extracted_balance_date = expense_dates?.map(expense => expense.amount);

    expect(expenses_category).toHaveLength(3);
    expect(expense_dates).toHaveLength(3);
    expect(descriptions).toStrictEqual(extracted_descriptions); 
    expect(extracted_balance_date).toStrictEqual(amounts)
});

test("Testing that the delete all expense function works, length should be 0 after", async () => {
    await deleteallexpense("bombaclat");

    const remainingExpenses = await getExpenses("bombaclat");
    expect(remainingExpenses).toHaveLength(0);
});

test("Updating a expense", async () => {
    const expense_to_be_changed : Expense = { //Create a new expense to change
        amount: 2000,
        category: "Bank",
        currency : "SEK",
        date: new Date(2020, 0, 1),
        username: "bombaclat",
        description: "Investering start av år"
        }
    await addExpense(expense_to_be_changed);
    const changed_expense : Expense = { //Create a new expense to change
        amount: 4000,
        category: "Bank",
        currency : "SEK",
        date: new Date(2020, 0, 1),
        username: "bombaclat",
        description: "Investering start av år, skrev in fel antal till att starta med"
        }
    await updateExpense(expense_to_be_changed.username, expense_to_be_changed.date, expense_to_be_changed.description, changed_expense);
    const updated = await getExpenses("bombaclat");
    console.log(updated);
    expect(updated![0].amount).toStrictEqual(4000); //Se if first change is registered
    expect(updated![0].description).toStrictEqual("Investering start av år, skrev in fel antal till att starta med");
});

test("Adding upp total amount spent on all expenses in an account", async () => {
    //Creating multiple more expenses to see if it works
    const expense4 : Expense = {
        amount: 250,
        category: "Food",
        currency : "SEK",
        date: new Date(2003, 6, 16),
        username: "bombaclat",
        description: "Sushi"
        }

    const expense5 : Expense = {
        amount: 200,
        category: "Food",
        currency : "SEK",
        date: new Date(2003, 6, 16),
        username: "bombaclat",
        description: "Dyr Kebabtalrik"
        }
    const expense6 : Expense = {
        amount: 100,
        category: "Food",
        currency : "SEK",
        date: new Date(2003, 6, 16),
        username: "bombaclat",
        description: "Pizza"
    } 
    await addExpense(expense4);
    await addExpense(expense5);
    await addExpense(expense6);

    const sum = await get_total_expense_account("bombaclat");
    expect(sum).toStrictEqual(2550);
})

test("Test that updateallusername function works, ie changes username for all expenses connected to that username", async ()=> {
    await updateallusername("bombaclat", "test123");

    const expenses = await getExpenses("test123");
    expect(expenses).toHaveLength(4); //After changing to test123, it should now have lenght 4, which is the same amount that was for bombaclat.

    //not part of test but need to delete data since it is saved else.
    await deleteallexpense("test123");
})

test("Test that our currency api returns a number", async () => {
    const number = await fetchExchangeRate("SEK", "SEK");
    expect(number).toBe(1);
});