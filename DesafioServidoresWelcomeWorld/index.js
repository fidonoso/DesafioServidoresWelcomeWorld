
const http = require('http')
const url = require('url')
const fs = require('fs')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})

    const params = url.parse(req.url, true).query 

// crear
if (req.url.includes('/crear')) {
    let dia=new Date().getDate();
    let mes= new Date().getMonth() + 1;
    let contenido=`${dia < 10? '0'+ dia: dia}/${mes<10? '0'+mes: mes}/${new Date().getFullYear()} \n ${params.contenido}`;
    console.log(contenido)

    fs.writeFile(params.archivo, contenido, 'UTF-8', (err) => {
        
        if(err){
            res.write(`Error : ${err} Algo salió mal`)
            res.end()
        }
        res.write(`<h1>Archivo ${params.archivo} creado con éxito!</h1>`, 'UTF-8')
        res.end()
    })
}
// leer
if (req.url.includes('/leer')) {
    fs.readFile(params.archivo, 'UTF-8', (err, data) => {
        if (err){
            res.write('Error');
            console.log("error al leer el archivo " + err.code);
            res.end();
         }       
        res.write(`<p>${data}</p>`, 'UTF-8')
        res.end()
    })
}
//renombrar
if (req.url.includes('/renombrar')) {
    if (params.nombre){
        fs.rename(params.nombre, params.nuevoNombre, (err, data) => {
            res.write(`<h1>Archivo ${params.nombre} renombrado por ${params.nuevoNombre}</h1>`)
            res.end()
        })
    }
    else{
        res.write('No hay nombre')
        res.end()
    }
}
//eliminar
 if(req.url.includes('/eliminar')){
    if(params.archivo){
        fs.unlink(params.archivo, (err, data) => {
            if(err){
                res.write(`El archivo ${params.archivo} no existe`)
                res.end()
            }
            res.write(`<h1> Tu solicitud para eliminar el archivo ${params.archivo} se está procesando </h1>`)
            function eliminacion (){
                res.write(`<h1 class='text-primary'> El archivo ${params.archivo} fue eliminado correctamente </h1>`, 'UTF-8');
                res.end()
            }
            setTimeout(eliminacion,3000)
        })
    }
 }

})
.listen(8080, () => console.log('Escuchando el puerto 8080'))