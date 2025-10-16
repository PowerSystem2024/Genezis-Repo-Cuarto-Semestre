function hola(nombre) {
    return new Promise((resolve, reject) => {
        setTimeout( function() {
            console.log('Hola '+nombre);
            resolve(nombre);
        }, 1000);
    });
}

function hablar() {
    return new Promise((resolve, reject) => {
        setTimeout( function() {
            console.log('Hola '+nombre);
            resolve(nombre);
        }, 1000);
    });
}

function hablar() {
    return new Promise((resolve, reject) => {
        setTimeout( function() {
            console.log('Bla bla bla...');
            resolve();
        }, 1000);
    });
}

function adios(nombre) {
    return new Promise((resolve, reject) => {
        setTimeout( function() {
            console.log('Adiós '+nombre);
            //resolve();
            reject('Hay un error');
        }, 1000);
    });
}

//Llamamos a la función 
console.log('Iniciando el proceso...')
hola('Gabriel')
    .then(hablar)
    .then(hablar)
    .then(hablar)
    .then(adios)
    .then(nombre => {
        console.log('Terminando el proceso...')
    })
    .catch(error => {
        console.error('Ha habido un error: ');
        console.error(error);
    })
    