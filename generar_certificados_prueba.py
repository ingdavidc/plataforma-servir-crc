import os
import io
import math
import fitz
from PIL import Image, ImageDraw
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from reportlab.pdfgen import canvas
from reportlab.lib import colors

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(BASE_DIR, "plantilla_resolucion_2056_anexo.pdf")

def make_fingerprint_png():
    """Genera una textura biométrica de huella dactilar para los recuadros oficiales"""
    img = Image.new("RGBA", (140, 180), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = 70, 95
    for r in range(10, 68, 5):
        bbox = [cx - int(r * 0.72), cy - r, cx + int(r * 0.72), cy + r]
        draw.arc(bbox, start=0, end=360, fill=(30, 41, 59, 215), width=2)
    b = io.BytesIO()
    img.save(b, format="PNG")
    return b.getvalue()

def make_qr_png(data_str):
    """Genera el código QR oficial de verificación digital en formato PNG en memoria"""
    qr_code = qr.QrCodeWidget(data_str)
    bounds = qr_code.getBounds()
    w = bounds[2] - bounds[0]
    h = bounds[3] - bounds[1]
    d = Drawing(100, 100, transform=[100.0 / w, 0, 0, 100.0 / h, 0, 0])
    d.add(qr_code)
    b_pdf = io.BytesIO()
    renderPDF.drawToFile(d, b_pdf)
    b_pdf.seek(0)
    doc_q = fitz.open(stream=b_pdf.read(), filetype="pdf")
    pix = doc_q[0].get_pixmap(dpi=150)
    doc_q.close()
    return pix.tobytes()

def make_watermark_doc(width=613.44, height=966.24, consecutivo=""):
    """Genera la marca de agua de seguridad oficial en escala muy tenue y profesional"""
    b_pdf = io.BytesIO()
    c = canvas.Canvas(b_pdf, pagesize=(width, height))
    
    # 1. Microtrama diagonal de seguridad tipo papel de seguridad
    c.saveState()
    c.setFillAlpha(0.25)
    c.setFillColor(colors.HexColor("#e2e8f0"))
    c.setFont("Helvetica-Bold", 7.5)
    c.translate(width / 2.0, height / 2.0)
    c.rotate(35)
    phrase = "  •  SERVIR CRC  •  SEGURIDAD Y CONTROL DGSM  •  RESOLUCIÓN 2056 DE 2007  •  DOCUMENTO OFICIAL  •  "
    for y in range(-620, 680, 95):
        c.drawCentredString(0, y, phrase * 2)
    c.restoreState()
    
    # 2. Marca de agua central institucional tenue (color papel de seguridad)
    c.saveState()
    c.translate(width / 2.0, height / 2.0)
    c.rotate(40)
    c.setFillAlpha(0.25)
    c.setFillColor(colors.HexColor("#e2e8f0"))
    c.setFont("Helvetica-Bold", 32)
    c.drawCentredString(0, 36, "DOCUMENTO OFICIAL AUTÉNTICO")
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(0, 8, "RESOLUCIÓN 2056 DE 2007 — DGSM")
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(0, -16, f"CENTRO DE RECONOCIMIENTO SERVIR CRC  •  CONSECUTIVO: {consecutivo}")
    c.restoreState()
    
    c.save()
    b_pdf.seek(0)
    return fitz.open(stream=b_pdf.read(), filetype="pdf")

def create_certificate_pdf(output_path, data):
    """
    Genera el Certificado Médico de Aptitud Psicofísica exactamente igual
    a las 2 páginas oficiales del Anexo de la Resolución 2056 de 2007.
    """
    if not os.path.exists(TEMPLATE_PATH):
        raise FileNotFoundError(f"No se encontró la plantilla oficial en {TEMPLATE_PATH}")

    doc = fitz.open(TEMPLATE_PATH)
    p1 = doc[0]
    p2 = doc[1]

    consecutivo = data.get("numero_certificado", "000125-27-10-2026")
    cod_verif = data.get("codigo_verificacion", "A7X9-K2M4-P8R1")
    nombres = f"{data.get('nombres', '')} {data.get('apellidos', '')}".strip()
    doc_id = data.get("numero_documento", "1020304050")
    tipo_doc = data.get("tipo_documento", "CC")
    fecha_exp = data.get("fecha_expedicion", "27/10/2026")
    fecha_venc = data.get("fecha_vencimiento", "26/12/2026")
    dictamen = data.get("dictamen", "APTO")
    objetivo = data.get("objetivo_label", "PORTE CIVIL DE ARMAS (PRIMERA VEZ)")

    # =========================================================================
    # PÁGINA 1: DATOS INSTITUCIONALES, PERSONALES Y EVALUACIONES PARTE 1
    # =========================================================================
    # 1. Recuadro Superior Izquierdo: Cubrir completamente el texto preimpreso
    p1.draw_rect(fitz.Rect(54, 72, 335, 99), color=(1, 1, 1), fill=(1, 1, 1))
    p1.insert_text(fitz.Point(60, 83), "CENTRO DE RECONOCIMIENTO SERVIR CRC S.A.S.", fontsize=7.5, fontname="hebo", color=(0.05, 0.15, 0.25))
    p1.insert_text(fitz.Point(60, 94), "NIT: 900.876.543-2 • Sede Saravena (Arauca)", fontsize=7, fontname="helv", color=(0.1, 0.1, 0.1))

    # 2. No. Control DGSM
    p1.insert_text(fitz.Point(440, 93), "DGSM-CRC-042", fontsize=10, fontname="hebo", color=(0.12, 0.23, 0.37))

    # 3. Consecutivo No. (Ubicado 3pt arriba de la línea)
    p1.insert_text(fitz.Point(438, 163), consecutivo, fontsize=11, fontname="hebo", color=(0.72, 0.11, 0.11))

    # 4. Datos del Aspirante (Posicionados exactamente sobre las líneas sin cruzarlas)
    p1.insert_text(fitz.Point(155, 193), "MINISTERIO DE DEFENSA NACIONAL / DCCAE", fontsize=8.5, fontname="helv", color=(0, 0, 0))
    p1.insert_text(fitz.Point(215, 211), objetivo, fontsize=8.5, fontname="hebo", color=(0, 0, 0))
    p1.insert_text(fitz.Point(115, 228), fecha_exp, fontsize=8.5, fontname="helv", color=(0, 0, 0))
    p1.insert_text(fitz.Point(125, 245), nombres, fontsize=9, fontname="hebo", color=(0.05, 0.15, 0.25))
    p1.insert_text(fitz.Point(215, 263), "Calle 28 No 20A - 32, Barrio Jardín, Saravena", fontsize=8, fontname="helv", color=(0, 0, 0))
    p1.insert_text(fitz.Point(125, 280), "320 952 2791", fontsize=8, fontname="helv", color=(0, 0, 0))
    p1.insert_text(fitz.Point(355, 280), "320 952 2791", fontsize=8, fontname="helv", color=(0, 0, 0))
    p1.insert_text(fitz.Point(215, 298), "Saravena (Arauca), 15/04/1988", fontsize=8, fontname="helv", color=(0, 0, 0))
    p1.insert_text(fitz.Point(145, 316), "COMERCIANTE / CIVIL", fontsize=8, fontname="helv", color=(0, 0, 0))
    p1.insert_text(fitz.Point(405, 316), "MASCULINO", fontsize=8, fontname="helv", color=(0, 0, 0))
    if tipo_doc == "CC":
        p1.insert_text(fitz.Point(226, 334), "X", fontsize=10, fontname="hebo", color=(0, 0, 0))
    p1.insert_text(fitz.Point(215, 350), doc_id, fontsize=9, fontname="hebo", color=(0, 0, 0))
    p1.insert_text(fitz.Point(235, 368), "Saravena (Arauca)", fontsize=8, fontname="helv", color=(0, 0, 0))

    # 5. Fotografía 3x4 Fondo Azul Registrada
    p1.draw_rect(fitz.Rect(466, 192, 548, 280), color=(0.0, 0.54, 0.52), fill=(0.94, 0.98, 0.99), width=1)
    p1.insert_text(fitz.Point(472, 225), "[ FOTOGRAFÍA ]", fontsize=7.5, fontname="hebo", color=(0.0, 0.45, 0.42))
    p1.insert_text(fitz.Point(473, 238), "Fondo Azul 3x4cm", fontsize=7, fontname="helv", color=(0.3, 0.3, 0.3))
    p1.insert_text(fitz.Point(470, 252), "SERVIR CRC S.A.S.", fontsize=7, fontname="hebo", color=(0.1, 0.2, 0.3))

    # 6. Tabla Capacidad Mental - Personalidad (11 filas perfectamente centradas)
    mental_ys = [486 + i * 7.5 for i in range(11)]
    for y in mental_ys:
        p1.insert_text(fitz.Point(302, y), "N", fontsize=6.5, fontname="helv", color=(0.1, 0.1, 0.1))
        p1.insert_text(fitz.Point(368, y), "S", fontsize=6.5, fontname="hebo", color=(0.1, 0.5, 0.2))
        p1.insert_text(fitz.Point(438, y), "N", fontsize=6.5, fontname="helv", color=(0.1, 0.1, 0.1))
        p1.insert_text(fitz.Point(500, y), "S", fontsize=6.5, fontname="hebo", color=(0.1, 0.5, 0.2))

    p1.insert_text(fitz.Point(120, 608), "Dra. Claudia M. Vega (Psicóloga)", fontsize=7.5, fontname="helv", color=(0, 0, 0))
    p1.insert_text(fitz.Point(305, 608), "Claudia Vega M.", fontsize=7.5, fontname="heit", color=(0.1, 0.1, 0.6))
    p1.insert_text(fitz.Point(460, 608), "PSI-4892 MinSalud", fontsize=7.5, fontname="hebo", color=(0, 0, 0))

    # 7. Tabla Pruebas Psicomotrices (7 filas centradas)
    psico_ys = [688, 696, 704, 712, 720, 728, 736]
    for y in psico_ys:
        p1.insert_text(fitz.Point(302, y), "N", fontsize=6.5, fontname="helv", color=(0.1, 0.1, 0.1))
        p1.insert_text(fitz.Point(368, y), "S", fontsize=6.5, fontname="hebo", color=(0.1, 0.5, 0.2))
        p1.insert_text(fitz.Point(438, y), "N", fontsize=6.5, fontname="helv", color=(0.1, 0.1, 0.1))
        p1.insert_text(fitz.Point(500, y), "S", fontsize=6.5, fontname="hebo", color=(0.1, 0.5, 0.2))

    p1.insert_text(fitz.Point(120, 763), "Lic. Andrea Torres (Psicomotrista)", fontsize=7.5, fontname="helv", color=(0, 0, 0))
    p1.insert_text(fitz.Point(305, 763), "Andrea Torres L.", fontsize=7.5, fontname="heit", color=(0.1, 0.1, 0.6))
    p1.insert_text(fitz.Point(460, 763), "PSI-1029 MinSalud", fontsize=7.5, fontname="hebo", color=(0, 0, 0))

    # 8. Tabla Capacidad Visual (14 filas)
    visual_ys = [842 + i * 8.0 for i in range(14)]
    for y in visual_ys:
        p1.insert_text(fitz.Point(368, y), "S", fontsize=6.5, fontname="hebo", color=(0.1, 0.5, 0.2))
        p1.insert_text(fitz.Point(495, y), "S", fontsize=6.5, fontname="hebo", color=(0.1, 0.5, 0.2))

    # =========================================================================
    # PÁGINA 2: AUDICIÓN, EVALUACIÓN MÉDICA, DICTAMEN, BIOMETRÍA Y SEGURIDAD
    # =========================================================================
    # 1. Profesional de Capacidad Visual
    p2.insert_text(fitz.Point(120, 93), "Dr. Fernando Castro (Optómetra)", fontsize=7.5, fontname="helv", color=(0, 0, 0))
    p2.insert_text(fitz.Point(305, 93), "Fernando Castro", fontsize=7.5, fontname="heit", color=(0.1, 0.1, 0.6))
    p2.insert_text(fitz.Point(460, 93), "OPT-7741 MinSalud", fontsize=7.5, fontname="hebo", color=(0, 0, 0))

    # 2. Rangos de Aprobación Auditivo
    p2.insert_text(fitz.Point(365, 170), "S", fontsize=7, fontname="hebo", color=(0.1, 0.5, 0.2))
    p2.insert_text(fitz.Point(485, 170), "S", fontsize=7, fontname="hebo", color=(0.1, 0.5, 0.2))
    p2.insert_text(fitz.Point(120, 223), "Dra. Sofía Rentería (Audióloga)", fontsize=7.5, fontname="helv", color=(0, 0, 0))
    p2.insert_text(fitz.Point(305, 223), "Sofía Rentería", fontsize=7.5, fontname="heit", color=(0.1, 0.1, 0.6))
    p2.insert_text(fitz.Point(460, 223), "AUD-3310 MinSalud", fontsize=7.5, fontname="hebo", color=(0, 0, 0))

    # 3. Evaluación Médica
    p2.insert_text(fitz.Point(350, 413), "S", fontsize=7.5, fontname="hebo", color=(0.1, 0.5, 0.2))
    p2.insert_text(fitz.Point(480, 413), "S", fontsize=7.5, fontname="hebo", color=(0.1, 0.5, 0.2))
    p2.insert_text(fitz.Point(120, 448), "Dr. Roberto Mendoza (Médico General)", fontsize=7.5, fontname="helv", color=(0, 0, 0))
    p2.insert_text(fitz.Point(305, 448), "Roberto Mendoza", fontsize=7.5, fontname="heit", color=(0.1, 0.1, 0.6))
    p2.insert_text(fitz.Point(460, 448), "MED-9943 MinSalud", fontsize=7.5, fontname="hebo", color=(0, 0, 0))

    # 4. Dictamen Final (APTO / NO APTO) dentro de las casillas correspondientes
    if dictamen == "APTO":
        p2.insert_text(fitz.Point(226, 497), "X", fontsize=12, fontname="hebo", color=(0.08, 0.5, 0.2))
    else:
        p2.insert_text(fitz.Point(385, 497), "X", fontsize=12, fontname="hebo", color=(0.7, 0.1, 0.1))

    # 5. Profesional que en representación de la institución expide el certificado
    p2.insert_text(fitz.Point(135, 556), "Dr. Roberto Mendoza Gómez", fontsize=7.5, fontname="helv", color=(0, 0, 0))
    p2.insert_text(fitz.Point(290, 556), "Dr. Roberto Mendoza Gómez", fontsize=7.5, fontname="heit", color=(0.1, 0.1, 0.6))
    p2.insert_text(fitz.Point(435, 556), "MED-9943 - Director Médico CRC", fontsize=7.5, fontname="hebo", color=(0, 0, 0))

    # 6. Identificación Biométrica del Usuario
    p2.insert_text(fitz.Point(180, 627), nombres, fontsize=8.5, fontname="hebo", color=(0, 0, 0))
    p2.insert_text(fitz.Point(180, 678), nombres.title(), fontsize=9, fontname="heit", color=(0.1, 0.1, 0.6))
    p2.insert_text(fitz.Point(180, 729), f"C.C. {doc_id} de Saravena", fontsize=8.5, fontname="helv", color=(0, 0, 0))

    # 7. Huellas Dactilares biométricas nítidas
    p2.draw_rect(fitz.Rect(375, 622, 461, 720), color=(1, 1, 1), fill=(1, 1, 1))
    p2.draw_rect(fitz.Rect(475, 622, 561, 720), color=(1, 1, 1), fill=(1, 1, 1))
    fp_bytes = make_fingerprint_png()
    p2.insert_image(fitz.Rect(388, 626, 448, 716), stream=fp_bytes)
    p2.insert_image(fitz.Rect(488, 626, 548, 716), stream=fp_bytes)

    # 8. Vigencia (Reemplazando limpiamente DD/MM/AA)
    p2.draw_rect(fitz.Rect(310, 778, 368, 788), color=(1, 1, 1), fill=(1, 1, 1))
    p2.insert_text(fitz.Point(311, 786), fecha_exp, fontsize=8.5, fontname="hebo", color=(0, 0, 0))
    p2.draw_rect(fitz.Rect(430, 775, 498, 788), color=(1, 1, 1), fill=(1, 1, 1))
    p2.insert_text(fitz.Point(432, 786), fecha_venc, fontsize=8.5, fontname="hebo", color=(0.7, 0.1, 0.1))

    # 9. Recuadro Oficial de Validación de Autenticidad y Seguridad Digital (Espacio libre exacto)
    url_verif = f"https://plataforma-servir-crc.vercel.app/verificar?codigo={cod_verif}"
    qr_bytes = make_qr_png(url_verif)
    p2.draw_rect(fitz.Rect(45, 822, 565, 872), color=(0.7, 0.8, 0.85), fill=(0.96, 0.98, 0.99), width=0.8)
    p2.insert_image(fitz.Rect(514, 825, 559, 870), stream=qr_bytes)
    p2.insert_text(fitz.Point(55, 836), "VALIDACIÓN DE AUTENTICIDAD Y SEGURIDAD DIGITAL:", fontsize=7.5, fontname="hebo", color=(0.05, 0.15, 0.25))
    p2.insert_text(fitz.Point(55, 848), "Consulte y verifique en: https://plataforma-servir-crc.vercel.app/verificar", fontsize=7, fontname="helv", color=(0.2, 0.2, 0.2))
    p2.insert_text(fitz.Point(55, 861), f"CÓDIGO DE VERIFICACIÓN: {cod_verif}  •  Expedido en Plataforma Sistematizada SERVIR CRC", fontsize=7, fontname="hebo", color=(0.05, 0.35, 0.35))

    # =========================================================================
    # MARCA DE AGUA DE SEGURIDAD INSTITUCIONAL EN AMBAS PÁGINAS
    # =========================================================================
    doc_wm = make_watermark_doc(consecutivo=consecutivo)
    p1.show_pdf_page(p1.rect, doc_wm, 0, keep_proportion=True)
    p2.show_pdf_page(p2.rect, doc_wm, 0, keep_proportion=True)
    doc_wm.close()

    doc.save(output_path)
    doc.close()
    return output_path

if __name__ == "__main__":
    certs = [
        {
            "filename": "public/certificados/000125-27-10-2026.pdf",
            "numero_certificado": "000125-27-10-2026",
            "codigo_verificacion": "A7X9-K2M4-P8R1",
            "tipo_documento": "CC",
            "numero_documento": "1020304050",
            "nombres": "JUAN CARLOS",
            "apellidos": "PÉREZ GÓMEZ",
            "objetivo_label": "PORTE CIVIL DE ARMAS (PRIMERA VEZ)",
            "fecha_expedicion": "27/10/2026",
            "fecha_vencimiento": "26/12/2026",
            "dictamen": "APTO",
        },
        {
            "filename": "public/certificados/000126-27-10-2026.pdf",
            "numero_certificado": "000126-27-10-2026",
            "codigo_verificacion": "B3Y7-L5N8-Q2S4",
            "tipo_documento": "CC",
            "numero_documento": "52345678",
            "nombres": "MARÍA FERNANDA",
            "apellidos": "RODRÍGUEZ LÓPEZ",
            "objetivo_label": "VIGILANCIA Y SEGURIDAD PRIVADA",
            "fecha_expedicion": "27/10/2026",
            "fecha_vencimiento": "26/12/2026",
            "dictamen": "APTO",
        },
        {
            "filename": "public/certificados/000089-15-08-2026.pdf",
            "numero_certificado": "000089-15-08-2026",
            "codigo_verificacion": "C1Z3-M6P9-R4T7",
            "tipo_documento": "CC",
            "numero_documento": "79123456",
            "nombres": "PEDRO ANTONIO",
            "apellidos": "MARTÍNEZ SILVA",
            "objetivo_label": "PORTE CIVIL DE ARMAS (REVALIDACIÓN)",
            "fecha_expedicion": "15/08/2026",
            "fecha_vencimiento": "14/10/2026",
            "dictamen": "APTO",
        },
        {
            "filename": "public/certificados/000110-10-09-2026.pdf",
            "numero_certificado": "000110-10-09-2026",
            "codigo_verificacion": "D9W2-H4K7-X5N1",
            "tipo_documento": "CC",
            "numero_documento": "80987654",
            "nombres": "CARLOS EDUARDO",
            "apellidos": "GÓMEZ RUIZ",
            "objetivo_label": "PORTE CIVIL DE ARMAS",
            "fecha_expedicion": "10/09/2026",
            "fecha_vencimiento": "09/11/2026",
            "dictamen": "NO APTO",
        },
    ]

    for item in certs:
        out_path = os.path.join(BASE_DIR, item["filename"])
        create_certificate_pdf(out_path, item)
        print(f"Generado Certificado Oficial de 2 páginas: {out_path}")
