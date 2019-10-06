const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const ejs=require('ejs');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const user=require('./datafile/database');
const expensetotal=require('./datafile/expense');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));




mongoose.connect('mongodb://localhost:27017/Expense',{useNewUrlParser:true},(err)=>{
    if(!err)
        console.log('connection established');
    else
        console.log("there is error");
});

app.get('/',(req,res)=>{
    res.render('register');
});
app.get('/login',(req,res)=>{
    res.render('login');
});

app.post("/addname", async(req, res) => {
    var myData = req.body;
    var checkdata=await user.findOne({email:req.body.email});
    if(!checkdata){
    myData.password=bcrypt.hashSync(myData.password, 10);
    mydata=new user(myData);
    mydata.save()
        .then(item => {
           // res.send("item saved to database");
            res.render('login');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
    }
    else{
        res.send("already used email");
    }
});
var id;
app.post('/checkname',async(req,res)=>{
    //var mylogindata=req.body;
    var userhere=await user.findOne({email:req.body.email});
    //console.log(userhere.password);
     if(userhere){
        // console.log('userfound');
       var valid=await bcrypt.compare(req.body.password,userhere.password);
       //console.log(valid);
       if(!valid){
           console.log('incorrect');
       }
       else{
          id=userhere._id;
          //console.log(id);
           res.render('yourexpense');
       }  
         }
     else{
         console.log('user not exist go to register');
     }
    
})

app.post('/addexpenses',(req,res)=>{
    var myexpense=req.body;
   //req.body._id=id;
   myexpense.key=id;
  
    var expenses=new expensetotal(myexpense);
    expenses.save()
    .then(item => {
        //res.send("item saved to database");
        res.render('yourexpense');
    })
    .catch(err => {
        console.error(err);
        res.status(400).send("unable to save to database");
    });
})

app.get('/getyourexpense',async(req,res)=>{
       //console.log(typeof(id));
       var client=await expensetotal.find({key:id});
       if(client){
           //console.log(true)
           //console.log(client);
           console.log(client[0].date);
           res.render('showexpenses',{client});
       }
        else{
            console.log('not found');
        }
});

app.listen('3000',(res,err)=>{
    if(err){
        console.log("error");
    }
    else{
        console.log("server is running");
    }
})