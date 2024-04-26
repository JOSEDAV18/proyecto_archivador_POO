const readline = require('readline-sync');

// Definición de la clase Persona con atributos nombre, edad y genero
class Persona {
    constructor(nombre, edad, genero) {
        this.nombre = nombre;
        this.edad = edad;
        this.genero = genero;
    }
}

// Definición de la clase Prueba con atributos nombre, costo y personas
class Prueba {
    constructor(nombre, costo) {
        this.nombre = nombre;
        this.costo = costo;
        this.personas = [];
    }

    // Método para agregar una persona a la lista de personas de la prueba
    agregarPersona(persona) {
        this.personas.push(persona);
    }

    // Método para calcular el costo total de la prueba considerando los descuentos
    calcularCostoTotal(descuento) {
        let costoTotal = 0;
        for (let persona of this.personas) {
            costoTotal += this.costo - (descuento || 0);
        }
        return costoTotal;
    }
}

// Definición de la clase Laboratorio con atributos nombre y pruebas
class Laboratorio {
    constructor(nombre) {
        this.nombre = nombre;
        this.pruebas = [];
    }

    // Método para agregar una prueba al laboratorio
    agregarPrueba(prueba) {
        this.pruebas.push(prueba);
    }

    // Método para calcular los ingresos totales del laboratorio
    calcularIngresos(descuento) {
        let ingresos = 0;
        for (let prueba of this.pruebas) {
            ingresos += prueba.calcularCostoTotal(descuento);
        }
        return ingresos;
    }
}

// Definición de la clase Farmaceutica
class Farmaceutica {
    constructor() {
        this.laboratorios = [];
    }

    // Método para agregar un laboratorio a la farmacéutica
    agregarLaboratorio(laboratorio) {
        this.laboratorios.push(laboratorio);
    }

    // Método para calcular los ingresos totales de la farmacéutica
    calcularIngresosTotales(descuento) {
        let ingresosTotales = 0;

        for (let laboratorio of this.laboratorios) {
            ingresosTotales += laboratorio.calcularIngresos(descuento);
        }

        return ingresosTotales;
    }
}

// Función para obtener el descuento según el régimen y nivel de Sisben
function obtenerDescuento(regimen, nivelSisben) {
    if (regimen === 'subsidiado') {
        switch (nivelSisben) {
            case 'A':
                return 0.10;
            case 'B1':
                return 0.05;
            case 'B2':
                return 0.02;
            default:
                return 0;
        }
    } else {
        return 0;
    }
}

// Función principal
function main() {
    let farmaceutica = new Farmaceutica();
    let descuento = 0;

    console.log('¿Cuál es el régimen de la prueba? (subsidiado / contributivo): ');
    let regimen = readline.question().toLowerCase();

    if (regimen === 'subsidiado') {
        console.log('¿Cuál es el nivel de Sisben? (A / B1 / B2): ');
        let nivelSisben = readline.question().toUpperCase();
        descuento = obtenerDescuento(regimen, nivelSisben);
    }

    let seguir = true;

    while (seguir) {
        let nombreLaboratorio = readline.question('Nombre del laboratorio: ');
        let laboratorio = new Laboratorio(nombreLaboratorio);
        farmaceutica.agregarLaboratorio(laboratorio);

        let agregarPrueba = true;
        while (agregarPrueba) {
            let nombrePrueba = readline.question('Nombre de la prueba: ');
            let costoPrueba = parseFloat(readline.question('Costo de la prueba: '));
            let prueba = new Prueba(nombrePrueba, costoPrueba);
            laboratorio.agregarPrueba(prueba);

            agregarPrueba = readline.question('¿Agregar otra prueba al laboratorio? (s/n): ').toLowerCase() === 's';
        }

        seguir = readline.question('¿Agregar otro laboratorio? (s/n): ').toLowerCase() === 's';
    }

    let resultados = farmaceutica.calcularIngresosTotales(descuento);
    console.log('Ingresos totales: $', resultados.toFixed(2));
}

main();
