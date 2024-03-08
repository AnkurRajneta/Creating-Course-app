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

const userAuthentication = (req,res,next) =>{
    const {username,password} = req.headers;
    const user = USERS.find(a => a.username ===username & a.password === password)

    if(user){
        req.user = user;
        next();
    }
    else{
        res.status(403).json({message:'User authentication failed'})
    }

}

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

app.post('/admin/courses',adminAuthentication,(req,res) => {
    const course = req.body;
    if(!course.title){
        return res.json(411).send({"msg":"Please send me the title"});
    }
    course.id = Date.now();
    COURSES.push(course);
    res.json({message:'Course created successfully,courseId:course.id'});

});
app.put('/admin/courses/:courseId', adminAuthentication, (req,res) =>{
    const courseId = parseInt(req.params.courseId);
    const course = COURSES.find(c => c.id ===courseId);
    if(course){
        Object.assign(course,req.body);
        res.json({message:'Courses Updated successfully'});
    }else{
        res.status(404).json({message:'Course not found'});
    }

    }); 
   

    app.post('/users/signup',(req,res) =>{
        //const user = {...req.body, purchasedCourses: []};
        const user = {
            username : req.body.username,
            password: req.body.password,
            purchasedCourses: []
        }
        USERS.push(user);
        res.json({message:"User created successfully"});
    }); 

    app.post('/users/login',userAuthentication,(req,res) =>{
        res.json({message:'Logged in successfully'});

    });

    app.get('/users/courses',userAuthentication)
      