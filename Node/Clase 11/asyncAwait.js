async function hola(nombre) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("Hola " + nombre);
      resolve(nombre);
    }, 1000);
  });
}

async function hablar(nombre) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      console.log("bla bla bla bla bla bla bla bla ");
      resolve(nombre);
      reject("hay un error");
    }, 1000);
  });
}

async function adios(nombre) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      //Validamos el error o aprobacion
      console.log("Adios " + nombre);
      //if(error) reject("hay un error");
      resolve();
    }, 1000);
  });
}

//await hola("Gabriel"); // Esto es una mala sintaxis

// El await solo es válido dentro de una función asíncrona
async function main() {
  let nombre = await hola("Gabriel");
  await hablar();
  await hablar();
  await hablar();
  await adios(nombre);
  console.log("Terminamos el proceso...");
}

// console.log("Comenzamos el proceso...");
// main();
// console.log("Esta sera la segunda instrucción");

// Este es el mismo código pero en inglés
async function sayHello(name) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("Hello " + name);
      resolve(name);
    }, 1000);
  });
}

async function talk(name) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      console.log("bla bla bla bla bla bla bla bla ");
      resolve(name);
    }, 1000);
  });
}

async function sayBye(name) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      console.log("Goodbye " + name);
      resolve(name);
    }, 1000);
  });
}

async function conversation(name) {
  console.log("Code in English");
  console.log("Starting the async process...");
  await sayHello(name);
  await talk();
  await talk();
  await talk();
  await sayBye(name);
  console.log("Process completed");
}

conversation("Gabriel");
