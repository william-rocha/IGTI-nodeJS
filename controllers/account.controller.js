// import express from "express"
import { promises as fs } from "fs";
const { readFile, writeFile } = fs

async function createAccount(req, res, next) {
    try {

        let account = req.body;
        // VALIDAÇÃO campo obrigatório
        if (!account.name || account.balance == null) {
            throw new Error("Name e Balance são obrigatórios")
        }
        const data = JSON.parse(await readFile(global.fileName));
        account = { id: data.nextId++, name: account.name, balance: account.balance }
        data.accounts.push(account);
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        // res.end();
        res.send(account)
        logger.info(`POST /account - ${JSON.stringify(account)}`)
    } catch (err) {
        next(err)
    }
}

async function getAccounts(req, res, next) {
    try {
        // aqui sempre de ser let porque estamos atribuindo outro obj
        let data = JSON.parse(await readFile(global.fileName))
        delete data.nextId
        res.send(data)
        logger.info("GET /account")
    } catch (error) {
        next(err)
    }
}

async function getAccount(req, res, next) {
    try {
        let data = JSON.parse(await readFile(global.fileName))
        const account = data.accounts.find(account => account.id === parseInt(req.params.id))
        res.send(account)
        logger.info("GET /account/:id")
    } catch (error) {
        next(err)
    }
}

async function deleteAccount(req, res, next) {
    try {
        let data = JSON.parse(await readFile(global.fileName))
        data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id))
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        res.end()
        logger.info(`DELETE /account/:id - ${req.params.id}`)
    } catch (error) {
        next(err)
    }
}

async function updateAccount(req, res, next) {
    try {
        const account = req.body;
        if (!account.id || !account.name || account.balance == null) {
            throw new Error("Id, Name e Balance são obrigatórios")
        }
        const data = JSON.parse(await readFile(global.fileName))
        const index = data.accounts.findIndex(a => a.id === account.id)
        // VALIDAÇÃO para ID que não existem
        if (index === -1) {
            throw new Error("Registro não encontrado.")
        }
        data.accounts[index] = account.name
        data.accounts[index] = account.balance
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        res.send(account)
        logger.info(`PUT /account - ${JSON.stringify(account)}`)
    } catch (err) {
        next(err)
    }
}

async function updateBalance(req, res, next) {
    try {
        const account = req.body;

        const data = JSON.parse(await readFile(global.fileName))
        const index = data.accounts.findIndex(a => a.id === account.id)
        console.log('data', index);
        if (!account.id || account.balance == null) {
            throw new Error("Id e Balance são obrigatórios")
        }
        if (index === -1) {
            throw new Error("Registro não encontrado.")
        }
        data.accounts[index].balance = account.balance
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        res.send(data.accounts[index])
        logger.info(`PATCH /account - ${JSON.stringify(account)}`)
    } catch (err) {
        next(err)
    }
}

export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateAccount,
    updateBalance,
}