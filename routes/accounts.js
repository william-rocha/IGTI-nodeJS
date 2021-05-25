import express from "express";
import { promises as fs } from "fs";


const {readFile, writeFile} = fs
const router = express.Router()

router.post("/", async (req, res) => {
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
    } catch(err) {
        res.status(400).send({error: err.message});
    }
})

router.get("/", async (req, res) => {
    try {
        // aqui sempre de ser let porque estamos atribuindo outro obj
        let data = JSON.parse(await readFile(global.fileName))
        delete data.nextId
        res.send(data)
    } catch (error) {
        res.status(400).send({error: err.message}); 
    }
})

router.get("/:id", async (req, res) => {
    try {
        let data = JSON.parse(await readFile(global.fileName))
        const account = data.accounts.find(account => account.id === parseInt(req.params.id))
        res.send(account)
    } catch (error) {
        res.status(400).send({error: err.message}); 
    }
})

export default router