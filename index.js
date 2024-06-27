const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const dotenv= require('dotenv')
dotenv.config({ path: path.join(__dirname, './config/.env') })
const connect= require("./config/connection")
connect()
app.use(express.json())
//________________________________________________________________
const auth=require('./auth/auth.route')
app.use('/auth', auth)
//________________________________________________________________
const project= require('./project/project.router')
app.use('/project', project)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))