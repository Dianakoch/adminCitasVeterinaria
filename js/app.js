//selectores para los elementos del DOM
const pacienteInput = document.querySelector('#paciente');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const formularioInput = document.querySelector('#nueva-cita input[type="submit"]');
const contenedorCitas = document.querySelector('#citas');

//añadimos event listeners para los inputs y el formulario

pacienteInput.addEventListener('change', datosCita);
telefonoInput.addEventListener('change', datosCita);
fechaInput.addEventListener('change', datosCita);
horaInput.addEventListener('change', datosCita);
sintomasInput.addEventListener('change', datosCita);

formulario.addEventListener('submit', nuevaCita);

// estamos editando o creando una nueva cita
let editando;

//objeto con la informacion de la cita
const objCita = {
    id : generarId(), //este id se genera al crear el objeto
    paciente : '',
    telefono : '',
    fecha : '',
    hora : '',
    sintomas : ''
}

//falta clase para notificaciones
class Notificacion {
    constructor({texto, tipo}){
        this.texto = texto;
        this.tipo = tipo;

        this.mostrar()
    }
    mostrar(){
        //crerar el div
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //eliminar alerta previa
        const alertaPrevia = document.querySelector('.alert');
        if(alertaPrevia){
            alertaPrevia.remove();
        }
        //agregar clase segun el tipo
        this.tipo === 'error' ? divAlerta.classList.add('alert-danger') : divAlerta.classList.add('alert-success');

        divAlerta.textContent = this.texto;

        //agregar al DOM
        formulario.parentElement.insertBefore(divAlerta, formulario);

        //eliminar la alerta despues de 3 segundos
        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }
}


//clase para administrar las citas
class AdmnistrarCitas {
    constructor() {
        this.citas = [];
    }

    //agrega una nueva cita
    agregarCita(cita){
        this.citas = [...this.citas, cita]; //spread operator para agregar la cita al arreglo
        console.log(this.citas);
        this.mostrarCitas();
    }
    //edita una cita
    editarCita(citaEditada){
        this.citas = this.citas.map( cita => cita.id === citaEditada.id ? citaEditada : cita);
        this.mostrarCitas();
    }

    //elimina una cita por su id
    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
        this.mostrarCitas();
    }

    //muestra las citas
    mostrarCitas(){
        //limpiar el html previo
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }

        if(this.citas.length === 0){
            contenedorCitas.innerHTML = `<p class="text-center">No hay citas por mostrar</p>`;
            return;
        }

        //iterar sobre el arreglo de citas
        this.citas.forEach( cita => {
            const divCita = document.createElement('div');
            divCita.classList.add('p-3');

            const paciente = document.createElement('P');
            paciente.classList.add('font-weight-bold');
            paciente.innerHTML = `Paciente: <span class="font-weight-normal">${cita.paciente}</span>`;

            const telefono = document.createElement('P');
            telefono.classList.add('font-weight-bold');
            telefono.innerHTML = `Teléfono: <span class="font-weight-normal">${cita.telefono}</span>`;

            const fecha = document.createElement('P');
            fecha.classList.add('font-weight-bold');
            fecha.innerHTML = `Fecha: <span class="font-weight-normal">${cita.fecha}</span>`;

            const hora = document.createElement('P');
            hora.classList.add('font-weight-bold');
            hora.innerHTML = `Hora: <span class="font-weight-normal">${cita.hora}</span>`;
            
            const sintomas = document.createElement('P');
            sintomas.classList.add('font-weight-bold');
            sintomas.innerHTML = `Síntomas: <span class="font-weight-normal">${cita.sintomas}</span>`;

            //boton para eliminar la cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'btn-eliminar' ,'mr-2');
            btnEliminar.innerHTML = 'Eliminar';
            btnEliminar.onclick = () => this.eliminarCita(cita.id);

            //boton para editar la cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info', 'btn-editar' ,'mr-2');
            btnEditar.innerHTML = 'Editar';

            const clone = structuredClone(cita);
            btnEditar.onclick = () => cargarEdicion(clone);

            //creamos contenedor para los botones
            const divBotones = document.createElement('div');
            divBotones.classList.add('d-flex', 'justify-content-end');
            divBotones.appendChild(btnEliminar);
            divBotones.appendChild(btnEditar);

            //agregamos al html
            divCita.appendChild(paciente);
            divCita.appendChild(telefono);
            divCita.appendChild(fecha);
            divCita.appendChild(hora);
            divCita.appendChild(sintomas);
            divCita.appendChild(divBotones);


            contenedorCitas.appendChild(divCita);
            
        })
    }

}

function datosCita(e){
    objCita[e.target.name] = e.target.value; //asigna los valores al objeto
}

const citas = new AdmnistrarCitas();

function nuevaCita(e){
    e.preventDefault();

    if(Object.values(objCita).some(valor => valor.trim() === '')){
        new Notificacion({texto: 'Todos los campos son obligatorios', tipo: 'error'});
        return;
    }
    if(editando){
        citas.editarCita({...objCita});
        new Notificacion({texto: 'Editado correctamente', tipo: 'exito'});
    }else{
        citas.agregarCita({...objCita}); //pasamos una copia del objeto
        new Notificacion({texto: 'Se agregó correctamente', tipo: 'exito'});
    }

    //reiniciar el formulario
    formulario.reset();
    reiniciarObjeto();
    formularioInput.value = 'Crear Cita';
    editando = false;

}

function reiniciarObjeto(){
    Object.assign(objCita, {
        id : generarId(), //este id se genera al crear el objeto
        paciente : '',
        telefono : '',
        fecha : '',
        hora : '',
        sintomas : ''
    });
}

function generarId(){
        return Math.random().toString(36).substring(2) + Date.now();
}

function cargarEdicion(cita){
    Object.assign(objCita, cita);

    //llenar los inputs del formulario
    pacienteInput.value = objCita.paciente;
    telefonoInput.value = objCita.telefono;
    fechaInput.value = objCita.fecha;
    horaInput.value = objCita.hora;
    sintomasInput.value = objCita.sintomas;
    editando = true;
    formularioInput.value = 'Guardar Cambios';
    
}
