const mongoose=require('mongoose');

/*mongoose.connect('mongodb://localhost:27017/Expense',{useNewUrlParser:true},(err)=>{
    if(!err)
        console.log('connection established');
    else
        console.log("there is error");
});*/
//var ObjectId = mongoose.Schema.Types.ObjectId;

var expenseSchema=new mongoose.Schema({
    key:String,
    occasion:String,
    spent:String,
    date:String,
    password:String,
});
var expensetotal=mongoose.model("expensetotal",expenseSchema);
module.exports=expensetotal;