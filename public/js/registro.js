 function validarPassword(){
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirm-password");

        if (password.value !== confirmPassword.value){
            // Si el valor de "CONTRASEÑA" es diferente a el valor de "CONFIRMACIÓN DE CONTRASEÑA":
            confirmPassword.setCustomValidity("Las contraseñas no coinciden.");
        }else {
            //Si coinciden, no se envía el error
            confirmPassword.setCustomValidity("");
            //setCustomValidity(): Es utilizado para crear mensajes de error en formularios html.
        }
        }
// Esperamos a que toda la página HTML termine de cargarse.
document.addEventListener('DOMContentLoaded', () => {
    // Buscamos el formulario de registro por su ID en la página view PHP.
    const formRegistro = document.getElementById('formRegistro');

    // Si no encontramos el formulario, detenemos el código.
    // Esto evita que JavaScript intente trabajar con un elemento que no existe.
    if (!formRegistro) return;

    // Detectamos cuando el usuario intenta enviar el formulario.
    formRegistro.addEventListener('submit', async (e) => {
        // Evitamos que el formulario se envíe por defecto.
        // Sin esto, al enviar se recargaría la página.
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('password').value;
        const mensajeError = document.getElementById('mensajeError');

        // Validamos que el nombre tenga al menos 2 caracteres.
        if (nombre.length < 2) {
           alert('El nombre debe tener al menos 2 caracteres.');
            return;
        }

        // Validamos el apellido.
        if (apellido.length < 2) {
           alert('El apellido debe tener al menos 2 caracteres.') ;
            return;
        }
        
        // Validamos que el email tenga un formato válido usando una expresión regular.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
           alert('Por favor, ingresa un correo electrónico válido.') ;
            return;
        }
        
        // Validamos la contraseña.
        if (contrasena.length < 3) {
           alert('La contraseña debe tener al menos 8 caracteres.') ;
            return;
        }

        // FormData toma automáticamente todos los datos
        // que el usuario escribió dentro del formulario.
        const formData = new FormData(formRegistro);

        try {
            // Enviamos los datos del formulario al servidor mediante fetch().
            // La dirección apunta al archivo PHP que se encarga
            // de procesar el registro del usuario.
            const respuesta = await fetch('../controllers/usuarioControllers.php', {
                // Usamos POST porque estamos enviando información
                // al servidor.
                method: 'POST',
                // Enviamos los datos que obtuvimos del formulario.
                body: formData
            });
            // Comprobamos si el servidor respondió correctamente.
            // Por ejemplo, un error 404 o 500 haría que esto sea falso.
            if (!respuesta.ok) {
                // Creamos un mensaje error indicando el código y el mensaje
                // que devolvió el servidor.
                throw new Error(`Error en el servidor: ${respuesta.status} ${respuesta.statusText}`);
            }
            // Esperamos la respuesta del servidor y la convertimos
            // desde JSON a un objeto de JavaScript.
            const resultado = await respuesta.json();
            
            // Comprobamos si el servidor indica que el registro
            // se realizó correctamente.
            if (resultado.success) {
                // Mostramos el mensaje que envió el servidor.
                alert(resultado.message);
                // Limpiamos todos los campos del formulario.
                formRegistro.reset();
                // Después de registrarse correctamente,
                // enviamos al usuario a la página de inicio de sesión.
            } else {
                // Si el servidor indica que hubo un problema,
                // mostramos el mensaje de error.
                alert('Error: ' + resultado.message);
            }
        } catch (error) {
            // Si ocurre algún problema durante la comunicación
            // con el servidor, mostramos el error en la consola.
            console.error('Error en la solicitud:', error);
            // Informamos al usuario de que no se pudo realizar
            // la comunicación con el servidor.
            alert('No se pudo conectar con el servidor.');
        }
    });
});
