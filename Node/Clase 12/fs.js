const fs = require("fs");

// 1. leemos el archivo .txt
function leer(ruta, cb) {
  fs.readFile(ruta, (err, data) => {
    //console.log(data.toString());
    cb(data.toString()); // Usamos el callback para devolver el resultado
  });
}

// 2. Escribimos el archivo1.txt creandolo
function escribir(ruta, contenido) {
  fs.writeFile(ruta, contenido, function (err) {
    if (err) {
      console.log("No se ha podido escribir", err);
    } else {
      console.log("se ha escrito correctamente");
    }
  });
}

// 3. Eliminamos el archivo1.txt
function borrar(ruta, cb) {
  fs.unlink(ruta, cb); //elimina de manera asincrona
}

// Este es el metodo para leer un archivo con el objeto fileSystem trabajando de manera asincrona
//leer(`${__dirname}/archivo.txt`, console.log);

// Este es el metodo para escribir un archivo con el objeto fileSystem trabajando de manera asincrona
//escribir(`${__dirname}/archivo1.txt`,'Reescribimos el archivo', console.log);

borrar(`${__dirname}/archivo1.txt`, console.log);
