// this === global === true

// Mostrar algo en consola
// console.log();

// Mostrar un mensaje en forma de error
// console.error();

// Ejecutar un código después de un tiempo
// setTimeout(() => {});

// Ejecutar un código cada intervalo de tiempo
// setInterval(() => {});

// Da prioridad de ejecución a una función asincrónica
// setImmidiate(() => {}); // Documentación -> https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate

// Mostrar documentación
// console.log(global); // sirve para ver todas las variables y funciones globales que existen en Node.js
// console.log(setInterval); // sirve para ver la función setInterval
// console.log(process); // sirve para ver toda la información del proceso actual de Node.js
// console.log(__dirname); // sirve para ver la ruta absoluta del directorio donde se encuentra el archivo que se está ejecutando

let i = 0;
let intervalo = setInterval(() => {
  console.log("Hola");
  if (i === 3) {
    clearInterval(intervalo); // Detiene la función
  }
  i++;
}, 1000);

setImmediate(() => {
  console.log("Saludo inmediato");
});

// require();

console.log(__filename); // sirve para ver la ruta absoluta del archivo que se está ejecutando

// Variables globales no es buena práctica usarlas en Node
globalThis.miVariable = "Mi variable global";
console.log(miVariable);
