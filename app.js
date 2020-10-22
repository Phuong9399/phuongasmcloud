var express = require('express')
var app = express();
var fs = require('fs');
var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));
const engines = require('consolidate');
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');
//localhost:5000
app.get('/', function (req, res) {
    res.render('index');
})
app.get('/insert', function (req, res) {
    res.render('insert');
})
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://heroku_tc9nzks7:guscnrp9f9ua8p43oln0a07od9@ds261917.mlab.com:61917/heroku_tc9nzks7";
app.post('/doInsert', async (req, res) => {
    let client = await MongoClient.connect(url);
    let inputName = req.body.txtName;
    let inputPrice = req.body.txtPrice;
    let dbo = client.db("heroku_tc9nzks7");
    let data = {
        name: inputName,
        price: inputPrice,
    }
    if (inputName >=5 && inputname <=15 ) {
        let errorModel = {
            nameError: "Tên phải lớn từ 5 đến 15 kí tự!"
        };
        res.render('insert', { model: errorModel })
    }
        else if (!checkNumber(inputPrice) ) {
            console.log("num")
            let errorModel = {
                priceError: "Giá sản phẩm phải là số!"
            };  
            res.render('insert', { model: errorModel })
        } 
     else {
        await dbo.collection("Product").insertOne(data);
        res.redirect('/listsanpham');
    }
})
app.get("/listsanpham", async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("heroku_tc9nzks7");
    let result = await dbo.collection("Product").find({}).toArray();
    res.render("listsanpham", { model: result });
})
app.get('/remove', async (req, res) => {
    let id = req.query.id; 
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("heroku_tc9nzks7");
    await dbo.collection("Product").deleteOne({ _id: ObjectID(id) });
    res.redirect('/listsanpham');
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running in 3000 port");
});
function checkNumber(num)
{
    if(isNaN(num)){
      return false;
     }else{
        return true;
     }
}