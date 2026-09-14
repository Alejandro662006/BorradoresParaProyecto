// Esperamos a que toda la página HTML termine de cargarse.
document.addEventListener('DOMContentLoaded', () => {
    // Buscamos el formulario de login por su ID en la página HTML.
    const formLogin = document.getElementById('formLogin');

    // Si no encontramos el formulario, detenemos el código.
    if (!formLogin) return;

    const mensajeError = document.getElementById('mensajeError');

    // Detectamos cuando el usuario intenta enviar el formulario.
    formLogin.addEventListener('submit', async (e) => {
        // Evitamos que el formulario se envíe por defecto.
        // Sin esto, al enviar se recargaría la página.
        e.preventDefault();

        // Limpiamos cualquier mensaje de error anterior.
        if (mensajeError) mensajeError.textContent = '';

        const email = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('contrasena').value;

        // Validamos que el email tenga un formato válido.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        // Validamos que la contraseña no esté vacía.
        if (contrasena.length === 0) {
            alert('Por favor, ingresa tu contraseña.');
            return;
        }

        // FormData toma automáticamente todos los datos
        // que el usuario escribió dentro del formulario.
        const formData = new FormData(formLogin);

        try {
            // Enviamos los datos del formulario al servidor mediante fetch().
            // La dirección apunta al archivo PHP que se encarga
            // de procesar el inicio de sesión.
            const respuesta = await fetch('../controllers/loginController.php', {
                // Usamos POST porque estamos enviando información
                // al servidor.
                method: 'POST',
                // Enviamos los datos que obtuvimos del formulario.
                body: formData
            });

            // Comprobamos si el servidor respondió correctamente.
            if (!respuesta.ok) {
                throw new Error(`Error en el servidor: ${respuesta.status} ${respuesta.statusText}`);
            }

            // Esperamos la respuesta del servidor y la convertimos
            // desde JSON a un objeto de JavaScript.
            const resultado = await respuesta.json();

            // Comprobamos si el servidor indica que el login
            // se realizó correctamente.
            if (resultado.success) {
                // Después de iniciar sesión correctamente,
                // enviamos al usuario a la página principal
                // de usuario logueado.
                window.location.href = 'inicioPostSesion.html';
            } else {
                // Si el servidor indica que hubo un problema,
                // mostramos el mensaje de error.
                if (mensajeError) {
                    mensajeError.textContent = resultado.message;
                } else {
                    alert('Error: ' + resultado.message);
                }
            }
        } catch (error) {
            // Si ocurre algún problema durante la comunicación
            // con el servidor, mostramos el error en la consola.
            console.error('Error en la solicitud:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
});
