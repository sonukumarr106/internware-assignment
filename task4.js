const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app= express();
const port =3000;
const JWT_SECRET ="this-is-sign";
const SALT_ROUNDS =5;

app.use(express.json());

let users=[]
let nextuserid=1;

//signup
app.post('/signup', async (req,res)=>{

    try {
        const{username, fullname , password} = req.body;
        
        if(!username||!fullname||!password){
            return res.status(400).json({
                error:"invalid input",
                message:"feild is empty"
            });
        }


        const user = users.find(u=>u.username===username);
        if(user){
            return res.status(409).json({
                error:"input overlap",
                message:"username already taken"
            })
        }


        const hasedpassword = await bcrypt.hash(password, SALT_ROUNDS);


        const newuser={
            id : nextuserid++,
            username : username,
            password : hasedpassword,
            fullname : fullname,
            createdon :new Date(),

        }


        users.push(newuser);
        const {password: _,...userwithoutpassword}=newuser;
        res.status(201).json({
            message:"user created successfully",
            user:userwithoutpassword,
        });


        res.status(201).json({
            message:"user created successfully"
        });
    }

    catch(error){
        console.log("signup error", error);
        res.status(500).json({
            error:"internal error",
            message:"failed to create a user",
        })

    }
})

//login
app.post('/login', async (req,res)=>{
    try{
        const {username , password} =req.body;
        if(!username||!password){
            return res.status(400).json({
                error:"bad request",
                message:"username or password is empty"
            })

        }
        const user =users.find(u=>u.username===username);
        if(!user){
            return res.status(401).json({
                error:"authontication failed",
                message:"invalid username or password",
            })

        }
        const validpassword = await bcrypt.compare(password,user.password);
        if(!validpassword){
            return res.status(401).json({
                error:"invalid request",
                message:"invalid username or password",
            })
        };
        const payload={
            username:user.username,
            userid:user.id,
            fullname:user.fullname,
        };
        const token =jwt.sign(
            payload,
            JWT_SECRET,
            {
                expiresIn:'2d'
            }
        );
        const {password: _ , ...userwithoutpass}=user;
        res.json({
            message:"login successful",
            token:token,
            user:userwithoutpass,
        });

    }
    catch(error){
        console.log("error in logging",error)
        res.status(500).json({
            error:"internal problem",
            message:"try again after sometime"
        })
    }
} )




app.listen(port,()=>{
    console.log(`surver is running on the port ${port}`);

})