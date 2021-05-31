import { promises as fs } from "fs";
const { readFile, writeFile } = fs

async function createAccount(account) {
    const data = JSON.parse(await readFile(global.fileName));
    account = { id: data.nextId++, name: account.name, balance: account.balance }
    data.accounts.push(account);
    await writeFile(global.fileName, JSON.stringify(data, null, 2))
    // res.end();
    return account
}

async function getAccounts() {
    // aqui sempre de ser let porque estamos atribuindo outro obj
    let data = JSON.parse(await readFile(global.fileName))
    delete data.nextId
    return data
}

async function getAccount(id) {
    let data = JSON.parse(await readFile(global.fileName))
    const account = data.accounts.find(account => account.id === parseInt(id))
    return account
}

async function deleteAccount(id) {
    let data = JSON.parse(await readFile(global.fileName))
    data.accounts = data.accounts.filter(account => account.id !== parseInt(id))
    await writeFile(global.fileName, JSON.stringify(data, null, 2))
}

async function updateAccount(account) {
    const data = JSON.parse(await readFile(global.fileName))
    const index = data.accounts.findIndex(a => a.id === account.id)
    // VALIDAÇÃO para ID que não existem
    if (index === -1) {
        throw new Error("Registro não encontrado.")
    }
    data.accounts[index].name = account.name
    data.accounts[index].balance = account.balance
    await writeFile(global.fileName, JSON.stringify(data, null, 2))
    return data.accounts[index]
}

async function updateBalance(account) {
    const data = JSON.parse(await readFile(global.fileName))
    const index = data.accounts.findIndex(a => a.id === account.id)
    console.log('data', index);
    if (index === -1) {
        throw new Error("Registro não encontrado.")
    }
    data.accounts[index].balance = account.balance
    await writeFile(global.fileName, JSON.stringify(data, null, 2))
    return data.accounts[index]
}

export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateAccount,
    updateBalance
}