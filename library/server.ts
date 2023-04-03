import express, {Request, Express, Response} from "express"
import cors from "cors"
import libraryRouter from "./v1/routes/library.routes"
import userRouter from "./v1/routes/users.routes"
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

const app:Express = express()
const allowedOrigins = ['http://192.168.0.128:5173']
app.use(cors({
    //By default, Access-Control-Allow-Origin is *. This cannot be * for credentials to pass through
    // Refer to error 'Reason: Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is *
    origin:function(origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg:string = 'The CORS Policy of this site does not allow access from specified Origin.'
            return callback(new Error(msg), false);
        }
        return callback(null, true)
    },
    credentials:true    //allow HTTP cookies and credentials from the client
}))
app.use(express.json())
app.use(helmet())
app.use(cookieParser())

app.use("/api/v1/paletteLibrary", libraryRouter)
app.use("/api/v1/users", userRouter)

app.use("*", (req:Request, res:Response) => {
    res.status(404).json({error:'Invalid endpoint url'})
})

export default app