"use strict";
/*
(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
})()
*/

/**
 * Muestra una notificación (toast) en la interfaz.
 * 
 * Esta función busca el elemento HTML con el id "toast-interactive".
 * Si el elemento existe, agrega la clase "md:block" para hacerlo visible.
 * 
 * @function showToast
 * @returns {void} No devuelve ningún valor.
 */
const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

(() => {
    showToast();
})();

/**
 * Agrega un evento al botón o elemento con id "demo" para mostrar un video.
 * 
 * Cuando el elemento es clickeado, abre una nueva pestaña con el enlace al video de YouTube.
 * 
 * @function showVideo
 * @returns {void} No devuelve ningún valor.
 */
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

(() => {
    showToast();
    showVideo();
})();
