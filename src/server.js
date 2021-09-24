import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mediaRouter from "./services/media/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, genericServerErrorHandler } from "./services/errorHandlers.js"


const server = express()
const port = process.env.PORT

// ***************** CORS ***********************
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

const corsOpts = {
    origin: function (origin, next) {
        console.log("CURRENT ORIGIN: ", origin)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            // if received origin is in the whitelist we are going to allow that request
            next(null, true)
        } else {
            // if it is not, we are going to reject that request
            next(new Error(`Origin ${origin} not allowed!`))
        }
    },
}

// ***************** GLOBAL MIDDLEWARES ***********************
server.use(cors(corsOpts))
server.use(express.json())

// ***************** ENDPOINTS *********************
server.use("/media", mediaRouter)

// *********************** ERROR MIDDLEWARES *************************
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(genericServerErrorHandler)
console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})