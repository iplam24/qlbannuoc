const path=require('path');
const express = require('express');
const session = require("express-session");
const sessionStore = new session.MemoryStore();
const configBody =(app)=>{
    
app.use(express.json());
app.use(express.urlencoded({extended:true}));



// Cấu hình session
app.use(session({
    secret: "supersecretkey",  
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3 * 60 * 1000,  // 3 phút
        secure: false
    },
    store: sessionStore
}));


app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
}
module.exports=configBody;