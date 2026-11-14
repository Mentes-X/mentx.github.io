/**
 * MentX - app.js
 * Gestión de vistas y validación dinámica de certificaciones
 */

const main = document.getElementById('main-content');

function showView(view, data = null) {
    if (view === 'catalog') {
        renderCatalog();
    } else if (view === 'classroom') {
        renderClassroom(data);
    }
    window.scrollTo(0, 0);
}

function renderCatalog() {
    let html = `
        <header class="catalog-header">
            <h1>Una extraña forma de aprender</h1>
            <p>una rara forma de enseñar</p>
        </header>
        <div class="course-grid">`;

    COURSES.forEach((curso, index) => {
        html += `
            <div class="course-card">
                <div class="video-container">
                    <iframe width="100%" height="100%" src="${curso.video}" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="course-info">
                    <span class="badge">${curso.nivel || 'Fundamentos'}</span>
                    <h3>${curso.titulo}</h3>
                    <p>${curso.descripcion || 'Introductorio.'}</p>
                    <p><strong>⏱ Duración:</strong> ${curso.duracion || '10 minutos'}</p>
                    <button class="btn-primary" onclick="showView('classroom', ${index})">Ver para crear</button>
                </div>
            </div>`;
    });

    html += `</div>`;
    main.innerHTML = html;
}

function renderClassroom(index) {
    const curso = COURSES[index];
    main.innerHTML = `
        <div class="classroom">
            <div class="main-lesson">
                <button onclick="showView('catalog')" style="margin-bottom:10px; cursor:pointer;">← Volver al catálogo</button>
                <div class="video-container">
                    <iframe width="100%" height="100%" src="${curso.video}" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="content-area">
                    <h2 class="${curso.dir || ''}">${curso.titulo}</h2>
                    <hr>
                    <div class="text-content ${curso.dir || ''}">
                        ${curso.contenido || 'Este curso explora la convención del cuidado humano ser a través del ser en su primera edición de la Era de Acuario.'}
                    </div>
                </div>
            </div>
            
            <aside class="sidebar-info">
                <h3>Progreso y Tareas</h3>
                <p>Este curso es para aprender <strong>a su propio ritmo</strong>.</p>
                <p>Para participar en la convención, debes completarlo.</p>
                <a href="${curso.tarea_url || '#'}" target="_blank">
                    <button class="btn-primary" style="background:#2c3e50; margin-bottom:10px;">Ir al curso</button>
                </a>
                <hr>
                <h4>Participante</h4>
                <p style="font-size:0.85rem; color:#444;">Certificación.</p>
                <input type="text" id="alumnoNombre" placeholder="Nombre completo" style="width:90%; padding:8px; margin-bottom:10px;">
                <input type="text" id="codigoSecreto" placeholder="Código (MX-2026-XXX)" style="width:90%; padding:8px; margin-bottom:10px;">
                <button id="btnDescargar" class="btn-primary" onclick="validarYGenerar(${index})">Verificar y Descargar</button>
                <p style="font-size:0.8rem; color:#666; margin-top:10px;">* Validado por humanos.</p>
            </aside>
        </div>
    `;
}

async function validarYGenerar(index) {
    const curso = COURSES[index];
    const nombreInput = document.getElementById('alumnoNombre').value.trim();
    const codigoInput = document.getElementById('codigoSecreto').value.trim();
    const btn = document.getElementById('btnDescargar');
    
    if (!nombreInput || !codigoInput) {
        alert("Por favor, ingresa tu nombre completo y el código de aprobación enviado a tu correo.");
        return;
    }

    const DEPLOY_URL = "https://script.google.com/macros/s/AKfycbzWecJHGdzARl7jNCt1k6JztmR1iDca5L3TMQcvvhP0JMX9RkuVBfmEmaoVB51NlRxp2g/exec"; 

    try {
        btn.disabled = true;
        btn.innerText = "Verificando...";
        
        const queryParams = `?nombre=${encodeURIComponent(nombreInput)}&codigo=${encodeURIComponent(codigoInput)}&cursoId=${encodeURIComponent(curso.id)}`;
        const response = await fetch(DEPLOY_URL + queryParams);
        const resultado = await response.json();

        if (resultado.autorizado) {
            await generateCertPDF(nombreInput, curso, codigoInput.toUpperCase());
            alert("¡Felicidades! Identidad verificada. Tu certificado se está generando.");
        } else {
            alert("Acceso denegado: Los datos no coinciden o el código no pertenece a este curso.");
        }
    } catch (error) {
        console.error("Error de comunicación con MentX Cloud:", error);
        alert("No se pudo conectar con el servidor de validación. Verifica tu conexión a internet.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Verificar y Descargar";
    }
}

showView('catalog');
