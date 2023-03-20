//Student ID: 00013836
// Project name 
// =======================
// == Medicine Registry ==
// =======================
const express = require('express')
const app = express()
const fs = require('fs')

// Secondary variables
const PORT = 3000
const medicines = require("./routes/medicine")
const categories = require("./routes/categories")

// middlewares
app.set('view engine', 'pug') // I am explicitly saying that I use pug in this server 
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false}))
//  routes
app.use("/medicines", medicines) // instead of "/medicines" application will use medicine.js
app.use("/categories", categories) // instead of "/categories" application will use categories.js

// rendering pages
// main page or home page
app.get('/', (req, res)=>{
    res.render('index')
})
// define api for medicines
app.get('/api/v1/listOfMedicines', (req, res)=>{
    fs.readFile('./data/medicines.json', (err, data)=>{
        if(err) throw err // cb function  'cb' callback
        const Medicines =JSON.parse(data)
        res.json(Medicines)// showing whole data on the page
    })
})
// define api for categories
app.get('/api/v1/listOfCategories', (req, res)=>{
    fs.readFile('./data/categories.json', (err, data)=>{ // reading the data
        if(err) throw err// cb function
        const Categories =JSON.parse(data)
        res.json(Categories) // showing whole data on the page
    })
})


// runing the server on localhost: 3000
app.listen(PORT, err =>{
    // if something wents wrong we will see the error on the console
    if (err) console.log(err)
    // if everything is fine we will see the following message
    console.log(`Server is runing on localhost:${PORT}`)
})
