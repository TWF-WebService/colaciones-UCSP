// Interruptor de las listas de alumnos:
//  - true  -> al hacer clic en cada escuela se despliega la lista de alumnos.
//  - false -> los botones de escuela se muestran, pero la lista queda oculta
//             (modo usado temporalmente a pedido del cliente).
const MOSTRAR_LISTAS = true;

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu-links');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

fetch('data-colacion-2026-11.json')
  .then(res => res.json())
  .then(data => {

    const bachiller = data.filter(a => a.grado === "Bachiller");
    const titulo = data.filter(a => a.grado === "Titulado");

    render(bachiller, "bachiller");
    render(titulo, "titulo");
  });

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Ordena los periodos ("Consejo Universitario de agosto") cronológicamente por mes.
function ordenPeriodo(periodo) {
  const i = MESES.indexOf(periodo.split(' ').pop().toLowerCase());
  return i === -1 ? MESES.length : i;
}

function render(lista, containerId) {

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const escuelas = [...new Set(lista.map(a => a.escuela))]
  .sort((a, b) => a.localeCompare(b, 'es'));

  escuelas.forEach((escuela, index) => {

    const alumnosEscuela = lista.filter(a => a.escuela === escuela);

    const periodos = [...new Set(alumnosEscuela.map(a => a.periodo))]
      .sort((a, b) => ordenPeriodo(a) - ordenPeriodo(b));

    const periodosHTML = periodos.map(periodo => {

      const alumnosPeriodo = alumnosEscuela.filter(
        a => a.periodo === periodo
      );

      return `
        <div class="mb-3">
          <h6><strong>${periodo}</strong></h6>
          <ul>
            ${alumnosPeriodo.map(a => `<li>${a.nombre}</li>`).join('')}
          </ul>
        </div>
      `;

    }).join('');

    const col = document.createElement('div');
    col.className = "col-md-4";

    const accordionId = `${containerId}-${index}`;

    // Si MOSTRAR_LISTAS es false, el botón se genera sin los atributos
    // data-bs-toggle/data-bs-target, por lo que Bootstrap no lo asocia
    // a ningún collapse y el clic no hace nada (la lista queda oculta).
    const atributosToggle = MOSTRAR_LISTAS
      ? `data-bs-toggle="collapse" data-bs-target="#${accordionId}"`
      : '';

    col.innerHTML = `
      <div class="accordion-item">

        <h2 class="accordion-header">
          <button class="accordion-button collapsed" ${atributosToggle}>
            ${escuela}
          </button>
        </h2>

        <div id="${accordionId}" class="accordion-collapse collapse"
             data-bs-parent="#${containerId}">
          <div class="accordion-body">
            ${periodosHTML}
          </div>
        </div>

      </div>
    `;

    container.appendChild(col);
  });
}