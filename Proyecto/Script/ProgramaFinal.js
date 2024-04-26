const readline = require('readline-sync');

// Definición de la clase Persona con atributos nombre, edad y genero
class Persona {
    constructor(nombre, edad, genero) {
        this.nombre = nombre;
        this.edad = edad;
        this.genero = genero;
    }
}

// Definición de la clase Prueba con atributos tipo, costo y personas
class Prueba {
    constructor(tipo, costo) {
        this.tipo = tipo;
        this.costo = costo;
        this.personas = [];
    }

    // Método para agregar una persona a la lista de personas de la prueba
    agregarPersona(persona) {
        this.personas.push(persona);
    }

    // Método para calcular el costo total de la prueba considerando los descuentos
    calcularCostoTotal() {
        let costoTotal = 0;
        for (let persona of this.personas) {
            let descuento = this.calcularDescuento(persona);
            costoTotal += this.costo - descuento;
        }
        return costoTotal;
    }

    // Método privado para calcular el descuento para una persona
    calcularDescuento(persona) {
        let descuento = 0;

        // Lógica de descuento por nivel de Sisben y régimen contributivo
        if (persona.nivelSisben) {
            switch (persona.nivelSisben) {
                case 'A':
                    descuento = this.costo * 0.10;
                    break;
                case 'B1':
                    descuento = this.costo * 0.05;
                    break;
                case 'B2':
                    descuento = this.costo * 0.02;
                    break;
            }
        }

        if (persona.regimen === 'contributivo' && persona.ingreso > 3 * 1300000) { // Salario mínimo en Colombia para 2024 1.300.000
            let salarioAdicional = (persona.ingreso - 3 * 1300000) / 1300000;
            descuento += this.costo * (0.10 * salarioAdicional);
        }

        return descuento;
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
    calcularIngresos() {
        let ingresos = 0;
        for (let prueba of this.pruebas) {
            ingresos += prueba.calcularCostoTotal();
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
    calcularIngresosTotales() {
        let ingresosTotales = 0;
        let ingresosPorRegimen = { contributivo: 0, subsidiado: 0 };
        let descuentosPorSisben = 0;
        let ingresosPorTipoExamen = {};

        for (let laboratorio of this.laboratorios) {
            ingresosTotales += laboratorio.calcularIngresos();

            for (let prueba of laboratorio.pruebas) {
                for (let persona of prueba.personas) {
                    if (persona.regimen === 'subsidiado') {
                        ingresosPorRegimen.subsidiado += prueba.costo;
                    } else {
                        ingresosPorRegimen.contributivo += prueba.costo;
                    }

                    descuentosPorSisben += prueba.calcularDescuento(persona);
                }

                ingresosPorTipoExamen[prueba.tipo] = (ingresosPorTipoExamen[prueba.tipo] || 0) + prueba.calcularCostoTotal();
            }
        }

        let promedioIngresosLaboratorio = ingresosTotales / this.laboratorios.length;

        let laboratoriosPorDebajo = [];
        let laboratoriosPorEncima = [];
        for (let laboratorio of this.laboratorios) {
            let ingresosLaboratorio = laboratorio.calcularIngresos();
            if (ingresosLaboratorio < promedioIngresosLaboratorio) {
                laboratoriosPorDebajo.push(laboratorio.nombre);
            } else {
                laboratoriosPorEncima.push(laboratorio.nombre);
            }
        }

        return {
            ingresosTotales,
            ingresosPorRegimen,
            tipoExamenMasRentable: this.obtenerTipoExamenMasRentable(ingresosPorTipoExamen),
            descuentosPorSisben,
            promedioIngresosLaboratorio,
            laboratoriosPorDebajo,
            laboratoriosPorEncima
        };
    }

    // Método para obtener el tipo de examen más rentable
    obtenerTipoExamenMasRentable(ingresosPorTipoExamen) {
        let tipoExamenMasRentable = null;
        let ingresosMasAltos = 0;
        for (let tipoExamen in ingresosPorTipoExamen) {
            if (ingresosPorTipoExamen[tipoExamen] > ingresosMasAltos) {
                ingresosMasAltos = ingresosPorTipoExamen[tipoExamen];
                tipoExamenMasRentable = tipoExamen;
            }
        }
        return tipoExamenMasRentable;
    }
}

// Funciones auxiliares para obtener datos
function obtenerGenero(opcionGenero) {
    switch (opcionGenero) {
        case '1':
            return 'Masculino';
        case '2':
            return 'Femenino';
        default:
            return '';
    }
}

function obtenerRegimen(opcionRegimen) {
    switch (opcionRegimen) {
        case '1':
            return 'subsidiado';
        case '2':
            return 'contributivo';
        default:
            return '';
    }
}

function obtenerNivelSisben(opcionNivelSisben) {
    switch (opcionNivelSisben.toUpperCase()) {
        case 'A':
            return 'A';
        case 'B1':
            return 'B1';
        case 'B2':
            return 'B2';
        default:
            return null;
    }
}

function obtenerTipoPrueba(opcionPrueba) {
    switch (opcionPrueba) {
        case '1':
            return 'Sangre';
        case '2':
            return 'Orina';
        case '3':
            return 'Heces';
        case '4':
            return 'Tejido';
        case '5':
            return 'Secreciones';
        case '6':
            return 'Líquido cefalorraquídeo';
        case '7':
            return 'Líquido sinovial';
        case '8':
            return 'Biopsias';
        case '9':
            return 'Saliva';
        case '10':
            return 'Lágrimas';
        case '11':
            return 'Líquido amniótico';
        case '12':
            return 'Esputo';
        default:
            return '';
    }
}

// Función principal
function main() {
    let farmaceutica = new Farmaceutica();
    let seguir = true;

    while (seguir) {
        let nombreLaboratorio = readline.question('Nombre del laboratorio: ');
        let laboratorio = new Laboratorio(nombreLaboratorio);
        farmaceutica.agregarLaboratorio(laboratorio);

        let agregarPrueba = true;
        while (agregarPrueba) {
            console.log('Seleccione el tipo de prueba:');
            console.log('1. Sangre');
            console.log('2. Orina');
            console.log('3. Heces');
            console.log('4. Tejido');
            console.log('5. Secreciones');
            console.log('6. Líquido cefalorraquídeo');
            console.log('7. Líquido sinovial');
            console.log('8. Biopsias');
            console.log('9. Saliva');
            console.log('10. Lágrimas');
            console.log('11. Líquido amniótico');
            console.log('12. Esputo');
            let opcionPrueba = readline.question('Ingrese el número de la prueba: ');
            let tipoPrueba = obtenerTipoPrueba(opcionPrueba);

            let costoPrueba = parseFloat(readline.question('Costo de la prueba: '));
            let prueba = new Prueba(tipoPrueba, costoPrueba);
            laboratorio.agregarPrueba(prueba);

            let agregarPersona = true;
            while (agregarPersona) {
                let nombrePersona = readline.question('Nombre de la persona: ');
                let edadPersona = parseInt(readline.question('Edad de la persona: '));
                console.log('Género:');
                console.log('1. Masculino');
                console.log('2. Femenino');
                let opcionGenero = readline.question('Seleccione el género (1/2): ');
                let generoPersona = obtenerGenero(opcionGenero);

                console.log('Régimen:');
                console.log('1. Subsidiado');
                console.log('2. Contributivo');
                let opcionRegimen = readline.question('Seleccione el régimen (1/2): ');
                let regimenPersona = obtenerRegimen(opcionRegimen);

                let ingresoPersona = null;
                let nivelSisben = null;

                if (regimenPersona === 'contributivo') {
                    ingresoPersona = parseFloat(readline.question('Ingreso mensual de la persona: '));
                } else {
                    console.log('Nivel Sisben:');
                    console.log('A. Nivel A');
                    console.log('B1. Nivel B1');
                    console.log('B2. Nivel B2');
                    let opcionNivelSisben = readline.question('Seleccione el nivel de Sisben (A/B1/B2): ');
                    nivelSisben = obtenerNivelSisben(opcionNivelSisben);
                }

                let persona = new Persona(nombrePersona, edadPersona, generoPersona);
                persona.regimen = regimenPersona;
                persona.ingreso = ingresoPersona;
                persona.nivelSisben = nivelSisben;
                prueba.agregarPersona(persona);

                agregarPersona = readline.question('¿Agregar otra persona a esta prueba? (s/n): ').toLowerCase() === 's';
            }

            agregarPrueba = readline.question('¿Agregar otra prueba al laboratorio? (s/n): ').toLowerCase() === 's';
        }

        seguir = readline.question('¿Agregar otro laboratorio? (s/n): ').toLowerCase() === 's';
    }

    let resultados = farmaceutica.calcularIngresosTotales();
    console.log('1. Ingresos totales por concepto de pruebas de laboratorio: $', resultados.ingresosTotales.toFixed(2));
    console.log('2. Ingresos totales por régimen:');
    console.log('   - Contributivo: $', resultados.ingresosPorRegimen.contributivo.toFixed(2));
    console.log('   - Subsidiado: $', resultados.ingresosPorRegimen.subsidiado.toFixed(2));
    console.log('3. Tipo de examen más rentable:', resultados.tipoExamenMasRentable);
    console.log('4. Total de descuentos brindados según el Sisben: $', resultados.descuentosPorSisben.toFixed(2));
    console.log('5. Promedio de ingresos por laboratorio: $', resultados.promedioIngresosLaboratorio.toFixed(2));
    console.log('6. Laboratorios por debajo del promedio:', resultados.laboratoriosPorDebajo);
    console.log('7. Laboratorios por encima del promedio:', resultados.laboratoriosPorEncima);
}

main();
