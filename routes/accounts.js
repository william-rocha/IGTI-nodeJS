import express from "express";
import { promises as fs } from "fs";


const {readFile, writeFile} = fs
const router = express.Router()

router.post("/", async (req, res, next) => {
    // console.log(req.body);
    try {

        let account = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        account = {id: data.nextId++, ...account}
        data.accounts.push(account);
        // data, null, 2: para manter o json formatado
        // mas para o arquivo ficar menor o ideal e mante-lo não formatado
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        // res.end();
        res.send(account)
        logger.info(`POST /account - ${JSON.stringify(account)}`)
    } catch(err) {
        next(err)
    }
})

router.get("/", async (req, res, next) => {
    try {
        // aqui sempre de ser let porque estamos atribuindo outro obj
        let data = JSON.parse(await readFile(global.fileName))
        delete data.nextId
        res.send(data)
        logger.info("GET /account")
    } catch (error) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        let data = JSON.parse(await readFile(global.fileName))
        const account = data.accounts.find(account => account.id === parseInt(req.params.id))
        res.send(account)
        logger.info("GET /account/:id")
    } catch (error) {
        next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        let data = JSON.parse(await readFile(global.fileName))
        data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id))
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        res.end()    
        logger.info(`DELETE /account/:id - ${req.params.id}`)
    } catch (error) {
        next(err)
    }
})  

router.put("/", async (req, res, next) => {
    try {
        const account = req.body;

        const data = JSON.parse(await readFile(global.fileName))
        const index = data.accounts.findIndex(a => a.id === account.id)
        data.accounts[index] = account
        await writeFile(global.fileName, JSON.stringify(data))
        res.send(account)
        logger.info(`PUT /account - ${JSON.stringify(account)}`)
    } catch (err) {
        next(err)
    }
})

// se estas funções não tivessem tryCach não precisaria do next porque iria para o proximo 
router.patch("/updateBalance", async (req, res, next) => {
    try {
        const account = req.body;

        const data = JSON.parse(await readFile(global.fileName))
        const index = data.accounts.findIndex(a => a.id === account.id)

        data.accounts[index].balance = account.balance
        await writeFile(global.fileName, JSON.stringify(data))
        res.send(data.accounts[index])
        logger.info(`PATCH /account - ${JSON.stringify(account)}`)
    } catch (err) {
        next(err)
    }
})

router.use((err,req, res, next) => {
    logger.error(`${req.method} ${req.baseUrl} ${err.message}`);
    res.status(400).send({error: err.message})
} )

export default router