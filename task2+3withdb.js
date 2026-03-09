const express = require('express');
const app = express();
const mongoose = require('mongoose')
require('dotenv').config();
const db = process.env.dbpass
const port = 3000;
let tasks=[];
let tid=1;

//middleware 
app.use((req,res,next)=>{
    console.log(` method is ${req.method} at the subdomain ${req.url}`);
    next();
})

app.use(express.json());

app.get('/',(req,res )=>{
    res.json({"message":"Server runing"})
})
mongoose.connect(db
).then(()=>console.log("db connected"))
.catch(err=>console.log("db not connected",err));

//task post
app.post('/tasks',(req,res )=>{
    const {title, description}=req.body;
    //validation
    if(!title || !description ){
        return res.status(400).json({error:"title or description is mising"});

    }
    const newtask={
        ntid:tid++,
        title,
        description,
        createdon:new Date(),
        completed:false,
        

    };

    tasks.push(newtask);
    return res.status(200).json(newtask);
})
tasks.push({
  id: tid++,
  title: "Learn Express",
  description: "Complete tutorial",
  completed: false,
  createdAt: new Date()
});

tasks.push({
  id: tid++,
  title: "Buy groceries",
  description: "Milk, eggs, bread",
  completed: true,
  createdAt: new Date()
});

tasks.push({
  id: tid++,
  title: "Finish project",
  description: "Submit by Friday",
  completed: true,
  createdAt: new Date()
});

//tasks return 
app.get('/tasks',(req,res)=>{
    res.json({
        task:tasks,
    
    }
    );
})


//task delete
app.delete('/tasks/:tid',(req,res)=>{
    const id =parseInt(req.params.tid);
    const task =tasks.find(t=>t.tid===tid);

    if(!task){
        return res.status(404).json({
            error:"task not found"
        });
    }
    tasks = tasks.filter(t=>t.id!==id);
    res.json({
        "message":"task deleted",
        "deleted task":task
    });
});

//task update 

app.put('/tasks/:id',(req,res)=>{
    const id =parseInt(req.params.id);
    const {title, description}=req.body;
    const task = task.find(t=>t.id===id);

    if(!task){
        return res.status(404).json({
            error:"task not found",
        });

    }
    if(title){
        task.title=title
    };
    if(description){
        task.description=description
    };
    task.updatedon= new time();
    re.json(task);
})

//completed task
app.get('/tasks/done',(req,res)=>{
    const completedtasks=tasks.filter(task=>task.completed===true);
    const incompletedtasks=tasks.filter(task=>task.completed===false);
    
    res.json({
        message:"completed tasks",
        completedtasks:completedtasks.length,
        incompletedtasks:incompletedtasks.length,
        completed:completedtasks,
    })


})


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
