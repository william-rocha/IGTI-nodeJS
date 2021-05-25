import express from "express";
import { promises as fs } from "fs";


const {readFile, writeFile} = fs
const router = express.Router()

router.post("/", async (req, res) => {
    // console.log(req.body);
    try {

        let account = req.body;
        const data = JSON.parse(await readFile("accounts.json"));
        account = {id: data.nextId++, ...account}
        data.accounts.push(account);
        // data, null, 2: para manter o json formatado
        // mas para o arquivo ficar menor o ideal e mante-lo não formatado
        await writeFile("accounts.json", JSON.stringify(data, null, 2))
        // res.end();
        res.send(account)
    } catch(err) {
        res.status(400).send({error: err.message});
    }
})

export default router