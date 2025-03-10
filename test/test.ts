import {addExpense, getExpenses, getExpensesByCategory, getExpensesByDate, getExpensesByAmount, deleteExpense, updateExpense, getExpensesByDescription
    , updateallaccountowner, deleteallexpense, get_total_expense_account} from "../src/mongodb/expense";
import {Account, createAccount, getAccount, updateBalance, deleteAccount, amount_of_accounts, find_active_account, getAllUsernames, switch_logged_in_status, updates_specific_field }
from "../src/mongodb/account"

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
let create_account: Account | null;



test("Test that getAllUsernames function works", async () => {
    const usernames = await getAllUsernames();
    expect(usernames).toStrictEqual(["bombaclat","PKD"]); // Only the account created in the previous test
});

test("Amount of acounts should now be two instead of 1", async () => {
    const amount_of_user = await amount_of_accounts();
    expect(amount_of_user).toStrictEqual(2);
});

test("Testing that update balance function works as intented", async () => {
    await updateBalance("PKD", 500);
    const new_balance = 8500;
    const created_account = await getAccount("PKD"); //Account that was created before.
    expect(created_account?.balance).toStrictEqual(8500);
})

test("Find active account returns the active account which right now is my test account", async () => {
    const username = await find_active_account();
    expect(username).toStrictEqual("bombaclat");
});

test("Delete account should delete the account for PKD", async () => {
    await deleteAccount("PKD");
    const find_account = await getAccount("PKD");
    expect(find_account).toStrictEqual(null);
});

test("")