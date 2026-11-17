/**
 * MentX - Configuración de Certificación Dual
 * Dominio: mentx.org
 * Ubicación: Mérida, Venezuela
 */

// 1. Catálogo de Cursos con Contenido Programático para el Reverso
const COURSES = [
    {
        id: "convencion",
        nivel: "Fundamentos",
        duracion: "10 minutos",
        descripcion: "Introductorio a la primera edición de la era de Acuario.",
        titulo: "Convención del cuidado humano: una conexión con el Ser",
        video: "https://www.youtube.com/embed/vwfiT5qnHHY?si=yuV3jk4ND59bQFRc",
        contenido: "Este curso explora la convención del cuidado humano: ser a través del ser en su primera edición de la era de Acuario.",
        tarea_url: "https://docs.google.com/forms/d/e/1FAIpQLSdDb-mVl21V_h1d0BgZaRaFRsU1Tzy2n_ofrm5UjxXtyKd-AQ/viewform?usp=header", // Reemplaza "#" con el enlace de tu formulario de Google
        temario: [
            "Introducción a la convención 2026 - 2027",
            "Leyenda",
            "Manifiesto",
            "Resumen ejecutivo",
            "7 luminarias de inmersión"
        ]
    }
];

// 2. Lógica de Generación de PDF (Anverso y Reverso)
async function generateCertPDF(nombre, cursoObj, googleCode) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4');
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // --- PÁGINA 1: ANVERSO ---
    
    // Marco decorativo institucional
    doc.setDrawColor(0, 38, 38);
    doc.setLineWidth(1.5);
    doc.rect(8, 8, width - 16, height - 16);

    // Logos en márgenes superiores
    try {
        doc.addImage("logo-mentx.png", 'PNG', 15, 15, 22, 22); 
        doc.addImage("logo-ch.png", 'PNG', width - 37, 15, 22, 22);
    } catch (e) { 
        console.warn("Logos no encontrados. Verifique las rutas en la carpeta raíz."); 
    }

    // Cabecera MentX
    doc.setFont("times", "bold");
    doc.setFontSize(28);
    doc.setTextColor(0, 38, 38);
    doc.text("MentX | Para mentes curiosas", width / 2, 30, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 117, 84); // Verde MentX
    doc.text("mentx.org", width / 2, 36, { align: "center" });

    // Datos del Titular
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text("Otorga el presente certificado a:", width / 2, 55, { align: "center" });
    
    doc.setFontSize(32);
    doc.setTextColor(0, 117, 84);
    doc.text(nombre.toUpperCase(), width / 2, 75, { align: "center" });
    
    doc.setFontSize(15);
    doc.setTextColor(0, 0, 0);
    doc.text(`Por haber aprobado el curso de introducción a la:`, width / 2, 92, { align: "center" });
    doc.setFont("times", "bolditalic");
    doc.text(cursoObj.titulo, width / 2, 102, { align: "center" });

    // --- QR DE VERIFICACIÓN ---
    const urlVerificador = `https://mentx.org/verificar.html?codigo=${googleCode}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(urlVerificador)}`;
    
    doc.addImage(qrUrl, 'PNG', (width / 2) - 15, 112, 30, 30);
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`ID Validación: ${googleCode}`, width / 2, 146, { align: "center" });

    // --- PÁGINA 2: REVERSO (CONTENIDOS) ---
    doc.addPage('l', 'mm', 'a4');
    
    doc.setDrawColor(200, 200, 200);
    doc.rect(10, 10, width - 20, height - 20);

    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 38, 38);
    doc.text("Contenido Programático", width / 2, 30, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    
    let currentY = 55;
    cursoObj.temario.forEach((item, index) => {
        doc.text(`${index + 1}. ${item}`, 35, currentY);
        currentY += 12;
    });

    // Pie de página de seguridad
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Certificado vinculado al código único de aprobación: ${googleCode}`, width / 2, height - 20, { align: "center" });
    doc.text(`Verificable en mentx.org mediante escaneo de código QR.`, width / 2, height - 16, { align: "center" });

    // Guardar el documento
    doc.save(`Certificado_MentX_${googleCode}.pdf`);
}
