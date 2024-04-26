const readlineSync = require('readline-sync');
class Programa {
    nombre = '';
    costo = 0;
}

const objSistemas = new Programa();
objSistemas.nombre = 'Ingenieria de Sistemas';
objSistemas.costo = 1000000;

const objPsicologia = new Programa();
objPsicologia.nombre = 'Psicologia';
objPsicologia.costo = 2000000;

const objDerecho = new Programa();
objDerecho.nombre = 'Derecho';
objDerecho.costo = 3000000;

class Estudiante {
    //Atributos
    nombre = '';
    genero = '';  //f=femenino, m=masculino
    #edad = 0; //Volvimos este atributo privado para que nadie lo modifique
    //entonces como hago para modificarlo?. hago dos metodos, uno para escribir
    //set y otro para leer get

    programa = null; //Es un objeto de tipo Programa

    set edad(nuevaEdad){
        if(nuevaEdad < 0){
            throw new Error(`La edad no puede ser negativa`);
        }
        this.#edad = nuevaEdad;
    }

    get edad() {
        return this.#edad;
    }

    constructor(nombre, genero, edad){
        if(nombre == undefined){
            throw new Error('El estudiante debe tener nombre');
        }
        this.nombre = nombre;
        this.genero = genero;
        this.#edad = edad;
    }

    //Metodos
    compararEdad(otroEstudiante){
        if(this.#edad > otroEstudiante.#edad){
            console.info(`Entre el estudiante ${otroEstudiante.nombre} y ${this.nombre}, el mayor es ${this.nombre}`);
        }
        else if(this.#edad == otroEstudiante.#edad) {
            console.info(`Entre el estudiante ${otroEstudiante.nombre} y ${this.nombre}, las edades son iguales`);
        }
        else {
            console.info(`Entre el estudiante ${otroEstudiante.nombre} y ${this.nombre}, el mayor es ${otroEstudiante.nombre}`);
        }
    }

    matricular(dineroParaLaMatricula){
        console.info(`---------- Hola ${this.nombre} tienes ${dineroParaLaMatricula} para matricularte ----------`);
        const programa = readlineSync.question(`Programa al que se quiere matricular Sistemas(s)[${objSistemas.costo}] - Psicologia(p)[${objPsicologia.costo}] - Derecho(d)[${objDerecho.costo}]: `);
        let programaAlQueSeQuiereMatricular = objSistemas;
        if(programa == 'p'){
            programaAlQueSeQuiereMatricular = objPsicologia;
        }
        else if(programa == 'd'){
            programaAlQueSeQuiereMatricular = objDerecho;
        }

        if(dineroParaLaMatricula >= programaAlQueSeQuiereMatricular.costo){
            this.programa = programaAlQueSeQuiereMatricular;
            console.info(`El estudiante ${this.nombre} se ha matriculado al programa ${programaAlQueSeQuiereMatricular.nombre} con exito!!`);
        }
        else {
            console.error(`El estudiante ${this.nombre} no se puede matricular al programa ${programaAlQueSeQuiereMatricular.nombre}`);
        }
    }
}

let est1 = new Estudiante('Pepito', 'm', 35);


//Problema: los atributos no estan protegidos/encapsulados
//Solucion: el encapsulamiento sirve para que no modifiquen los datos 
//a la loca
//est1.edad = -36;

let est2 = new Estudiante('Natalia', 'f', 35);
let est3 = new Estudiante('Carlos', 'm', 25);

//1. Cual es el estudiante de mayor edad

est1.compararEdad(est2);
est3.compararEdad(est1);

/*
est1.matricular(170);
est2.matricular(500);
*/

//Nuevo requerimiento:
/*
La universidad ha implementado un plan de subsidios para los estudiantes que funciona asi:

- Los estudiantes de jornada diurna tienen un subsidio de 100.000 mil pesos sobre el valor de la matricula
- Los estudiantes de jornada nocturna tienen un subsidio de 20% mil pesos sobre el valor de la matricula

 */

//Herencia: EstudianteDeJornada hereda de Estudiante
//se heredan tanto los atributos, metodos, constructor, encapsulamiento, etc.
class EstudianteDeJornada extends Estudiante {
    jornada = 0; //0: diurna, 1:nocturna

    constructor(nombre, genero, edad, jornada){
        super(nombre, genero, edad);
        this.jornada = jornada;
    }

    aplicarSubsidio(){
        if(this.programa == null){
            throw new Error('El estudiante no tiene programa');
        }
    }
}

class EstudianteDeJornadaDiurna extends EstudianteDeJornada {
    constructor(nombre, genero, edad){
        super(nombre, genero, edad, 0);
    }

    aplicarSubsidio(){
        super.aplicarSubsidio();

        const obj = this;
        console.info({obj});

        const costoMatricula = this.programa.costo - 100000;
        return costoMatricula;
    }
}

class EstudianteDeJornadaNocturna extends EstudianteDeJornada {
    constructor(nombre, genero, edad){
        super(nombre, genero, edad, 1);
    }

    aplicarSubsidio(){
        super.aplicarSubsidio();
        const costoMatricula = this.programa.costo - (this.programa.costo * 0.2);
        return costoMatricula;
    }
}

//Se crea una lista de Estudiantes de jornada
const estudianteDiurnoSistemas = new EstudianteDeJornadaDiurna('Miguel de Dia', 'm', 25);
const estudianteNocturnoSistemas = new EstudianteDeJornadaNocturna('Miguel De Noche', 'm', 25);

estudianteDiurnoSistemas.matricular(1000000);
estudianteNocturnoSistemas.matricular(1000000);

const listaEstudiantesJornada = [];
//Agregar estudiantes a la lista

listaEstudiantesJornada.push(estudianteDiurnoSistemas);
listaEstudiantesJornada.push(estudianteNocturnoSistemas);

//1. Aplicar subsidios
for(let i=0; i<listaEstudiantesJornada.length; i++){
    const costoMatricula = listaEstudiantesJornada[i].aplicarSubsidio();
    console.info(`El costo de la matricula para el estudiante ${listaEstudiantesJornada[i].nombre} es: ${costoMatricula}`);
}