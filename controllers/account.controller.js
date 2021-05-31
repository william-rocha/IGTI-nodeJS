// import express from "express"
import AccountServices from "../services/account.services.js";

// controller responsável por validação e tratar erro
async function createAccount(req, res, next) {
    try {

        let account = req.body;
        // VALIDAÇÃO campo obrigatório
        if (!account.name || account.balance == null) {
            throw new Error("Name e Balance são obrigatórios")
        }

        // service responsável por leitura e escrita
        account = await AccountServices.createAccount(account)

        res.send(account)
        logger.info(`POST /account - ${JSON.stringify(account)}`)
    } catch (err) {
        next(err)
    }
}

async function getAccounts(req, res, next) {
    try {

        res.send(await AccountServices.getAccounts())

        logger.info("GET /account")
    } catch (error) {
        next(err)
    }
}

async function getAccount(req, res, next) {
    try {

        res.send(await AccountServices.getAccount(req.params.id))

        logger.info("GET /account/:id")
    } catch (error) {
        next(err)
    }
}

async function deleteAccount(req, res, next) {
    try {

        await AccountServices.deleteAccount(req.params.id)

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
        console.log(AccountServices.updateAccount(account));
        res.send(await AccountServices.updateAccount(account))

        logger.info(`PUT /account - ${JSON.stringify(account)}`)
    } catch (err) {
        next(err)
    }
}

async function updateBalance(req, res, next) {
    try {
        const account = req.body;

        if (!account.id || account.balance == null) {
            throw new Error("Id e Balance são obrigatórios")
        }

        res.send(await AccountServices.updateBalance(account))

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