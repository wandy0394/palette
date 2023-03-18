import dotenv from 'dotenv'
import app from './server'
import mysql2, {Connection} from 'mysql2'
import LibraryService from './services/libraryService'

dotenv.config()

let connection:Connection = mysql2.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    multipleStatements:true,
})
connection.connect((err)=>{
    if (err) {
        console.error('Could not connect to SQL database')
        console.error(err)
    }
    LibraryService.injectConn(connection)
    LibraryService.connectionCheck()
})



const port = process.env.PORT


app.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})