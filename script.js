// Variable global para almacenar la URL generada
let enlaceGenerado = "";

// 1. Al cargar la página, verificamos si viene un reto en la URL
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Si la URL contiene 'tipo' y 'texto', el usuario está recibiendo un reto
    if (urlParams.has('tipo') && urlParams.has('texto')) {
        const tipo = urlParams.get('tipo');
        const texto = urlParams.get('texto');
        // Conserva el modo que viene en la URL, o asigna "🔥 Modo Fiesta / Amigos" por defecto si se borra
        const modo = urlParams.get('modo') || "🔥 Modo Fiesta / Amigos";
        const creador = urlParams.get('creador') || "Un miembro anónimo";

        // Inyectamos los datos en las etiquetas del HTML
        document.getElementById('card-mode').textContent = modo;
        document.getElementById('card-badge').className = `badge ${tipo}`;
        document.getElementById('card-badge').textContent = tipo === 'verdad' ? 'Verdad 😇' : 'Reto 😈';
        document.getElementById('card-text').textContent = `"${texto}"`;
        document.getElementById('card-creator').textContent = creador;

        switchView('view-receive');
    } else {
      // Si no hay parámetros, mostramos la pantalla para crear un reto
        switchView('view-create');
    }
};

// 2. Control dinámico de pantallas mediante clases CSS
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

// 3. VISTA 1: Generar el enlace con los datos del formulario
function generarEnlace() {
    const creador = document.getElementById('input-creator').value.trim() || "Anónimo";
    const modo = document.getElementById('select-mode').value;
    const tipo = document.getElementById('select-type').value;
    const texto = document.getElementById('input-text').value.trim();

    if (texto === "") {
        alert("Escribe algo antes de generar el link, ¡no dejes el espacio en blanco!");
        return;
    }

    // Detecta automáticamente si estás en local o en tu servidor web definitivo
    const urlBase = window.location.origin + window.location.pathname;
    
    // Codificamos los caracteres especiales de forma segura para la URL
    enlaceGenerado = `${urlBase}?tipo=${encodeURIComponent(tipo)}&texto=${encodeURIComponent(texto)}&creador=${encodeURIComponent(creador)}&modo=${encodeURIComponent(modo)}`;
    
    // Colocamos el link en el input de la VISTA 2 y cambiamos de pantalla
    document.getElementById('output-url').value = enlaceGenerado;
    document.getElementById('btn-copy').textContent = "📋 Copiar Enlace";
    switchView('view-share');
}

// 4. VISTA 2: Copiar el enlace al portapapeles del dispositivo
function copiarAlPortapapeles() {
    const inputUrl = document.getElementById('output-url');
    inputUrl.select();
    inputUrl.setSelectionRange(0, 99999); // Compatibilidad para teléfonos móviles

    navigator.clipboard.writeText(inputUrl.value)
        .then(() => {
            document.getElementById('btn-copy').textContent = "✅ ¡Copiado!";
            // Regresa el texto original después de 2 segundos
            setTimeout(() => {
                document.getElementById('btn-copy').textContent = "📋 Copiar Enlace";
            }, 2000);
        })
        .catch(() => {
            alert("No se pudo copiar automáticamente. Por favor selecciónalo y cópialo manualmente.");
        });
}

// 5. VISTA 2: Abrir ventana de compartición en Facebook
function compartirFacebookDirecto() {
    const urlACompartir = enlaceGenerado || document.getElementById('output-url').value;
    const fbUrl = `https://facebook.com{encodeURIComponent(urlACompartir)}`;
    window.open(fbUrl, '_blank');
}

// 6. REINICIAR: Limpiar formulario y limpiar los parámetros de la URL de la barra de direcciones
function resetApp() {
    document.getElementById('input-text').value = "";
    document.getElementById('input-creator').value = "";
    
    // Esto borra los datos de la URL visualmente sin recargar la página entera
    window.history.replaceState({}, document.title, window.location.pathname);
    
    switchView('view-create');
}
