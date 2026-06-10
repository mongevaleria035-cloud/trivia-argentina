// ⚠️ CONFIGURACIÓN DE SUPABASE
// Reemplazá estos datos con las credenciales que te da Supabase
const SUPABASE_URL = "TU_SUPABASE_URL";
const SUPABASE_ANON_KEY = "TU_SUPABASE_ANON_KEY";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let preguntas = [];
let indiceActual = 0;
let puntaje = 0;

// Elementos HTML
const preguntaTxt = document.getElementById('pregunta');
const preguntaImg = document.getElementById('pregunta-imagen');
const opcionesContenedor = document.getElementById('opciones-contenedor');
const btnSiguiente = document.getElementById('btn-siguiente');
const progresoTxt = document.getElementById('progreso-texto');
const pantallaPregunta = document.getElementById('pantalla-pregunta');
const pantallaFinal = document.getElementById('pantalla-final');
const puntajeFinal = document.getElementById('puntaje-final');
const mensajeFinal = document.getElementById('mensaje-final');
const btnReiniciar = document.getElementById('btn-reiniciar');

async function obtenerPreguntas() {
    try {
        // Buscamos los datos de la tabla llamada "trivia"
        let { data, error } = await supabase.from('trivia').select('*');
        
        if (error) throw error;

        preguntas = data;
        iniciarJuego();
    } catch (error) {
        console.error("Error cargando Supabase:", error);
        preguntaTxt.textContent = "Error al conectar con Supabase. Revisá las credenciales.";
    }
}

function iniciarJuego() {
    indiceActual = 0;
    puntaje = 0;
    pantallaFinal.style.display = 'none';
    pantallaPregunta.style.display = 'block';
    mostrarPregunta();
}

function mostrarPregunta() {
    btnSiguiente.style.display = 'none';
    opcionesContenedor.innerHTML = '';
    
    let item = preguntas[indiceActual];
    progresoTxt.textContent = `Pregunta ${indiceActual + 1} de ${preguntas.length}`;
    preguntaTxt.textContent = item.pregunta;

    // Control de la imagen (Postimages Direct Link)
    if (item.url_imagen) {
        preguntaImg.src = item.url_imagen;
        preguntaImg.style.display = 'inline-block';
    } else {
        preguntaImg.style.display = 'none';
    }

    // Convertir las opciones que vienen de la base de datos en botones
    // Suponiendo que en Supabase guardaste las opciones separadas por comas o mapeadas
    const opciones = [item.opcion1, item.opcion2, item.opcion3, item.opcion4];

    opciones.forEach((opcion, index) => {
        const boton = document.createElement('button');
        boton.textContent = opcion;
        boton.classList.add('opcion-btn');
        boton.addEventListener('click', () => verificarRespuesta(index, boton, item.correcta));
        opcionesContenedor.appendChild(boton);
    });
}

function verificarRespuesta(seleccionado, boton, indiceCorrecto) {
    const botones = opcionesContenedor.querySelectorAll('.opcion-btn');
    botones.forEach(b => b.disabled = true);

    if (seleccionado === indiceCorrecto) {
        boton.classList.add('bien');
        puntaje++;
    } else {
        boton.classList.add('mal');
        botones[indiceCorrecto].classList.add('bien');
    }
    btnSiguiente.style.display = 'inline-block';
}

btnSiguiente.addEventListener('click', () => {
    indiceActual++;
    if (indiceActual < preguntas.length) {
        mostrarPregunta();
    } else {
        pantallaPregunta.style.display = 'none';
        pantallaFinal.style.display = 'block';
        progresoTxt.textContent = "¡Completado!";
        puntajeFinal.textContent = `${puntaje} / ${preguntas.length}`;
        mensajeFinal.textContent = "¡Datos procesados con éxito para la universidad! 📊";
    }
});

btnReiniciar.addEventListener('click', iniciarJuego);

// Ejecutar al cargar la web
obtenerPreguntas();