const express = require('express')
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req,res,next) =>{
    const{username,password} = req.headers;
    const admin = ADMINS.find(a=> a.username === username && a.password ===password)

    if(admin){
        next();

    }else{
        res.status(403).json({message:'Admin authentication failed'});
    }
};

app.post('admin/signup',(req,res) => {
    const admin = req.body;
    const existAdmin = ADMINS.find(a => a.username === admin.username);

    if(existAdmin){
        res.status(403).json({message:'Admin already exists'});

    }
    else{
        ADMINS.push(admin);
        res.json({message:'Admin created successfully'})
    }
})
app.post('admin/login',adminAuthentication,(req,res)=>{
    res.json({message:'Logged in successfully'});
});