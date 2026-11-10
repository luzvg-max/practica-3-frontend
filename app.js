
// Dirección de nuestra API REST
const API_URL = 'http://localhost:3000/api/recursos';

// Variable para almacenar la gráfica
let grafica = null;

// Función para obtener los libros desde la API
async function obtenerLibros() {
    try {
        const respuesta = await fetch(API_URL);

        // Verificar si la petición fue exitosa
        if (!respuesta.ok) {
            throw new Error('Error al consultar la API');
        }

        // Convertir la respuesta a formato JSON
        const libros = await respuesta.json();

        console.log('Libros obtenidos:', libros);

        // Mostrar los libros en la tabla
        mostrarLibros(libros);

        // Generar la gráfica
        generarGrafica(libros);

    } catch (error) {
        console.error('Error:', error);

        document.getElementById('tabla-libros').innerHTML =
            '<tr><td colspan="4">No se pudieron cargar los libros.</td></tr>';
    }
}

// Función para mostrar los libros en la tabla
function mostrarLibros(libros) {

    const tabla = document.getElementById('tabla-libros');

    // Limpiar el contenido anterior
    tabla.innerHTML = '';

    // Recorrer los libros obtenidos
    libros.forEach(libro => {

        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${libro.id}</td>
            <td>${libro.nombre}</td>
            <td>${libro.autor}</td>
            <td>${libro.categoria}</td>
        `;

        tabla.appendChild(fila);
    });
}

// Función para generar la gráfica con Chart.js
function generarGrafica(libros) {

    // Obtener las categorías de los libros
    const categorias = {};

    libros.forEach(libro => {
        const categoria = libro.categoria;

        categorias[categoria] = (categorias[categoria] || 0) + 1;
    });

    // Separar etiquetas y cantidades
    const etiquetas = Object.keys(categorias);
    const cantidades = Object.values(categorias);

    // Obtener el elemento canvas
    const contexto = document.getElementById('graficaLibros');

    // Destruir gráfica anterior si existe
    if (grafica) {
        grafica.destroy();
    }

    // Crear gráfica de barras
    grafica = new Chart(contexto, {
        type: 'bar',

        data: {
            labels: etiquetas,

            datasets: [{
                label: 'Cantidad de libros',
                data: cantidades,
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e67e22',
                    '#9b59b6',
                    '#e74c3c'
                ],
                borderColor: '#243b55',
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },

            plugins: {
                legend: {
                    display: true
                },

                title: {
                    display: true,
                    text: 'Cantidad de libros por categoría'
                }
            }
        }
    });
}

// Ejecutar la función al cargar la página
obtenerLibros();
