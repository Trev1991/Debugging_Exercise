// rich-bank.js

const accounts = [
	{ id: 1, owner: "Alice", balance: 500 },
	{ id: 2, owner: "Bob", balance: 300 }
];

/* ---------- helpers ---------- */

function assertValidAccountId(id) {
	if (!Number.isSafeInteger(id) || id <= 0) {
		throw new Error("Invalid account id: must be a positive safe integer.");
	}
}

function assertValidOwner(owner) {
	if (typeof owner !== "string" || owner.trim().length === 0) {
		throw new Error("Invalid owner: must be a non-empty string.");
	}
}

function assertValidAmount(amount) {
	if (!Number.isFinite(amount) || amount <= 0) {
		throw new Error("Invalid amount: must be a positive finite number.");
	}
}

/* ---------- core ---------- */

function getAccountById(id) {
	assertValidAccountId(id);
	const acc = accounts.find(a => a.id === id);
	return acc ?? null;
}

function createAccount(newAccountId, newAccountOwner) {
	assertValidAccountId(newAccountId);
	assertValidOwner(newAccountOwner);

	if (getAccountById(newAccountId)) {
		throw new Error(`Account id ${newAccountId} already exists.`);
	}

	accounts.push({
		id: newAccountId,
		owner: newAccountOwner.trim(),
		balance: 0
	});
	return getAccountById(newAccountId);
}

function depositMoney(accountId, amount) {
	assertValidAmount(amount);

	const account = getAccountById(accountId);
	if (!account) {
		throw new Error("Account not found.");
	}

	account.balance += amount;
	return account.balance;
}

function withdrawMoney(accountId, amount) {
	assertValidAmount(amount);

	const account = getAccountById(accountId);
	if (!account) {
		throw new Error("Account not found.");
	}

	if (amount > account.balance) {
		throw new Error("Insufficient funds.");
	}

	account.balance -= amount;
	return account.balance;
}

function transferMoney(fromAccountId, toAccountId, amount) {
	assertValidAmount(amount);

	const fromAccount = getAccountById(fromAccountId);
	if (!fromAccount) throw new Error("Source account not found.");

	const toAccount = getAccountById(toAccountId);
	if (!toAccount) throw new Error("Destination account not found.");

	if (amount > fromAccount.balance) {
		throw new Error("Insufficient funds in source account.");
	}

	fromAccount.balance -= amount;
	toAccount.balance += amount;

	return { from: fromAccount.balance, to: toAccount.balance };
}

/* ---------- sanity checks you can run locally ---------- */
/*
try { getAccountById("1"); } catch (e) { console.log("OK getAccountById invalid:", e.message); }

try { createAccount(1, "Alice"); } catch (e) { console.log("OK duplicate:", e.message); }
try { createAccount("3", "Charlie"); } catch (e) { console.log("OK invalid id type:", e.message); }
try { createAccount(-3, "Charlie"); } catch (e) { console.log("OK negative id:", e.message); }
try { createAccount(3, ["Charlie"]); } catch (e) { console.log("OK invalid owner type:", e.message); }
try { createAccount(3, ""); } catch (e) { console.log("OK empty owner:", e.message); }
try { createAccount(3, "  "); } catch (e) { console.log("OK blank owner:", e.message); }

try { depositMoney(1, "300"); } catch (e) { console.log("OK deposit string:", e.message); }
try { depositMoney(1, -300); } catch (e) { console.log("OK deposit negative:", e.message); }
try { depositMoney(1, 0); } catch (e) { console.log("OK deposit zero:", e.message); }
try { depositMoney(1, Infinity); } catch (e) { console.log("OK deposit Infinity:", e.message); }
try { depositMoney(4, 100); } catch (e) { console.log("OK deposit unknown account:", e.message); }

try { withdrawMoney(1, -100); } catch (e) { console.log("OK withdraw negative:", e.message); }
try { withdrawMoney(1, 0); } catch (e) { console.log("OK withdraw zero:", e.message); }
try { withdrawMoney(1, 501); } catch (e) { console.log("OK withdraw too much:", e.message); }

try { transferMoney(1, 4, 100); } catch (e) { console.log("OK transfer to missing:", e.message); }
try { transferMoney(1, 2, 501); } catch (e) { console.log("OK transfer too much:", e.message); }

console.log("Before create 3:", JSON.stringify(accounts));
createAccount(3, "Charlie");
console.log("After create 3:", JSON.stringify(accounts));
console.log("Deposit into 3:", depositMoney(3, 200));
console.log("Withdraw from 3:", withdrawMoney(3, 50));
console.log("Transfer 100 from 3 to 2:", transferMoney(3, 2, 100));
console.log("Final state:", JSON.stringify(accounts));
*/

module.exports = {
	accounts,
	getAccountById,
	createAccount,
	depositMoney,
	withdrawMoney,
	transferMoney
};
