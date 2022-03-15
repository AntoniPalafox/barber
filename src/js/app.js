let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora:'',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    // Resalta el DIV Actual
    mostrarSeccion();

    //Oculta o muestra una seccion
    cambiarSeccion();

    //Paginacion Siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //Comprueba la pagina actual para ocultar/mostrar los botones de paginacion
    botonesPaginador();
    
    //Muestra el resumer de la cita o mostrar error
    mostrarResumen();

    //almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha en el objeto
    fechaCita();

    //deshabilita fechas pasadas
    desabilitarFechaAnterior();

    //Almacenar la hora
    horaCita();
}

function mostrarSeccion(){
    
    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion')
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar clase actual para resaltar el tab actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //Resalta la seccion (Tab) actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            botonesPaginador(); 
        });
    } );
}


async function mostrarServicios(){
    try{
        const resultado = await fetch('../../servicios.json');
        const db = await resultado.json();

        const {servicios} = db;

        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio;

            // DOM Scripting
            // Nombre servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Precio servicio
            const precioServicio = document.createElement('P');
            precioServicio.innerHTML = `&dollar; ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //div para agrupar nombre y precio de servicios
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectar en el html
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    }catch (error){
        console.log(error);
    }
}

function seleccionarServicio(e){
    // Forzar que el clic arroje el DIV en vez del parrafo
    let elemento;
    if(e.target.tagName === 'P'){
        elemento =  e.target.parentElement;
    }else{
        elemento = e.target;
    }

    //console.log(elemento.dataset.idServicio) //para visualizar el numero de id

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        //console.log(servicioObj);

        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj){
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        botonesPaginador();
    });

}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(pagina === 2){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); //Mostrar el resumen
    }

    mostrarSeccion();
}

function mostrarResumen(){
    //Destructuring
    const { nombre, fecha, hora, servicios} = cita;

    //Seleccionar Resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpiar todo
    while (resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //validacion de objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos';

        noServicios.classList.add('invalidar-cita');
        const noRepetir = document.querySelector('.invalidar-cita');
        if(noRepetir){
            noRepetir.remove();
        }

        //Mostrar mensaje
        resumenDiv.appendChild(noServicios);

        return;
    }

    //Mostrar el resumen

    const tituloCita = document.createElement('H3');
    tituloCita.textContent = 'Datos de tu cita';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const tituloServicios = document.createElement('H3');
    tituloServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(tituloServicios);

    let cantidad = 0;

    //Iterar sobre el arreglo de servicios
    servicios.forEach( servicio => {
        const {nombre , precio} = servicio
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio'); 

        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());

        //Mostrarlos
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar: </span> &dollar;${cantidad}`

    resumenDiv.appendChild(tituloCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);
    resumenDiv.appendChild(cantidadPagar);

}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim(); //e.target.value va leyendo el texto del input
        //trim elimina los espacios al inicio y al final
        
        //Validacion de que nombreTexto contiene texto
        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no válido', 'error');
        }else{
            //Quitar alerta cuando el nombre ya sea válido
            const alerta =document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            //Agregar el nombre al arreglo de la cita
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo){

    //Solo mostrar una alerta (no duplicar)
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error');
    }

    //Mostrar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {

        const dia = new Date(e.target.value).getUTCDay();

        if([0,6].includes(dia)){
        e.preventDefault();
        fechaInput.value = '';
            mostrarAlerta('Fines de semana no son permitidos', 'error')
        }else{
            cita.fecha = fechaInput.value;
        }
    });
}

function desabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    let mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;

    if (mes < 10){
        mes = `0${mes}`;
    }else{
        mes = mes;
    }

    //Formato deseado AAAA - MM - DD 
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value
        const hora = horaCita.split(':');

        if(hora[0] < 9 || hora [0] > 18){
            mostrarAlerta('Hora no valida', 'error');
            inputHora.value = '';
        }else{
            cita.hora = horaCita;
        }
    });
}