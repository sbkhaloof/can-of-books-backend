'use strict';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();
const userModel = require('./modules/User')
console.log(userModel);

const server = express();
server.use(cors());
const PORT = process.env.PORT;


// // Middleware: checkpoint to parse the body of the request
server.use(express.json())

mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });



// const bookSchema=new mongoose.Schema({
//     name: String,
//     description: String,
//     status:String, 
//     img:String
// });
// const uerSchema=new mongoose.Schema({
//     email:String,
//     books:[bookSchema]
// })
// const userModel=mongoose.model('user',uerSchema)



function seedUserCollection() {
    const siham = new userModel({
        email: 'sehammalkawi92@gmail.com',
         books: [
            { name: 'The Growth Mindset',
             description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.',
              status: 'FAVORITE FIVE',
               img: 'https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg' 
            },
            { name: 'The Momnt of Lift',
             description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.',
              status: 'RECOMMENDED TO ME',
               img: 'https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg' 
            }
        ]
    })
    // siham.save();

}
//  seedUserCollection();

server.get('/', handelProofOfLifeRoute)

//-------------------------user information from database--------------

//http://localhost:3003/books?userEmail=sehammalkawi92@gmail.com
server.get('/books', getBooksData);

//http://localhost:3003/addbook?userEmail=sehammalkawi92@gmail.com&name=The Momnt of Lift&
// description=Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation&status=RECOMMENDED TO ME&img=https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg
server.post('/addbook',addBookHandler);

//http://localhost:3003/deletebook/1?userEnail=sehammalkawi92@gmail.com
server.delete('/deletebook/:bookId',deleteBookHandler);

function handelProofOfLifeRoute(request, response) {
    
    response.send('every thing is working')
}
function getBooksData(request, response) {

    let userEmail = request.query.userEmail;
    console.log(userEmail)
   
    
    userModel.find({ email: userEmail }, (error, userData)=> {
        // console.log(userData)
        if (error) { response.send(error, 'did not work') }
        else {
             response.send(userData[0].books) }
             
    
})}

//---------------------------------------function for adding data-------------------

function addBookHandler(req,res){
    console.log(req.body);
    let { userEmail,bookName,description,status,img } =req.body
    userModel.find({email:userEmail},(error,userData)=>{
        // console.log(userData);
        if (error){res.send(error,'did not find useremail')}
        else{
            console.log('befor adding book',userData);
            userData[0].books.push(
                {
                    name:bookName,
                    description:description,
                    status:status,
                    img:img

                }
            )
             console.log('after adding',userData[0])
            userData[0].save()
            res.send(userData[0].books)
    }
    })
}

//---------------------------------------function for delete data------------


function deleteBookHandler(req,res){
 console.log(req.params);
 console.log(req.query);
let index=Number(req.params.bookId);
let userEmail = req.query.email;

userModel.find({email:userEmail},function (error, userData){
    if (error){res.send('cant find book')}
    else {console.log('befor deleting',userData[0].books)
let bookArrayAfterDelete=userData[0].books.filter((book,idx)=>{
    if(idx !== index){return book}
})
userData[0].books=bookArrayAfterDelete
console.log('after deletion',userData[0].books)
userData[0].save();
res.send(userData[0].books)
}
})

}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})