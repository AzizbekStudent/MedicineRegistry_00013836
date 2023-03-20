// Student ID: 00013836
const express = require('express')
const fs = require('fs')
const medicine = express.Router()

// creating new medicine record 
// I removed "/medicine" from all routes, the main reason for this is that main application use this rout where it will see
// "/medicines"
medicine.get('/create', (req, res)=>{
    // but before programm should read categories which are available in category database
    fs.readFile('./data/categories.json', (err, data)=>{
        if (err) throw err // if there is no error, we send categories list from backend to the frontend
        const categories = JSON.parse(data)
        res.render('CreateMedicine', { categories: categories})
    })   
})
// getting user input
medicine.post('/create', (req, res)=>{
    // before entering the data in controllers programm should read the data from categories data
    fs.readFile('./data/categories.json', (err, data)=>{
        if(err) throw err
        // then get user input from controllers
        // assigning the categories database
        const categories = JSON.parse(data)
        // getting user input from controllers
        const Med_name = req.body.Name_Medicine
        const Med_desc = req.body.Description_Medicine
        const Med_Cate = req.body.Category_Medicine
        // validation
        if (Med_name.trim() === '' || Med_desc.trim() === '' ||  Med_Cate.trim() === '' ){
            res.render('CreateMedicine', { error: true })// we are rendering the page with error because user tried to enter empty text to the data
        }// I used "&&" but this method of setting condition does not help me to prevent from empty input  then I used "||" 
        else{ // if controllers are not empty we will push the information to the data
            fs.readFile('./data/medicines.json', (err, data)=>{// first we check is there related database
                if (err) throw err // if no we show error
                // if database is there we will push new records to it
                const Medicines = JSON.parse(data)
                // each new record will have uniq id
                Medicines.push({
                    id: id(),
                    title: Med_name,
                    description: Med_desc,
                    category: Med_Cate
                })// properties of our database
                // converting variables to the json object files
                fs.writeFile('./data/medicines.json', JSON.stringify(Medicines), err =>{
                    if (err) throw err
                    // after entering the data to databse notifiying the user about succesfull operation
                    res.render('CreateMedicine', {succes: true, categories: categories} )
                })
            })
        }
    })
    
}) //  end of the entering data
// this function for generating id for medicines
function id(){// creating uniq id for each new record
    const randomNum = '_' + Math.random().toString(36).substring(2, 11);
    return  randomNum;
}
// medicine records
// reading the data from json file
medicine.get('/list', (req, res)=>{
    // reading the database
    fs.readFile('./data/medicines.json', (err, data)=>{
        if(err) throw err // if error we exit from from application and show error
        // if there is no error we assign database to the variable
        const Medicines =JSON.parse(data)
        // then we render pug file related to the medicines list
        res.render('medicines', { Medicines: Medicines })
    })
})
// delete for medicines
medicine.get('/list/:id/delete', (req, res)=>{
    const id = req.params.id
    // we get uniq id 
    fs.readFile('./data/medicines.json', (err, data)=>{
        if (err) throw err
        // we check for existance of the database
        const Medicines = JSON.parse(data)
        const new_medicines = Medicines.filter(new_medicines=>new_medicines.id != id ) // we save database without that element which we terminated
        fs.writeFile('./data/medicines.json', JSON.stringify(new_medicines), (err, data)=>{// we rewrite our database
            if (err) throw err
            // check for any error
            // then we render the page with new database and message
            res.render('medicines', { Medicines: new_medicines, deleted_item: true})
        })

    })
})
// detail page for medicine
medicine.get('/list/:id', (req, res)=>{
    // updating the record in the details page
    const id = req.params.id
    // get the id of the record
    fs.readFile('./data/medicines.json', (err, data)=>{ // check the database
        if(err) throw err
        // if no error we move on
        const Medicines =JSON.parse(data)// Database which contains records of medicines
        // we get selected medicine from whole list of medicines
        const medicine = Medicines.filter(medicine => medicine.id == id)[0]
        // for testing that id is working or not
        //console.log('medicine:', medicine)
        //console.log('id:', id)
        fs.readFile('./data/categories.json', (err, data)=>{ // in this page we also use another database 
            if (err) throw err // we check that database in the folder
            const categories = JSON.parse(data) // assign it to the data base
            const category = categories.filter(category => category.id == medicine.category)[0] // we are selecting that record whichs id is similar with the medicine id and category
            res.render('MedDetail', { categories: categories, medicine: medicine, category:category})
            // we are rendering detail page
        })
    })
})// end of the detail rendering page
// updating process in the detail page
medicine.post('/list/:id', (req, res) =>{
    // getting id of the record
    const id = req.params.id
    // get user input from each controller in the page
    const title_m = req.body.Name
    const desc_m = req.body.Description
    const Category_m = req.body.Category
    // validation
    if(title_m.trim()==='' || desc_m.trim()===''){
        res.render('medicines', {error: true})// rendering the list of records with error
    }
    else{// if there is no validation
        fs.readFile('./data/medicines.json', (err, data)=>{ // read the database for medicines
            if (err) throw err // check for errors (Call Back function)
            const M_list = JSON.parse(data) // assigning database
            const m_record = M_list.filter(m_record => m_record.id == id)[0] // filtering the particular record
            fs.readFile('./data/categories.json', (err, data)=>{ // we also have second database
                if (err) throw err // cb function
                const Categories = JSON.parse(data) // assigning Categories list to this variable
                const M_category = Categories.filter(M_category => M_category.id == m_record.category)[0]// filtering the 
                //particular category which has id identinc to the id of category in medicine record
                // GETTING properties of the exact record
                const M_index = M_list.indexOf(m_record) 
                const spliced_medicine = M_list.splice(M_index, 1)[0]
                // changing information with new one
                spliced_medicine.id = id
                spliced_medicine.title = title_m
                spliced_medicine.description = desc_m
                spliced_medicine.category = Category_m
                // entering the new record or changing the record in the database
                M_list.push(spliced_medicine)
                fs.writeFile('./data/medicines.json', JSON.stringify(M_list), (err)=>{
                    if (err) throw err // calback function
                    // rendering the list of medicines with special message
                    res.render('medicines', {Medicines: M_list, sended: true, cat_value: M_category})
                })
            })
        })
    }
})
// exporting all this codes
module.exports = medicine