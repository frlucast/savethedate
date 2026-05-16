// JavaScript básico para la página Save the Date

document.addEventListener('DOMContentLoaded', function () {
  console.log('Página lista');

  // --- Lógica del Reproductor de Música ---
  const playBtn = document.querySelector('.control-btn');
  // Buscamos el elemento de audio (asegúrate de tener <audio id="wedding-music" src="..."></audio> en tu HTML)
  const music = document.getElementById('wedding-music');
  const progressBar = document.getElementById('progress-bar');

  if (playBtn && music) {
      playBtn.addEventListener('click', function() {
          if (music.paused) {
              music.play();
              // Cambiamos el emoji/texto por icono de Pause
              playBtn.innerHTML = '<i class="fas fa-pause"></i>';
          } else {
              music.pause();
              // Cambiamos el emoji/texto por icono de Play
              playBtn.innerHTML = '<i class="fas fa-play"></i>';
          }
      });

      // Actualizar la barra de progreso mientras suena la música
      music.addEventListener('timeupdate', () => {
          const progress = (music.currentTime / music.duration) * 100;
          if (progressBar) progressBar.value = progress || 0;
      });
  }

  // --- Lógica del Modal de Datos Bancarios ---
  const modal = document.getElementById('bank-modal');
  const openModalBtn = document.getElementById('open-bank-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const copyBtn = document.getElementById('copy-clabe');

  if (openModalBtn && modal) {
      openModalBtn.addEventListener('click', () => {
          modal.style.display = 'flex';
      });
  }

  if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
          modal.style.display = 'none';
      });
  }

  // Cerrar si se hace clic fuera del contenido blanco
  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  // Función para copiar la CLABE
  if (copyBtn) {
      copyBtn.addEventListener('click', () => {
          const clabe = document.getElementById('clabe-number').textContent;
          navigator.clipboard.writeText(clabe);
          copyBtn.textContent = '¡COPIADO!';
          setTimeout(() => { copyBtn.textContent = 'COPIAR CLABE'; }, 2000);
      });
  }
});


// 1. Configura la fecha y hora exacta de la boda (Año, Mes [0-11], Día, Hora, Minutos)
// Nota: En JavaScript los meses empiezan en 0 (Enero = 0, Junio = 5)
const fechaBoda = new Date(2026, 5, 27, 19, 0, 0).getTime();

// 2. Actualizar el contador cada 1 segundo (1000 milisegundos)
const intervalo = setInterval(function() {

    // Obtener la fecha y hora actual
    const ahora = new Date().getTime();
    
    // Encontrar la distancia/tiempo restante entre ahora y la boda
    const distancia = fechaBoda - ahora;
    
    // Cálculos de tiempo para Días, Horas, Minutos y Segundos
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
    
    // 3. Insertar los resultados en los elementos HTML correspondientes
    // Usamos padStart(2, '0') para que muestre "05" en vez de "5"
    document.getElementById("days").textContent = String(dias).padStart(2, '0');
    document.getElementById("hours").textContent = String(horas).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutos).padStart(2, '0');
    document.getElementById("seconds").textContent = String(segundos).padStart(2, '0');
    
    // 4. Si la cuenta regresiva termina, mostrar un mensaje o dejarlo en cero
    if (distancia < 0) {
        clearInterval(intervalo);
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        
        // Sustituimos el texto por uno con icono de celebración
        document.querySelector(".countdown-section p").innerHTML = '<i class="fas fa-glass-cheers"></i> ¡Llegó el momento de celebrar!';
    }

}, 1000);



document.getElementById('wedding-rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    // Cambiar texto del botón para feedback visual
    const submitBtn = document.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'ENVIANDO...';
    submitBtn.disabled = true;

    // URL generada en Google Apps Script
    const urlScript = "https://script.google.com/macros/s/AKfycbxNLbc2OALr9WKl1WHHqwt9khtCBrglZekXKpAYoVphIWJT7qvP9hJkQGftgvbMomXi/exec";

    // Recolectar y validar la opción de asistencia seleccionada
    const asistenciaInput = document.querySelector('input[name="asistencia"]:checked');
    
    if (!asistenciaInput) {
        alert('Por favor, selecciona si asistirás.');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
    }

    const nombreInvitado = document.getElementById('guest-name')?.value || 'Anónimo';
    const mensajeInvitado = document.getElementById('guest-message')?.value || '';
    const numeroPersonas = document.getElementById('guest-count')?.value || 1;

    // Usamos URLSearchParams para que Google Apps Script reciba los datos de forma sencilla
    const formData = new URLSearchParams();
    formData.append('asistencia', asistenciaInput.value);
    formData.append('nombre', nombreInvitado);
    formData.append('mensaje', mensajeInvitado);
    formData.append('numeroPersonas', numeroPersonas);

    // Enviar los datos mediante una petición POST (Fetch)
    fetch(urlScript, {
        method: 'POST',
        mode: 'no-cors', 
        body: formData
    })
    .then(() => {
        // Como usamos 'no-cors', asumimos éxito directo si no hay error de red
        alert('¡Gracias! Tu respuesta ha sido enviada con éxito.');
        document.getElementById('wedding-rsvp-form').reset(); // Limpia el formulario
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al enviar tu respuesta. Por favor, inténtalo de nuevo.');
    })
    .finally(() => {
        // Restaurar el botón a su estado original
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    });
});
