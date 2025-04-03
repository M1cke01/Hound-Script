document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const listaGuias = document.querySelector("table");
    const totalDeGuias = document.getElementById("totalDeGuias");
    const guiasEnTransito = document.getElementById("guiasEnTransito");
    const guiasEntregadas = document.getElementById("guiasEntregadas");
    let guias = [];
    
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const numeroDeGuia = form.numeroDeGuia.value.trim();
        const origen = form.origen.value.trim();
        const destino = form.destino.value.trim();
        const destinatario = form.destinatario.value.trim();
        const fechaDeCreacion = form.fechaDeCreacion.value;
        const estado = form.estado.value;

        if (!numeroDeGuia || !origen || !destino || !destinatario || !fechaDeCreacion) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (guias.some(guia => guia.numeroDeGuia === numeroDeGuia)) {
            alert("El número de guía ya está registrado.");
            return;
        }

        const nuevaGuia = {
            numeroDeGuia,
            estado,
            origen,
            destino,
            ultimaActualización: new Date().toLocaleString(),
            historial: [{ estado, fecha: new Date().toLocaleString() }]
        };

        guias.push(nuevaGuia);
        actualizarListaGuias();
        actualizarEstadoGeneral();
        form.reset();
    });

    function actualizarListaGuias() {
        listaGuias.innerHTML = `
            <thead>
                <tr>
                    <th>Número de guía</th>
                    <th>Estado</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Última actualización</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${guias.map((guia, index) => `
                    <tr>
                        <td>${guia.numeroDeGuia}</td>
                        <td>${guia.estado}</td>
                        <td>${guia.origen}</td>
                        <td>${guia.destino}</td>
                        <td>${guia.ultimaActualizacion}</td>
                        <td>
                            <button onCLick="actualizarEstado(${index})">Actualizar Estado</button>
                            <button onClick="verHistorial(${index})">Ver Historial</button>
                        </td>
                    </tr>
                    `).join('')}
            </tbody>
        `;
    }

    window.actualizarEstado = function (index) {
        const guia = guias[index];
        const estados = ["pendiente", "tránsito", "entregado"];
        const estadoIndex = estados.indexOf(guia.estado);
        if (estadoIndex < estados.length - 1) {
            guia.estado = estados[estadoIndex + 1];
            guia.ultimaActualizacion = new Date().toLocaleString();
            guia.historial.push({ estado: guia.estado, fecha: guia.ultimaActualizacion });
            actualizarListaGuias();
            actualizarEstadoGeneral();
        }
    };

    window.verHistorial = function (index) {
        const guia = guias[index];
        alert(`Historial de cambios para la guía ${guia.numeroDeGuia}:
            ${guia.historial.map(entry => `${entry.fecha}: ${entry.estado}`).join('\n')}`);
    };
    
    function actualizarEstadoGeneral() {
        totalDeGuias.textContent = guias.length;
        guiasEnTransito.textContent = guias.filter(g => g.estado === "transito").length;
        guiasEntregadas.textContent = guias.filter(g => g.estado === "entregado").length;
    }
});