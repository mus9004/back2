const express = require('express');
const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret= 'expertos912';
const salt = bcrypt.genSaltSync(10);
const mysqlConnection= require('../database');

router.get('/',(req, res)=>{
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    //console.log(limit, offset);
    mysqlConnection.query('select * from productos',(err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }

    });
});

router.post('/prod',(req, res)=>{
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    const condi = req.body.cond;
    //const like = req.body.like;
    console.log(limit, offset, condi);
    mysqlConnection.query(`
        SELECT productos.idproductos, productos.descripcion,productos.peso, productos.unidadesCaja, unidadmedida.unidadMedida, categoria_productos.categoria, marca_prod.marca, genero_producto.genero, proveedor.proveedor, prod_presentacion.presentacioncol, productos.image, productos.activo
        FROM productos 
        INNER JOIN categoria_productos ON productos.idcat=categoria_productos.idcat 
        INNER JOIN genero_producto ON productos.idgenero=genero_producto.idgenero 
        INNER JOIN marca_prod ON productos.idmarca=marca_prod.idmarca 
        INNER JOIN prod_presentacion ON productos.idpresentacion = prod_presentacion.idpresentacion
        INNER JOIN proveedor ON productos.idproveedor=proveedor.idproveedor
        INNER JOIN unidadmedida ON productos.idMedida=unidadmedida.idMedida 
        WHERE ${condi} ORDER BY RAND()`,(err, rows, fields)=>{
            if (!err) {
                res.json(rows);
            } else {
                console.log(err);
            }
    });
});

router.get('/count',(req, res)=>{
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    //console.log(limit, offset);
    mysqlConnection.query('SELECT COUNT(*) from productos',(err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/todos',(req, res)=>{
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    console.log(limit, offset);
    mysqlConnection.query('call todosProductos(?, ?)',[limit, offset],(err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});
router.post('/un', (req, res) =>{
    const { id } = req.body;
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    
    console.log(id, offset , limit);
    mysqlConnection.query('CALL unProducto( ?, ?, ?)', [id, limit, offset], (err, rows, fields)=>{
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});
router.post('/cat', (req, res) =>{
    const { cat } = req.body;
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    
    console.log(cat, offset , limit);
    mysqlConnection.query('CALL catProducto( ?, ?, ?)', [cat, limit, offset], (err, rows, fields)=>{
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/catall', (req, res) =>{
    mysqlConnection.query('CALL catall()', (err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/marcaAll', (req, res) =>{
    mysqlConnection.query('CALL marcaAll()', (err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/proveeAll', (req, res) =>{
    mysqlConnection.query('CALL proveeAll()', (err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/seleMarca', (req, res) =>
{   const marc= req.query.marc;
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    console.log(marc,page,limit)
    mysqlConnection.query('CALL seleMarca( ? , ? , ?)',[marc, limit, offset], (err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/pedido', (req, res) =>
{   const pedidos= req.body;
    
    //console.log( pedidos[0].idproductos)
    pedidos.forEach(element => { /*console.log(element.user);*/
        mysqlConnection.query('INSERT INTO pedidos (codigoUsuario, cantidad, categoria, descripcion, idproductos, peso, unidadMedida, unidadesCaja, proveedor, fecha, comentario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
            [element.user, element.cantidad, element.categoria, element.descripcion,
                element.idproductos, element.peso, element.unidadMedida, 
                element.unidadesCaja, element.idproveedor, element.comentario], (err, rows, fields)=>{

            if (!err) {
                res.json(rows[0]);
            } else {
                console.log(err);
            }
        });
    });
});

router.get('/seleProve', (req, res) =>
{   const prove= req.query.prove;
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    console.log(prove,page,limit)
    mysqlConnection.query('CALL seleProve( ? , ? , ?)',[prove, limit, offset], (err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/seleCat', (req, res) =>
{   const cat= req.query.cat;
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    console.log(cat,page,limit)
    mysqlConnection.query('CALL seleCat( ? , ? , ?)',[cat, limit, offset], (err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/searchProd', (req, res) =>
{   const clave= req.query.clave;
    const page= req.query.page;
    const limit= req.query.limit*1;
    const offset = (page - 1) * limit;
    console.log(clave,page,limit)
    mysqlConnection.query('CALL searchProd( ? , ? , ?)',[clave, limit, offset], (err, rows, fields)=>{
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});
/*-----------------------------------------usuarios----------------------------------------*/

router.post('/user/createUser', (req, res) =>{
    const nombreContacto  = req.body.nombreContacto;
    const nombreNegocio  = req.body.nombreNegocio;
    const contrasena  = bcrypt.hashSync(req.body.contrasena);
    const email  = req.body.email;
    const rtn  = req.body.rtn;
    const telefono  = req.body.telefono;
    
    console.log(nombreContacto,nombreNegocio,contrasena,email,rtn,telefono);
    mysqlConnection.query('INSERT INTO usuario (codigoUsuario, nombreContacto, nombreNegocio, contrasena, email, rtn, telefono, activo) VALUES (0, ?, ?, ?, ?, ?, ?, 0)', 
        [nombreContacto, nombreNegocio, contrasena,email,rtn,telefono ], (err, rows, fields)=>{
        if (!err) {
            res.json(rows);
            
        } else {
            res.send({"error":err.errno,"message":err.sqlMessage,"code":err.code});
        }
    });
});
//---------------------------------------Login User------------------------------------//
router.post('/user/loginUser', (req, res) =>{
    
    const contrasena  = req.body.contrasena;
    const email  = req.body.email;
    console.log(contrasena,email);
    mysqlConnection.query('SELECT * FROM `usuario` WHERE usuario.email=?', [email], (err, rows, fields)=>{
        
        console.log((rows==""),rows);
        if ((!err) && (rows!="")) {
            const resultado= bcrypt.compareSync(contrasena, rows[0].contrasena)
            if (resultado) {
                if (rows[0].activo==1) {
                    const token = jwt.sign({ "user":{"id":rows[0].id,"codigoUsuario":rows[0].codigoUsuario, "nombreNegocio":rows[0].nombreNegocio, "email":rows[0].email, "rtn":rows[0].rtn}},secret,{expiresIn: 60 * 60 * 24})
                    res.send({"resul": resultado,"token":token });
                    //res.json(rows);
                    // console.log(resultado, "si conecto")    
                }else{
                    res.send({"resul": 400.0,"error":"Usuario no activo"  });
                }
            } else{
                res.send({"resul": 401.2,"error":"Error de contraseña"  });
            }
        } else {
            res.send({"resul": 401.1, "error":"Error de correo" });
        }
    });
});

/*------------*/

router.post('/user/loginUserAd', (req, res) =>{
    
    const contrasena  = req.body.contrasena;
    const email  = req.body.email;
    console.log(contrasena,email);
    mysqlConnection.query('SELECT * FROM `adcontra` WHERE  adcontra.email=?', [email], (err, rows, fields)=>{
        
        //console.log(err,(rows!=''));
        if ((!err) && (rows!='') ) {
            const resultado= bcrypt.compareSync(contrasena, rows[0].password)
            //console.log(resultado,"ddddddddddddddddddddddddddddddddd");
            if (resultado) {
                    res.send(JSON.parse('{"resul": 200,"error":"0" }'));
                    console.log(resultado,'ggggggggggg');
            } else{
                res.send(JSON.parse('{"resul": 401.2,"error":"Error de contraseña"}'));
            }
        } else {
            res.send(JSON.parse('{"resul": 401.1, "error":"Error de correo"}'));
        }
    });
});

/*------------*/
router.post('/mar', (req, res) =>{
    const contrasena  = req.body.contrasena;
    const email  = req.body.email;
    
    console.log(mar, offset , limit);
    mysqlConnection.query('SELECT * FROM `usuario` WHERE usuario.email=?', [email], (err, rows, fields)=>{
        if (!err) {
            const rerultado= bcrypt.compareSync(contrasena, rows[0].contrasena)
            if (rerultado) {
                const token  =jwt.sign({id : usuario._id},secret,{expiresIn: 60 * 60 * 24})
                res.json(rows);
            } 
        } else {
           // console.log(err);
        }
    });
});

/*----------add product-----*/
router.post('/prod/Addprod', (req, res) =>{
    const idproductos  = req.body.idproductos;
    const descripcion  = req.body. descripcion;
    const peso  = req.body.peso;
    const unidadesCaja  = req.body.unidadesCaja;
    const idMedida  = req.body.idMedida;
    const idcat  = req.body.idcat;
    const idmarca  = req.body.idmarca;
    const idgenero  = req.body.idgenero;
    const idproveedor = req.body.idproveedor;
    const idpresentacion  = req.body.idpresentacion;
    const image  = req.body.image;
    const activo  = req.body.activo

    const email  = req.body.email;
    const rtn  = req.body.rtn;
    const telefono  = req.body.telefono;
    
    console.log(nombreContacto,nombreNegocio,contrasena,email,rtn,telefono);
    mysqlConnection.query('INSERT INTO `productos` (`idproductos`, `descripcion`, `peso`, `unidadesCaja`, `idMedida`, `idcat`, `idmarca`, `idgenero`, `idproveedor`, `idpresentacion`, `image`, `activo`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [idproductos, descripcion, peso, unidadesCaja, idMedida, idcat, idmarca, idgenero, idproveedor, idpresentacion, image, activo ], (err, rows, fields)=>{
        if (!err) {
            res.json(rows);
            
        } else {
            res.send({"error":err.errno,"message":err.sqlMessage,"code":err.code});
        }
    });
});
/*---------------------------------------*/
router.post('/prod/showOrde', (req, res) =>{
    const condicion  = req.body.condicion;
    //console.log(nombreContacto,nombreNegocio,contrasena,email,rtn,telefono);
    mysqlConnection.query('SELECT * FROM `pedidos` WHERE 1',  [ condicion ], (err, rows, fields)=>{
        if (!err) {
            res.json(rows);
            
        } else {
            res.send({"error":err.errno,"message":err.sqlMessage,"code":err.code});
        }
    });
});
/*------------------------------------------- */
router.post('/5/:id', (req, res) =>{
    const {name, salary} = req.body;
    const {id} = req.params
    console.log(req.body);
    const query ="CALL employeeAddOrEdit(?, ?, ?)";
    mysqlConnection.query(query, [id, name, salary],(err, rows, fields)=>{
        if (!err) {
            res.json({Status:'Employees update'});
        } else {
            console.log(err.sqlMessage);
        }
    });
})

router.delete('/:id', (req, res) =>{
    const {id} = req.params;
    mysqlConnection.query('DELETE FROM employees WHERE id=?', [id],(err, rows, fields)=>{
        if (!err) {
            res.json({Status:'Employees delete'});
        } else {
            console.log(err);
        }
    });
})

module.exports=router;