const express = require('express');
const bodyParser = require('body-parser')
const password = 'ilike3+6=9+git2';
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://masud369:ilike3+6=9+git2@cluster0.kz5wbn2.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const ObjectId = require("mongodb").ObjectId;

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// app.get('/', function (req, res) {
//   res.send('hello world')
// })

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/index.html")
})

client.connect(err => {
    const collection = client.db("organicdb").collection("products");
    // perform actions on the collection object
    const sampleProduct = {name:"modhu",quantity:'2btl',price:2000}
    collection.insertOne(sampleProduct)
    .then(result=>{
        console.log("one prduct added!")
    })
    //posting data from user to database
        app.post("/addPost",(req,res)=>{
            const userForm = req.body;
            collection.insertOne(userForm)
            .then(result=>{console.log("hone added successfully")})
            console.log(userForm);
            res.redirect("/");
        })
    
     //getting data from database
     app.get("/posts",(req,res)=>{
        collection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
     })   

     //find update data from database
     app.get("/posts/:id",(req,res)=>{
        collection.find({_id:ObjectId(req.params.id)})
        .toArray((err,document)=>{
            res.send(document[0]);
        })
     })
    //update data
    app.patch("/updated/:id",(req,res)=>{
        const product = req.body;
      collection.updateOne({_id:ObjectId(req.params.id)},
      {   $set:{
            quantity:product.quantity,
            price:product.price,
        }
    })
    .then(result=>{
        console.log(result);
        res.send(result.modifiedCount > 0);
    })
            
    })




     //delete data from database

     app.delete("/delete/:id", (req, res)=>{
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result=>{
            console.log('delete successful');
            res.send(result.deletedCount > 0);
        })
     })

    console.log("database connected");
    
  });


app.listen(3000)



