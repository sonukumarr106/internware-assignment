const express = require('express');
const app = express();
const port = 3000;
let tasks=[];
let tid=1;

app.get('/',(req,res )=>{
    res.json({"message":"Server runing"})
})
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
        createdon:new date(),
        updatedon,

    };

    tasks.push(newtask);
    return res.status(200).json(newtask);
})
//tasks return 
app.get('/tasks',(req,res)=>{
    res.json(tasks);
})


//task delete
app.delete('/tasks/:id',(req,res)=>{
    const id =parseInt(req.params.id);
    const task =tasks.find(t=>t.id===id);

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



app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
