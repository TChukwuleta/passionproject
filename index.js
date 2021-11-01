const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const uri = 'mongodb://localhost/passionproject'
mongoose.connect(uri, { useNewUrlParser: true })
.then(() => {
    console.log('Passion project to the moon')
})
.catch((e) => {
    console.log(e)
})


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const port = 7777 || process.env.PORT
app.listen(port, () => {
    console.log(`My passion project is listening on port ${port}`)
})

//https://medium.com/@gftf2011/this-tutorial-will-dive-in-the-node-js-b4c1d6f94fab
