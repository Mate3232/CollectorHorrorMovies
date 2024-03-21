document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('agregar-pelicula');
    const contenedorPeliculas = document.getElementById('peliculas-container');
    const eliminarButton = document.getElementById('eliminar-button');
    const selectEliminar = document.getElementById('eliminar-pelicula');

    cargarPeliculasDesdeLocalStorage();

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre-pelicula').value;
        const descripcion = document.getElementById('descripcion-pelicula').value;
        const portada = document.getElementById('portada-pelicula').files[0];

        if (nombre.trim() === '' || descripcion.trim() === '' || !portada) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const portadaUrl = event.target.result;
            const pelicula = { nombre, descripcion, portada: portadaUrl, visto: false };
            agregarPelicula(pelicula);
            guardarPeliculaLocalStorage(pelicula);
            actualizarSelectEliminar(pelicula);
        };
        reader.readAsDataURL(portada);

        formulario.reset();
    });

    eliminarButton.addEventListener('click', function() {
        const seleccion = selectEliminar.value;
        if (seleccion) {
            const peliculaSeleccionada = JSON.parse(seleccion);
            eliminarPelicula(peliculaSeleccionada);
            selectEliminar.removeChild(selectEliminar.querySelector(`option[value='${seleccion}']`));
        } else {
            alert('Por favor, selecciona una película para eliminar.');
        }
    });

    function agregarPelicula(pelicula) {
        const peliculaCard = document.createElement('div');
        peliculaCard.classList.add('pelicula-card');

        const portada = document.createElement('img');
        portada.classList.add('pelicula-portada');
        portada.src = pelicula.portada;
        portada.alt = pelicula.nombre;
        portada.addEventListener('click', function() {
            peliculaCard.classList.toggle('flipped');
        });
        peliculaCard.appendChild(portada);

        const descripcion = document.createElement('div');
        descripcion.classList.add('pelicula-descripcion');
        descripcion.innerHTML = `<h2>${pelicula.nombre}</h2><p>${pelicula.descripcion}</p>`;
        descripcion.addEventListener('click', function() {
            peliculaCard.classList.toggle('flipped');
        });
        peliculaCard.appendChild(descripcion);

        // Nuevo: Agregar "¿La has visto?" solo si hay una portada
        if (pelicula.portada && pelicula.portada !== '') {
            const hasVistoDiv = document.createElement('div');
            hasVistoDiv.classList.add('has-visto');
            const hasVistoLabel = document.createElement('label');
            hasVistoLabel.setAttribute('for', `visto-${pelicula.nombre}`);
            hasVistoLabel.textContent = '¿La has visto?';
            const hasVistoCheckbox = document.createElement('input');
            hasVistoCheckbox.setAttribute('type', 'checkbox');
            hasVistoCheckbox.setAttribute('id', `visto-${pelicula.nombre}`);
            hasVistoCheckbox.setAttribute('name', `visto-${pelicula.nombre}`);
            hasVistoDiv.appendChild(hasVistoLabel);
            hasVistoDiv.appendChild(hasVistoCheckbox);
            peliculaCard.appendChild(hasVistoDiv);
        }

        contenedorPeliculas.appendChild(peliculaCard);
    }   

    function guardarPeliculaLocalStorage(pelicula) {
        let peliculas = JSON.parse(localStorage.getItem('peliculas')) || [];
        peliculas.push(pelicula);
        localStorage.setItem('peliculas', JSON.stringify(peliculas));
    }

    function cargarPeliculasDesdeLocalStorage() {
        const peliculas = JSON.parse(localStorage.getItem('peliculas')) || [];
        peliculas.forEach(function(pelicula) {
            agregarPelicula(pelicula);
            actualizarSelectEliminar(pelicula);
        });
    }

    function actualizarSelectEliminar(pelicula) {
        const option = document.createElement('option');
        option.value = JSON.stringify(pelicula);
        option.textContent = pelicula.nombre;
        selectEliminar.appendChild(option);
    }

    function eliminarPelicula(pelicula) {
        let peliculas = JSON.parse(localStorage.getItem('peliculas')) || [];
        peliculas = peliculas.filter(function(p) {
            return p.nombre !== pelicula.nombre;
        });
        localStorage.setItem('peliculas', JSON.stringify(peliculas));

        contenedorPeliculas.innerHTML = ''; // Limpiar todas las películas
        peliculas.forEach(function(pelicula) {
            agregarPelicula(pelicula);
            actualizarSelectEliminar(pelicula);
        });
    }
});
