// src/file01.js
"use strict";

/* Funciones locales ya existentes (showToast, showVideo) */
const showToast = () => {
  const toast = document.getElementById("toast-interactive");
  if (toast) {
    toast.classList.add("md:block");
  }
};

const showVideo = () => {
  const demo = document.getElementById("demo");
  if (demo) {
    demo.addEventListener("click", () => {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    });
  }
};

/* --- Importar las funciones que creamos --- */
import { fetchProducts, fetchCategories } from './functions.js';

/**
 * Renderiza hasta los primeros 6 productos en #products-container
 * @param {string} url
 */
const renderProducts = (url, filterCategoryId = null) => {
  return fetchProducts(url)
    .then(result => {
      if (!result.success) {
        alert(`Error al cargar productos: ${result.body}`);
        return;
      }

      const container = document.getElementById('products-container');
      if (!container) return;
      container.innerHTML = ''; // limpiar contenido previo

      const allProducts = Array.isArray(result.body) ? result.body : [];
      // aplicar filtro si se entregó category id
      const filtered = filterCategoryId
        ? allProducts.filter(p => String(p.category_id) === String(filterCategoryId))
        : allProducts;

      const products = filtered.slice(0, 6);

      products.forEach(product => {
        let productHTML = `
          <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
            <img
              class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
              src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
            <h3 class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              $[PRODUCT.PRICE]
            </h3>
            <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
            <div class="space-y-2">
              <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 w-full inline-block">
                Ver en Amazon
              </a>
              <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
            </div>
          </div>
        `;

        productHTML = productHTML.replaceAll('[PRODUCT.IMGURL]', product.imgUrl || '');
        productHTML = productHTML.replaceAll('[PRODUCT.TITLE]', product.title ? (product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title) : 'No title');
        productHTML = productHTML.replaceAll('[PRODUCT.PRICE]', (product.price !== undefined ? Number(product.price).toFixed(2) : '0.00'));
        productHTML = productHTML.replaceAll('[PRODUCT.PRODUCTURL]', product.productURL || '#');
        productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id || '');

        container.innerHTML += productHTML;
      });

      // si no hay productos tras el filtro, mostrar mensaje
      if (products.length === 0) {
        container.innerHTML = '<p class="text-center col-span-3">No hay productos para esta categoría.</p>';
      }
    })
    .catch(err => {
      console.error('RenderProducts error:', err);
      alert('Ocurrió un error inesperado al cargar productos.');
    });
};

/**
 * Renderiza las categorías en el <select id="categories">
 * y configura el evento change para filtrar productos.
 * @param {string} urlCategories
 * @param {string} urlProducts
 */
const renderCategories = async (urlCategories, urlProducts) => {
  try {
    const result = await fetchCategories(urlCategories);
    if (!result.success) {
      alert(`Error al cargar categorías: ${result.body}`);
      return;
    }

    const container = document.getElementById('categories');
    if (!container) return;

    container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;

    const categoriesXML = result.body;
    const categories = categoriesXML.getElementsByTagName('category');

    for (let category of categories) {
      const idElem = category.getElementsByTagName('id')[0];
      const nameElem = category.getElementsByTagName('name')[0];

      const id = idElem ? idElem.textContent.trim() : '';
      const name = nameElem ? nameElem.textContent.trim() : '';

      let categoryHTML = `<option value="[ID]">[NAME]</option>`;
      categoryHTML = categoryHTML.replaceAll('[ID]', id);
      categoryHTML = categoryHTML.replaceAll('[NAME]', name);

      container.innerHTML += categoryHTML;
    }

    // Evento: al cambiar categoría, recargar productos filtrados
    container.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      const productsURL = 'https://data-dawm.github.io/datum/reseller/products.json';
      if (selectedId === '') {
        renderProducts(productsURL, null);
      } else {
        renderProducts(productsURL, selectedId);
      }
    });
  } catch (error) {
    console.error('RenderCategories error:', error);
    alert('Ocurrió un error inesperado al cargar categorías.');
  }
};

/* --- Autoejecución al cargar el módulo --- */
(() => {
  showToast();
  showVideo();

  const productsURL = 'https://data-dawm.github.io/datum/reseller/products.json';
  const categoriesURL = 'https://data-dawm.github.io/datum/reseller/categories.xml';

  // Cargar categorías y productos iniciales (sin filtro)
  renderCategories(categoriesURL, productsURL);
  renderProducts(productsURL, null);
})();
