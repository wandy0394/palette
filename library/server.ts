import express, {Request, Express, Response} from "express"
import cors from "cors"
import libraryRouter from "./v1/routes/library.routes"
import userRouter from "./v1/routes/users.routes"
import helmet from 'helmet'

const app:Express = express()
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use("/api/v1/paletteLibrary", libraryRouter)
app.use("/api/v1/users", userRouter)

app.use("*", (req:Request, res:Response) => {
    res.status(404).json({error:'Invalid endpoint url'})
})

export default app