// src/functions.js
'use strict';

/**
 * Realiza una petición fetch a la URL de productos y devuelve
 * { success: boolean, body: any } usando .then/.catch (promesas).
 * @param {string} url
 * @returns {Promise<{success: boolean, body: any}>}
 */
export const fetchProducts = (url) => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => ({ success: true, body: data }))
    .catch(error => ({ success: false, body: error.message }));
};

/**
 * Realiza una petición fetch a la URL de categorías (XML)
 * usando async/await y DOMParser para devolver un Document XML.
 * @param {string} url
 * @returns {Promise<{success: boolean, body: Document|string}>}
 */
export const fetchCategories = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const text = await response.text();
    const parser = new DOMParser();
    const data = parser.parseFromString(text, "application/xml");
    return { success: true, body: data };
  } catch (error) {
    return { success: false, body: error.message };
  }
};
