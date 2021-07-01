const express = require('express');
const cors = require('cors')
const helmet = require("helmet");

//crear express app
const app=express();
const port = process.env.PORT || 3000;
//configuraciones
//app.set('port', process.env.PORT || 3000)
//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
//Routes
app.use(require('./routes/employees'));
//iniciar server
app.listen(port,()=>{ console.log(`server on port',${port}`)});