const readlineSync = require('readline-sync');

let cantEmpleados = 0;
let cantEmpleadosIngresados = 0;
let nombre = 0;
let extranjero = 0;
let contadorExtranjeros = 0;
let contadorPersonasGeneroF = 0;
let contadorPersonasGeneroM = 0;
let contadorSubPrim = 0;
let contadorSubSec = 0;
let contadorSubUni = 0;
let subPrimaria = 0;
let subSecundaria = 0;
let subUniversidad = 0;
let zRural = 0;
let zUrbano = 0;
let vuelo1 = 0;
let vuelo2 = 0;
let totalNomina = 0;
let costoHombres = 0;
let costoMujeres = 0;
let empleadoMasCostoso = null;
let costoPasajesExtranjeros = 0;
let totalSubsidioPrimaria = 0;
let totalSubsidioSecundaria = 0;
let totalSubsidioUniversidad = 0;

// Función para ingresar el valor del subsidio para hijos en primaria, secundaria y universidad
function ingresarSubsidioHijos() {
    subPrimaria = +readlineSync.question('Ingrese el valor del subsidio para hijos en primaria: ');
    subSecundaria = +readlineSync.question('Ingrese el valor del subsidio para hijos en secundaria: ');
    subUniversidad = +readlineSync.question('Ingrese el valor del subsidio para hijos en universidad: ');
}

// Función para ingresar datos del empleado
function ingresarEmpleado() {
    console.info(`Cantidad de empleados ingresados: ${cantEmpleadosIngresados + 1} de ${cantEmpleados}`);

    nombre = readlineSync.question('Ingrese el nombre del empleado: ');
    const sexo = readlineSync.question('Ingrese el sexo del empleado (F/M): ');
    if (sexo.toLowerCase() === 'f') {
        contadorPersonasGeneroF++;
    } else if (sexo.toLowerCase() === 'm') {
        contadorPersonasGeneroM++;
    } else {
        console.error('Sexo no válido. Debe ser F o M.');
        return;
    }

    extranjero = readlineSync.keyInYNStrict('¿Es extranjero? ingrese "Y" para si o "N" para no: ');
    if (extranjero) { // Si el empleado es extranjero, pedir el valor de los vuelos
        vuelo1 = +readlineSync.question('Ingrese el valor del primer vuelo: ');
        vuelo2 = +readlineSync.question('Ingrese el valor del segundo vuelo: ');
        contadorExtranjeros++;
    }

    zRural = readlineSync.keyInYNStrict('¿Vive en zona rural? ingrese "Y" para si o "N" para no: ');

    const estrato = +readlineSync.question('Ingrese el estrato del empleado: ');

    const tieneHijos = readlineSync.keyInYNStrict('¿Tiene hijos? ingrese "Y" para si o "N" para no: ');
    let totalSubsidiosHijos = 0; // Variable para almacenar el total de subsidios para hijos
    if (tieneHijos) {
        const cantidadHijos = +readlineSync.question('Ingrese la cantidad de hijos: ');
        for (let i = 0; i < cantidadHijos; i++) {
            const tipoEducacion = readlineSync.keyInSelect(['Primaria', 'Secundaria', 'Universidad'], `Seleccione el tipo de educación para el hijo ${i + 1}:`);
            switch (tipoEducacion) {
                case 0:
                    contadorSubPrim++;
                    totalSubsidiosHijos += subPrimaria; // Sumar el subsidio para hijos en primaria
                    break;
                case 1:
                    contadorSubSec++;
                    totalSubsidiosHijos += subSecundaria; // Sumar el subsidio para hijos en secundaria
                    break;
                case 2:
                    contadorSubUni++;
                    totalSubsidiosHijos += subUniversidad; // Sumar el subsidio para hijos en universidad
                    break;
                default:
                    console.error('Opción no válida.');
                    break;
            }
        }
    }

    const sueldo = +readlineSync.question('Ingrese el sueldo del empleado: ');

    let subsidioEstrato = 0; // Variable para almacenar el subsidio por estrato
    switch (estrato) {
        case 1:
            subsidioEstrato = sueldo * 0.15;
            break;
        case 2:
            subsidioEstrato = sueldo * 0.10;
            break;
        case 3:
            subsidioEstrato = sueldo * 0.05;
            break;
        default:
            subsidioEstrato = 0;
            break;
    }

    let subsidioRural = 0; // Variable para almacenar el subsidio por zona rural
    if (zRural) {
        subsidioRural = 35000;
    }

    let costoTotalEmpleado = sueldo + subsidioEstrato + subsidioRural + totalSubsidiosHijos; // Calcular el costo total del empleado, incluyendo subsidios para hijos
    if (extranjero) {
        costoTotalEmpleado += vuelo1 + vuelo2; // Sumar el costo de los vuelos si el empleado es extranjero
        costoPasajesExtranjeros += vuelo1 + vuelo2; // Sumar al costo total de pasajes para empleados extranjeros
    }

    totalNomina += costoTotalEmpleado; // Sumar al costo total de la nómina
    if (sexo.toLowerCase() === 'f') {
        costoMujeres += costoTotalEmpleado; // Sumar al costo total de la nómina de mujeres
    } else {
        costoHombres += costoTotalEmpleado; // Sumar al costo total de la nómina de hombres
    }

    if (empleadoMasCostoso === null || costoTotalEmpleado > empleadoMasCostoso.costo) {
        empleadoMasCostoso = {
            nombre: nombre,
            costo: costoTotalEmpleado
        };
    }

    // Almacenar los subsidios por tipo de educación
    totalSubsidioPrimaria += contadorSubPrim * subPrimaria;
    totalSubsidioSecundaria += contadorSubSec * subSecundaria;
    totalSubsidioUniversidad += contadorSubUni * subUniversidad;

    cantEmpleadosIngresados++;

    // Mostrar el costo total de la nómina del empleado ingresado
    console.log(`Costo total de la nómina para ${nombre}: ${costoTotalEmpleado}`);
}

// Solicitar valores de subsidio para hijos
ingresarSubsidioHijos();

// Solicitar cantidad de empleados
cantEmpleados = +readlineSync.question('Ingrese la cantidad de empleados: ');
if (isNaN(cantEmpleados)) {
    console.error('La cantidad de empleados debe ser un valor numérico');
} else {
    if (cantEmpleados <= 0) {
        console.error('La cantidad de empleados debe ser mayor que 0');
    } else {
        while (cantEmpleadosIngresados < cantEmpleados) {
            ingresarEmpleado();
        }

        console.info('');

        // Mostrar resultados
        console.log('Costo total de la nómina:', totalNomina);
        console.log('Costo de la nómina de hombres:', costoHombres);
        console.log('Costo de la nómina de mujeres:', costoMujeres);
        console.log('Empleado más costoso:', empleadoMasCostoso.nombre, 'con un costo de:', empleadoMasCostoso.costo);
        console.log('Costo total de subsidios para hijos en primaria:', totalSubsidioPrimaria);
        console.log('Costo total de subsidios para hijos en secundaria:', totalSubsidioSecundaria);
        console.log('Costo total de subsidios para hijos en universidad:', totalSubsidioUniversidad);
        console.log('Costo total de pasajes para empleados extranjeros:', costoPasajesExtranjeros);
    }
}