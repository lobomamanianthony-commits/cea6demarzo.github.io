/**
 * loader.js
 * =========
 * Este script carga dinámicamente los componentes compartidos
 * (header, nav y footer) en cada página HTML.
 *
 * Funcionamiento:
 *  1. Al cargar el DOM, busca elementos con id="header-placeholder",
 *     id="nav-placeholder" y id="footer-placeholder".
 *  2. Hace un fetch() al archivo HTML del componente correspondiente.
 *  3. Inyecta el HTML obtenido dentro del placeholder.
 *  4. Llama a markActiveLink() para resaltar el link de la página actual.
 *
 * IMPORTANTE: Debe ejecutarse desde un servidor local (Live Server,
 * XAMPP, etc.) porque fetch() no funciona con file:// por seguridad.
 */

document.addEventListener("DOMContentLoaded", () => {

  // --- Rutas de los componentes (relativas a cada página) ---
  const components = [
    { id: "header-placeholder", file: "components/header.html" },
    { id: "nav-placeholder",    file: "components/nav.html"    },
    { id: "footer-placeholder", file: "components/footer.html" }
  ];

  // Contador para saber cuándo terminaron de cargar todos los componentes
  let loaded = 0;

  components.forEach(({ id, file }) => {
    const placeholder = document.getElementById(id);

    // Si el placeholder no existe en esta página, saltamos
    if (!placeholder) { loaded++; return; }

    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`No se pudo cargar: ${file}`);
        return res.text();
      })
      .then(html => {
        // Insertar el HTML del componente dentro del placeholder
        placeholder.innerHTML = html;
        loaded++;

        // Cuando todos los componentes están listos, marcar el link activo
        if (loaded === components.length) {
          markActiveLink();
        }
      })
      .catch(err => {
        console.error(err);
        placeholder.innerHTML = `<div class="alert alert-danger">Error cargando componente: ${file}</div>`;
      });
  });

  /**
   * markActiveLink()
   * Compara la URL actual con cada <a> del nav y agrega la clase
   * "active" al que corresponde a la página en pantalla.
   */
  function markActiveLink() {
    // Obtiene solo el nombre del archivo (ej: "actividades.html")
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    // Selecciona todos los links del nav
    const navLinks = document.querySelectorAll("#nav-placeholder .nav-link");

    navLinks.forEach(link => {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

});
