const express  = require('express');
const app = express();
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render("index");
})


app.post('/create', (req,res)=>{
    let {name,email,password,age}=req.body;
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(password,salt, async (err,hash) => {
            let user = await userModel.create({
                name,
                email,
                password:hash,
                age
            });
            res.send(user);
        })
    })
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.post('/login', async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.status(401).send("Email not found");

        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            return res.send("Yes, you can login");
        } else {
            return res.status(401).send("Incorrect password");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});



app.listen(3000);
