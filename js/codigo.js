document.addEventListener('DOMContentLoaded', function() {
    // Inicio de sesión
    const formularioLogin = document.getElementById('formulario-login');
    const mensajeError = document.getElementById('mensaje');

    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function(event) {
            event.preventDefault();
            iniciarSesion();
        });
    }

    function iniciarSesion() {
        const usuario = document.getElementById('usuario').value;
        const contraseña = document.getElementById('contraseña').value;

        fetch('js/usuarios.json')
            .then(response => response.json())
            .then(data => {
                const usuarioValido = data.find(user => user.usuario === usuario && user.contraseña === contraseña);
                if (usuarioValido) {
                    window.location.href = 'pages/tareas.html';
                } else {
                    mensajeError.textContent = 'Usuario o contraseña incorrectos';
                }
            })
            .catch(error => console.error('Error al cargar el archivo JSON:', error));
    }

    // Gestión de tareas
    const formularioTarea = document.getElementById('formulario-tarea');
    const listaTareas = document.getElementById('lista-tareas');
    let tareas = [];

    cargarTareas();

    if (formularioTarea) {
        formularioTarea.addEventListener('submit', function(event) {
            event.preventDefault();
            agregarTarea();
        });
    }

    function agregarTarea() {
        const titulo = document.getElementById('titulo-tarea').value;
        const descripcion = document.getElementById('descripcion-tarea').value;
        const estado = document.getElementById('estado-tarea').value;
        const fechaCreacion = new Date().toLocaleString();

        const tarea = {
            titulo,
            descripcion,
            estado,
            fechaCreacion
        };

        tareas.push(tarea);

        guardarTareas();
        mostrarTareas();

        Swal.fire({
            title: 'Tarea agregada',
            text: 'La tarea ha sido agregada correctamente.',
            icon: 'success'
        });

        formularioTarea.reset();
    }

    function mostrarTareas() {
        listaTareas.innerHTML = '';

        tareas.forEach(function(tarea, index) {
            const li = document.createElement('li');
            li.innerHTML = `
                <h3>${tarea.titulo}</h3>
                <p>${tarea.descripcion}</p>
                <p>Estado: ${tarea.estado}</p>
                <p>Fecha de creación: ${tarea.fechaCreacion}</p>
                <button class="btn_editar" onclick="editarTarea(${index})">Editar</button>
                <button class="btn_eliminar" onclick="confirmarEliminarTarea(${index})">Eliminar</button>
            `;
            listaTareas.appendChild(li);
        });
    }

    window.editarTarea = function(index) {
        const tarea = tareas[index];
        document.getElementById('titulo-tarea').value = tarea.titulo;
        document.getElementById('descripcion-tarea').value = tarea.descripcion;
        document.getElementById('estado-tarea').value = tarea.estado;

        tareas.splice(index, 1);
        guardarTareas();
        mostrarTareas();
        window.scrollTo(0, 0);
    };

    window.confirmarEliminarTarea = function(index) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la tarea permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar tarea',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTarea(index);
            }
        });
    };

    window.eliminarTarea = function(index) {
        tareas.splice(index, 1);
        
        guardarTareas();

        Swal.fire({
            title: 'Tarea eliminada',
            text: 'La tarea ha sido eliminada correctamente.',
            icon: 'success'
        });

        mostrarTareas();
    };

    function guardarTareas() {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    function cargarTareas() {
        const tareasGuardadas = localStorage.getItem('tareas');
        if (tareasGuardadas) {
            tareas = JSON.parse(tareasGuardadas);
            mostrarTareas();
        }
    }

    // Funcionalidad para el botón "salir"
    const botonSalir = document.getElementById('salir');

    if (botonSalir) {
        botonSalir.addEventListener('click', function(event) {
            event.preventDefault();
            cerrarSesion();
        });
    }

    function cerrarSesion() {
        // Eliminar información de inicio de sesión (esto es solo un ejemplo, puedes ajustarlo según cómo estés manejando el inicio de sesión)
        localStorage.removeItem('usuario');
        localStorage.removeItem('contraseña');

        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = '../index.html'; // Asegúrate de ajustar la URL si tu página de inicio de sesión tiene otro nombre o ubicación
    }
});
