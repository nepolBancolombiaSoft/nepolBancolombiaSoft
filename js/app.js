let vistaActual = 'grid';
        const contenedor = document.getElementById('contenedor');
        const botones = document.querySelectorAll('.filtros button');
        const botonesVista = document.querySelectorAll('.modo-vista button');
        let filtroActual = 'todos';

        function normalizar(texto) {
            return texto
                .toLowerCase()
                .normalize('NFD')
                .replace(/[^\w\s]/g, '')
                .replace(/[\u0300-\u036f]/g, '');
        }

        function resaltar(texto, palabras) {
            if (palabras.length === 0) return texto;
            const regex = new RegExp('(' + palabras.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
            return texto.replace(regex, '<mark>$1</mark>');
        }

        function actualizarEstadisticas(serviciosMostrados) {
            document.getElementById('total-servicios').textContent = datos.length;
            document.getElementById('servicios-mostrados').textContent = serviciosMostrados;
        }

        function renderCards(filtro, textoBusqueda = '') {
            contenedor.innerHTML = '';
            contenedor.className = vistaActual;

            let serviciosMostrados = 0;

            const palabrasBusqueda = normalizar(textoBusqueda).split(/\s+/).filter(Boolean);

            datos.forEach(servicio => {
                const coincideFiltro = filtro === 'todos' || servicio.tipo === filtro || servicio.herramienta === filtro;

                const nombreNorm = normalizar(servicio.nombre);
                const propositoNorm = normalizar(servicio.proposito);
                const herramientaNorm = normalizar(servicio.herramienta);

                const coincideBusqueda = palabrasBusqueda.length === 0 || palabrasBusqueda.some(palabra =>
                    nombreNorm.includes(palabra) ||
                    propositoNorm.includes(palabra) ||
                    herramientaNorm.includes(palabra)
                );

                if (coincideFiltro && coincideBusqueda) {
                    serviciosMostrados++;
                    const card = document.createElement('div');
                    card.className = 'card';
                    const icono = iconos[servicio.herramienta] || iconos[servicio.tipo] || 'https://img.icons8.com/fluency/48/service.png';
                    
                    const estrellas = '★'.repeat(Math.floor(servicio.popularidad)) + '☆'.repeat(5 - Math.floor(servicio.popularidad));
                    
                    card.innerHTML = `
                        <img src="${icono}" alt="icon">
                        <div class="info">
                            <h3>${resaltar(servicio.nombre, palabrasBusqueda)}</h3>
                            <span class="tipo-badge">${servicio.tipo}</span>
                            <span class="herramienta-badge">${servicio.herramienta}</span>
                            <p>${resaltar(servicio.proposito, palabrasBusqueda)}</p>
                            <div class="popularidad">
                                <span class="star">${estrellas}</span>
                                <span class="rating">(${servicio.popularidad}/5)</span>
                            </div>
                            <a href="${servicio.link}" target="_blank">🚀 Acceder al Servicio</a>
                        </div>
                    `;
                    contenedor.appendChild(card);
                }
            });

            if (serviciosMostrados === 0) {
                contenedor.innerHTML = `
                    <div class="no-results">
                        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f50d.svg" alt="No results">
                        <h3>No se encontraron servicios</h3>
                        <p>Intenta ajustar los filtros o términos de búsqueda</p>
                    </div>
                `;
            }

            actualizarEstadisticas(serviciosMostrados);
        }

        function cambiarVista(vista) {
            vistaActual = vista;
            botonesVista.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.modo-vista button[onclick*="${vista}"]`).classList.add('active');
            renderCards(filtroActual, document.getElementById('buscador').value);
        }

        function filtrar(filtro) {
            filtroActual = filtro;
            botones.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.filtros button[onclick*="${filtro}"]`).classList.add('active');
            renderCards(filtro, document.getElementById('buscador').value);
        }

        function buscar() {
            renderCards(filtroActual, document.getElementById('buscador').value);
        }

        // Inicializar
        renderCards('todos');
