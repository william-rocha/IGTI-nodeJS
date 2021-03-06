import express from "express"
import accountRouter from "./routes/account.router.js"
import { promises as fs } from "fs"
import winston from "winston"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { swaggerDocument } from "./doc.js"

const { readFile, writeFile } = fs

// var global do node para evitar ficar reescrevendo
global.fileName = "accounts.json"

const { combine, timestamp, label, printf } = winston.format
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`
})
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "my-banck-api.log" })
    ],
    format: combine(
        label({ label: "my-bank-api" }),
        timestamp(),
        myFormat
    )
})
const app = express()
app.use(express.json())
// desta forma libera todos os endpoints
app.use(cors())
app.use(express.static("public"))
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use("/account", accountRouter)

app.listen(3000, async () => {

    try {
        await readFile("accounts.json",)
        logger.info("Api started!");
    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {
            logger.info("Api started and file created!");
        }).catch(err => {
            logger.error(err);
        })
    }
})