// Student ID: 00013836
const express = require('express')
const fs = require('fs')
const category = express.Router()

// creating new category
category.get('/create', (req, res)=>{
    res.render('CreateCategory')
})
// entering user input to the database 
category.post('/create', (req, res)=>{
    // getting user input from controllers
    const Category_name = req.body.Name_Category
    const Category_desc = req.body.Description_Category
    if (Category_name.trim() === '' || Category_desc.trim() === ''){
        res.render('CreateCategory', { error: true })// we are rendering the page with error because user tried to enter empty text to the data
    }// I used "&&" but this method of setting condition does not help me to prevent from empty input then I used this "||"
    else{ // if controllers are not empty we will push the information to the data
        fs.readFile('./data/categories.json', (err, data)=>{// first we check is there related database
            if (err) throw err // if no we show error
            // if database is there we will push new records to it
            const Categories = JSON.parse(data)
            // each new record will have uniq id
            Categories.push({
                id: id_c(),
                title: Category_name,
                description: Category_desc,
            })
            // converting variables to the json object files
            fs.writeFile('./data/categories.json', JSON.stringify(Categories), err =>{
                if (err) throw err
                // after entering the data to databse notifiying the user about succesfull operation
                res.render('CreateCategory', {succes: true} )
            })
        })
    }
})
// this function for generating id for categories
function id_c(){
    const randomNum = '_' + Math.random().toString(36).substring(2, 11);
    return  randomNum;
}
// category records
category.get('/list', (req, res)=>{
    fs.readFile('./data/categories.json', (err, data)=>{// reading the database
        if(err) throw err//cb function
        const Categories =JSON.parse(data) // assigning the database
        // rendering the list of the categories
        res.render('Categories', { Categories: Categories })
    })
})
// detail page for category
// update operation
category.get('/list/:id/update', (req, res)=>{
    const id = req.params.id
    // getting uniq id of the record
    fs.readFile('./data/categories.json', (err, data)=>{
        if(err) throw err //cb funtion
        const Categories =JSON.parse(data) // assigning the data
        const category_c = Categories.filter(category_c => category_c.id == id)[0]// filtering the specific record
        // for testing that id is working or not
        //console.log('category:', category)
        //console.log('id:', id)
        res.render('CategoryDetail', {category: category_c})
    })
})
// update procces
category.post('/list/:id/update', (req, res)=>{
    const id = req.params.id
    // getting id of the record
    const title_c = req.body.Name
    const descr_c = req.body.Description
    // getting user input
    fs.readFile('./data/categories.json', (err, data)=>{ // reading the data base
        if (err) throw err // cb function
        const C_list = JSON.parse(data) // whole list of categories
        const c_record = C_list.filter(c_record=>c_record.id == id)[0] // specific record
        if( title_c.trim() === '' || descr_c.trim() === '' ){ // validation
            res.render('Categories', {Categories: C_list, error: true})// if error we render wrong message
        }else{
            // getting exact category from whole list of categories
            const category_index = C_list.indexOf(c_record)
            const spliced_category = C_list.splice(category_index, 1)[0]
            // changing the existing data with data in controllers
            spliced_category.id = id
            spliced_category.title = title_c
            spliced_category.description = descr_c
            C_list.push(spliced_category)
            fs.writeFile('./data/categories.json', JSON.stringify(C_list), (err)=>{ // writing new data to the whole list
                if(err) throw err // cb function
                res.render('Categories', {Categories: C_list, sended: true}) // render list of records with succes message
            }) 
        }        
    })
})
// delete function for categories
category.get('/list/:id/delete', (req, res)=>{
    const id = req.params.id
    //getting id of the record
    fs.readFile('./data/categories.json', (err, data)=>{// reading the database
        if (err) throw err // cb function
        const categories = JSON.parse(data) // assigning database to the variable
        const new_categories = categories.filter(new_categories=>new_categories.id != id ) //getting all records except chosen one
        fs.writeFile('./data/categories.json', JSON.stringify(new_categories), (err)=>{ // deleting record from database
            if (err) throw err // cb function
            // rendering list of categories with success message
            res.render('Categories', { Categories: new_categories, deleted_item: true})
        })
    })
})
// exporting all this codes
module.exports = category