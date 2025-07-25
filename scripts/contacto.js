var formulario = document.getElementById('formularioContacto');
formulario.addEventListener("submit", envioFormulario);

function envioFormulario(e) {
    e.preventDefault();

    document.getElementById('errorNombre').textContent = '';
    document.getElementById('errorEmail').textContent = '';
    document.getElementById('errorMensaje').textContent = '';

    var nombre = document.getElementById('nombre').value.trim();
    var email = document.getElementById('email').value.trim();
    var mensaje = document.getElementById('mensaje').value.trim();

    var formularioValido = true;

    if (!/^[a-zA-Z0-9\s]+$/.test(nombre)) {
      document.getElementById('errorNombre').textContent = 'El nombre debe ser alfanumérico.';
      formularioValido = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('errorEmail').textContent = 'El correo no es válido.';
      formularioValido = false;
    }

    if (mensaje.length < 5) {
      document.getElementById('errorMensaje').textContent = 'El mensaje debe tener al menos 5 caracteres.';
      formularioValido = false;
    }

    if (formularioValido) {
        var asunto = "Formulario de contacto - Buscaminas";
        var cuerpo = `Nombre: ${nombre} - Correo: ${email} - Mensaje: ${mensaje}`;
        window.location.href = `mailto:gianfrancogrigera@gmail.com?subject=${asunto}&body=${cuerpo}`;
    }
}