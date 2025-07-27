## 🔥 Buscaminas - Desarrollo y Arquitecturas Web

Este proyecto es una implementación del clásico juego **Buscaminas**, desarrollado íntegramente con tecnologías web: HTML5, CSS3 y JavaScript puro (ES5/ES6). No se utilizaron librerías externas ni frameworks para la lógica del juego. 
Además, se incluye una sección de contacto funcional y un sistema de ranking que guarda resultados localmente.

---

### 🕹️ Jugar Ahora

**👉 [Jugá Ahora: https://ggrigera13.github.io/minesweeper-daw/](https://ggrigera13.github.io/minesweeper-daw/)**

---

## 🕹️ Características del juego

- Tablero dinámico generado con Flexbox.
- Tres niveles de dificultad:
  - Fácil (8x8 - 10 minas)
  - Medio (12x12 - 25 minas)
  - Difícil (16x16 - 40 minas)
- Control del nombre del jugador.
- Temporizador de juego.
- Ranking de partidas almacenado en LocalStorage.
- Orden del ranking por puntaje o por fecha.
- Modal con el historial de partidas.
- Adaptado a pantallas pequeñas con media queries.

---

## ✉️ Sección de Contacto

La sección de contacto está accesible desde una página separada (`contacto.html`) y contiene un formulario con los siguientes campos:

- Nombre
- Email
- Mensaje

Incluye validaciones en el cliente y muestra mensajes de error cuando los campos no son válidos.

---

## 📁 Estructura del proyecto

```
/ (raíz del proyecto)
│
├── index.html               # Página principal del juego
├── contacto.html            # Página de contacto
├── styles/
│   ├── reset.css            # Estilos base / reset
│   ├── style.css            # Estilos principales del juego
│   └── contacto.css         # Estilos específicos del formulario de contacto
├── scripts/
│   ├── main.js              # Lógica principal del juego
│   └── contacto.js          # Validación del formulario de contacto
├── src/
    └── sonidos              # Archivos de sonido que se reproducen durante el juego
```

---

## 🧪 Tecnologías utilizadas

- HTML5
- CSS3 (Flexbox, Media Queries)
- JavaScript (ES5 y ES6)
- LocalStorage para persistencia de partidas

---

## 🚀 Cómo usar

1. Cloná este repositorio:
   ```bash
   git clone https://github.com/Ggrigera13/minesweeper-daw.git
   ```
2. Abrí `index.html` en tu navegador preferido.

3. ¡Listo! Podés comenzar a jugar y registrar tus partidas.

---

## 🧑‍💻 Autor

Desarrollado por **Gianfranco Grigera**  
🔗 [Ver en GitHub](https://github.com/Ggrigera13/minesweeper-daw)