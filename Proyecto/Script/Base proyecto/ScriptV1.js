const readlineSync = require('readline-sync');

// Clase Paciente
class Paciente {
    constructor(nombre, edad, genero, sisben, regimen, salario) {
        this.nombre = nombre;
        this.edad = edad;
        this.genero = genero;
        this.sisben = sisben;
        this.regimen = regimen;
        this.salario = salario;
    }
}

// Clase Prueba
class Prueba {
    constructor(nombre, tipo, costo, descuentoSisben = {}) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.costo = costo;
        this.descuentoSisben = descuentoSisben;
    }
}

// Clase Laboratorio
class Laboratorio {
    constructor(nombre) {
        this.nombre = nombre;
        this.pruebas = [];
    }

    agregarPrueba(prueba) {
        this.pruebas.push(prueba);
    }
}

// Función para solicitar datos de paciente desde la consola
function solicitarDatosPaciente() {
    const nombre = readlineSync.question("Nombre del paciente: ");
    const edad = parseInt(readlineSync.question("Edad del paciente: "));
    const genero = readlineSync.question("Género del paciente (M/F): ");
    const sisben = readlineSync.question("Nivel del Sisben del paciente (A/B1/B2): ");
    const regimen = readlineSync.question("Tipo de régimen del paciente (contributivo/subsidiado): ");
    const salario = parseFloat(readlineSync.question("Salario del paciente: "));
    return new Paciente(nombre, edad, genero, sisben, regimen, salario);
}

// Función para solicitar datos de prueba desde la consola
function solicitarDatosPrueba() {
    const nombre = readlineSync.question("Nombre de la prueba: ");
    const tipo = readlineSync.question("Tipo de la prueba: ");
    const costo = parseFloat(readlineSync.question("Costo de la prueba: "));
    const descuentoSisben = {};
    const nivelesSisben = ['A', 'B1', 'B2'];
    nivelesSisben.forEach(nivel => {
        const descuento = parseFloat(readlineSync.question(`Descuento para nivel ${nivel}: `));
        if (descuento > 0) {
            descuentoSisben[nivel] = descuento;
        }
    });
    return new Prueba(nombre, tipo, costo, descuentoSisben);
}

// Función para solicitar datos de laboratorio desde la consola
function solicitarDatosLaboratorio() {
    const nombre = readlineSync.question("Nombre del laboratorio: ");
    return new Laboratorio(nombre);
}

// Solicitar datos de paciente, prueba y laboratorio desde la consola
const paciente = solicitarDatosPaciente();
const prueba = solicitarDatosPrueba();
const laboratorio = solicitarDatosLaboratorio();

// Agregar la prueba al laboratorio
laboratorio.agregarPrueba(prueba);

// Presentar los datos ingresados
console.log("\nDatos del paciente:", paciente);
console.log("Datos de la prueba:", prueba);
console.log("Datos del laboratorio:", laboratorio);
