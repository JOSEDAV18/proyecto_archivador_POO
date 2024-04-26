const readlineSync = require('readline-sync');

// Definición de la clase Cliente
class Cliente {
    constructor(nombre, edad, genero, afiliacion, nivelSisben, ingresos) {
        this.nombre = nombre;
        this.edad = edad;
        this.genero = genero;
        this.afiliacion = afiliacion;
        this.nivelSisben = nivelSisben;
        this.ingresos = ingresos;
    }
}

// Definición de la clase PruebaLaboratorio
class PruebaLaboratorio {
    constructor(nombre, tipo, valor, descuento) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.valor = valor;
        this.descuento = descuento;
    }
}

// Definición de la clase Laboratorio
class Laboratorio {
    constructor(nombre) {
        this.nombre = nombre;
        this.pruebas = [];
    }

    agregarPrueba(prueba) {
        this.pruebas.push(prueba);
    }
}

// Función para calcular el descuento según el nivel de Sisbén
function calcularDescuentoSisben(valor, nivelSisben) {
    return valor * (nivelSisben === 'A' ? 0.1 : nivelSisben === 'B1' ? 0.05 : nivelSisben === 'B2' ? 0.02 : 0);
}

// Función para calcular el costo adicional por régimen contributivo
function calcularCostoAdicional(ingresos, valor) {
    const salarioMinimo = 1300000; // Valor del salario mínimo en Colombia para el año 2024
    const salarioMinimoMultiplo = Math.floor(ingresos / salarioMinimo);
    return salarioMinimoMultiplo > 3 ? (salarioMinimoMultiplo - 3) * (valor * 0.1) : 0;
}

// Función principal
function main() {
    let clientes = [];
    let laboratorios = [];

    // Bucle para ingresar clientes
    while (true) {
        console.log("\n--- Ingrese los datos del cliente ---");

        const nombre = readlineSync.question("Nombre: ");
        const edad = readlineSync.questionInt("Edad: ");
        const genero = readlineSync.question("Género (Femenino/Masculino/Otro): ").toLowerCase();
        const afiliacion = readlineSync.question("Afiliación (Contributivo/Subsidiado): ").toLowerCase();
        const nivelSisben = readlineSync.question("Nivel de Sisbén (A/B1/B2): ").toUpperCase();
        const ingresos = readlineSync.questionFloat("Ingresos mensuales: ");

        const cliente = new Cliente(nombre, edad, genero, afiliacion, nivelSisben, ingresos);
        clientes.push(cliente);

        const deseaAgregarMas = readlineSync.keyInYNStrict("¿Desea agregar otro cliente?");

        if (!deseaAgregarMas) {
            break;
        }
    }

    // Crear laboratorio
    const laboratorio = new Laboratorio("Laboratorio Central");

    // Agregar pruebas al laboratorio
    const pruebas = [
        new PruebaLaboratorio("Hemograma", "Sangre", 50000, true),
        new PruebaLaboratorio("Audiometría", "Oídos", 60000, false),
        new PruebaLaboratorio("Radiografía", "Rayos X", 70000, false),
        new PruebaLaboratorio("Electrocardiograma", "Corazón", 80000, true),
        new PruebaLaboratorio("Espirografía", "Respiratorio", 90000, true)
    ];

    for (const prueba of pruebas) {
        laboratorio.agregarPrueba(prueba);
    }

    laboratorios.push(laboratorio);

    // Calcular ingresos totales
    let ingresosTotales = 0;

    // Calcular ingresos según el régimen
    let ingresosContributivo = 0;
    let ingresosSubsidiado = 0;

    // Calcular descuentos totales
    let descuentosSisben = 0;

    // Calcular tipo de prueba que genera mayores ingresos
    let tipoPruebaMayorIngreso = "";
    let mayorIngreso = 0;

    // Calcular promedio de ingresos por laboratorio
    let sumaIngresosLaboratorios = 0;

    for (const cliente of clientes) {
        for (const laboratorio of laboratorios) {
            console.log(`\n--- Cliente: ${cliente.nombre} - Laboratorio: ${laboratorio.nombre} ---`);
            for (let i = 0; i < laboratorio.pruebas.length; i++) {
                const prueba = laboratorio.pruebas[i];
                console.log(`${i + 1}. ${prueba.nombre} (${prueba.tipo}) - Valor: $${prueba.valor.toFixed(2)}`);
            }

            const opcionPrueba = readlineSync.keyInSelect(laboratorio.pruebas.map(prueba => prueba.nombre), "Elija una prueba: ");
            if (opcionPrueba !== -1) {
                const valorPrueba = readlineSync.questionFloat("Ingrese el valor de la prueba: ");
                let costoPrueba = valorPrueba;

                const descuento = cliente.afiliacion === 'subsidiado' ? calcularDescuentoSisben(valorPrueba, cliente.nivelSisben) : 0;
                descuentosSisben += descuento;

                if (cliente.afiliacion === 'contributivo') {
                    costoPrueba += calcularCostoAdicional(cliente.ingresos, valorPrueba);
                }

                ingresosTotales += costoPrueba;

                if (cliente.afiliacion === 'contributivo') {
                    ingresosContributivo += costoPrueba;
                } else {
                    ingresosSubsidiado += costoPrueba;
                }

                sumaIngresosLaboratorios += costoPrueba;

                if (costoPrueba > mayorIngreso) {
                    mayorIngreso = costoPrueba;
                    tipoPruebaMayorIngreso = laboratorio.pruebas[opcionPrueba].tipo;
                }
            }
        }
    }

    const promedioIngresosLaboratorios = sumaIngresosLaboratorios / laboratorios.length;

    console.log("\n--- Resultados ---");
    console.log("Ingresos totales por pruebas de laboratorio: $" + ingresosTotales.toFixed(2));
    console.log("Ingresos totales según el régimen contributivo: $" + ingresosContributivo.toFixed(2));
    console.log("Ingresos totales según el régimen subsidiado: $" + ingresosSubsidiado.toFixed(2));
    console.log("Tipo de prueba que genera mayores ingresos: " + tipoPruebaMayorIngreso);
    console.log("Total de descuentos brindados según el Sisbén: $" + descuentosSisben.toFixed(2));
    console.log("Promedio de ingresos por laboratorio: $" + promedioIngresosLaboratorios.toFixed(2));
}

// Función para mostrar el menú
function mostrarMenu() {
    console.log("\n--- Menú ---");
    console.log("1. Ingresar datos de clientes");
    console.log("2. Mostrar resultados");
    console.log("3. Salir");
}

// Función principal
function ejecutarPrograma() {
    let continuar = true;

    while (continuar) {
        mostrarMenu();

        const opcion = readlineSync.questionInt("Seleccione una opción: ");

        switch (opcion) {
            case 1:
                main();
                break;
            case 2:
                // No hacer nada, ya que la opción 2 mostrará automáticamente los resultados después de ingresar los datos
                break;
            case 3:
                continuar = false;
                console.log("¡Hasta luego!");
                break;
            default:
                console.log("Opción no válida. Por favor, seleccione una opción válida.");
                break;
        }
    }
}

// Ejecutar el programa
ejecutarPrograma();
