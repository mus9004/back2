const express = require('express');
const cors = require('cors')
const helmet = require("helmet");

//crear express app
const app=express();
//configuraciones
app.set('port', process.env.PORT || 3000)
//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
//Routes
app.use(require('./routes/employees'));
//iniciar server
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
});