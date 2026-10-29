import os
import io
import math
from reportlab.lib.pagesizes import legal
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from PIL import Image, ImageDraw

def make_fingerprint_image():
    """Genera una imagen PNG nítida de huella dactilar biométrica (300 DPI aprox)"""
    w, h = 180, 240
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2 + 15
    for r in range(12, 85, 5):
        bbox = [cx - int(r * 0.72), cy - r, cx + int(r * 0.72), cy + r]
        draw.arc(bbox, start=0, end=360, fill=(30, 41, 59, 210), width=2)
    b = io.BytesIO()
    img.save(b, format="PNG")
    b.seek(0)
    return b

def draw_watermark(c, width, height, consecutivo=""):
    """Dibuja una marca de agua de seguridad institucional en tono ultra-sutil (papel de seguridad)"""
    c.saveState()
    # 1. Microtrama diagonal sutil
    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(colors.HexColor("#f1f5f9"))
    c.translate(width / 2.0, height / 2.0)
    c.rotate(35)
    phrase = "  •  SERVIR CRC  •  SEGURIDAD Y CONTROL DGSM  •  RESOLUCIÓN 2056 DE 2007  •  DOCUMENTO OFICIAL  •  "
    for y in range(-650, 700, 95):
        c.drawCentredString(0, y, phrase * 2)
    c.restoreState()

    # 2. Sello central muy suave
    c.saveState()
    c.translate(width / 2.0, height / 2.0)
    c.rotate(40)
    c.setFillColor(colors.HexColor("#e8edf2"))
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(0, 32, "DOCUMENTO OFICIAL AUTÉNTICO")
    c.setFont("Helvetica-Bold", 17)
    c.drawCentredString(0, 8, "RESOLUCIÓN 2056 DE 2007 – DGSM")
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(0, -14, f"CENTRO DE RECONOCIMIENTO SERVIR CRC  •  CONSECUTIVO: {consecutivo}")
    c.restoreState()

def draw_professional_block(c, x, y, width, nombre, firma, registro):
    """Dibuja el bloque estándar de Profesional de la Salud con líneas para firma"""
    c.setFont("Helvetica-Bold", 6.8)
    c.drawString(x, y + 10, "PROFESIONALES DE LA SALUD QUE INTERVINIERON EN EL PROCESO:")
    
    # Nombre
    c.setFont("Helvetica-Bold", 7)
    c.drawString(x, y - 2, "NOMBRE:")
    c.setFont("Helvetica", 7.5)
    c.drawString(x + 45, y - 2, nombre)
    c.setLineWidth(0.5)
    c.line(x + 42, y - 4, x + 185, y - 4)
    
    # Firma
    c.setFont("Helvetica-Bold", 7)
    c.drawString(x + 195, y - 2, "FIRMA:")
    c.setFont("Helvetica-Oblique", 7.5)
    c.setFillColor(colors.HexColor("#1e3a8a"))
    c.drawString(x + 235, y - 2, firma)
    c.setFillColor(colors.black)
    c.line(x + 230, y - 4, x + 355, y - 4)
    
    # Registro
    c.setFont("Helvetica-Bold", 7)
    c.drawString(x + 365, y - 2, "REGISTRO:")
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(x + 415, y - 2, registro)
    c.line(x + 412, y - 4, x + width, y - 4)

def create_clean_certificate(filepath, data):
    width, height = legal # 612 x 1008
    c = canvas.Canvas(filepath, pagesize=legal)

    consecutivo = data.get("numero_certificado", "000125-27-10-2026")
    cod_verif = data.get("codigo_verificacion", "A7X9-K2M4-P8R1")
    nombres = f"{data.get('nombres', '')} {data.get('apellidos', '')}".strip()
    doc_id = data.get("numero_documento", "1020304050")
    tipo_doc = data.get("tipo_documento", "CC")
    fecha_exp = data.get("fecha_expedicion", "27/10/2026")
    fecha_venc = data.get("fecha_vencimiento", "26/12/2026")
    dictamen = data.get("dictamen", "APTO")
    objetivo = data.get("objetivo_label", "PORTE CIVIL DE ARMAS (PRIMERA VEZ)")

    bx = 35
    by = 35
    bw = 542
    bh = 945

    # =========================================================================
    # PÁGINA 1
    # =========================================================================
    draw_watermark(c, width, height, consecutivo)

    # Nota superior fuera del margen
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx, 988, "Continuación Resolución No. 2056 de Diciembre 10 de 2007/ ANEXO")

    # Borde perimetral exterior
    c.setLineWidth(1.2)
    c.rect(bx, by, bw, bh)

    # 1. Recuadro Institución (Superior Izquierda)
    c.setLineWidth(0.8)
    c.rect(bx + 10, 928, 290, 42)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(bx + 15, 960, "NOMBRE Y/O RAZÓN SOCIAL DE LA INSTITUCIÓN:")
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(bx + 15, 947, "CENTRO DE RECONOCIMIENTO SERVIR CRC S.A.S.")
    c.setFont("Helvetica", 7.2)
    c.drawString(bx + 15, 936, "NIT: 900.876.543-2 • Sede Principal: Saravena (Arauca)")

    # 2. No. Control DGSM (Superior Derecha)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(bx + 325, 950, "No. Control")
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#1e3a5f"))
    c.drawString(bx + 385, 950, data.get("codigo_control", "DGSM-CRC-042"))
    c.setFillColor(colors.black)
    c.setLineWidth(0.6)
    c.line(bx + 380, 946, bx + bw - 15, 946)

    # 3. Título Central del Certificado
    c.setFont("Helvetica-Bold", 10.5)
    c.drawCentredString(width / 2.0, 912, "CERTIFICADO MEDICO DE APTITUD PSICOFISICA PARA")
    c.drawCentredString(width / 2.0, 899, "TENENCIA Y PORTE DE ARMAS DE FUEGO")

    # Consecutivo No. (Ubicado a la derecha, debajo del título)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(bx + 335, 882, "No.")
    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(colors.HexColor("#b91c1c"))
    c.drawString(bx + 365, 882, consecutivo)
    c.setFillColor(colors.black)
    c.line(bx + 360, 878, bx + bw - 15, 878)

    # 4. Formulario de Datos Personales
    # Dimensiones y posición de foto 3x4:
    photo_w = 90
    photo_h = 118
    photo_x = bx + bw - photo_w - 15 # 472
    photo_y = 744 # termina en 862, con 16 pt libres bajo la línea de No. en 878
    
    c.setLineWidth(0.8)
    c.rect(photo_x, photo_y, photo_w, photo_h)
    c.setFont("Helvetica", 6.2)
    c.drawCentredString(photo_x + photo_w / 2.0, photo_y + photo_h - 12, "LOGO DE LA INSTITUCIÓN")
    
    # Placeholder interior de foto
    c.setFillColor(colors.HexColor("#f0fdfa"))
    c.rect(photo_x + 8, photo_y + 18, photo_w - 16, photo_h - 36, fill=1, stroke=1)
    c.setFillColor(colors.HexColor("#008b85"))
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(photo_x + photo_w / 2.0, photo_y + 60, "[ FOTOGRAFÍA ]")
    c.setFont("Helvetica", 6)
    c.drawCentredString(photo_x + photo_w / 2.0, photo_y + 48, "Fondo Azul 3x4cm")
    c.drawCentredString(photo_x + photo_w / 2.0, photo_y + 38, "SERVIR CRC S.A.S.")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(photo_x + photo_w / 2.0, photo_y + 7, "FOTOGRAFIA")

    form_y = 858
    step_y = 16
    left_line_end = photo_x - 12 # 460

    def draw_form_line(label, value, x_start, y_pos, line_end, val_offset=110, is_bold=False, font_size=8):
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(x_start, y_pos, label)
        c.setFont("Helvetica-Bold" if is_bold else "Helvetica", font_size)
        c.drawString(x_start + val_offset, y_pos + 1, str(value))
        c.setLineWidth(0.5)
        c.line(x_start + val_offset - 4, y_pos - 2, line_end, y_pos - 2)

    # Campos 1 a 7 (Lado izquierdo, respetando el recuadro de foto)
    draw_form_line("Solicitado Por:", "MINISTERIO DE DEFENSA NACIONAL / DCCAE", bx + 15, form_y, left_line_end, 75, font_size=7.2)
    form_y -= step_y
    draw_form_line("Objetivo de Certificación:", objetivo, bx + 15, form_y, left_line_end, 120, is_bold=True, font_size=7.2)
    form_y -= step_y
    draw_form_line("Fecha:", fecha_exp, bx + 15, form_y, left_line_end, 50)
    form_y -= step_y
    draw_form_line("Nombre:", nombres, bx + 15, form_y, left_line_end, 50, is_bold=True)
    form_y -= step_y
    draw_form_line("Dirección de Residencia:", "Calle 28 No 20A - 32, Saravena", bx + 15, form_y, left_line_end, 120, font_size=7.5)
    form_y -= step_y

    # Teléfono y Celular
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx + 15, form_y, "Teléfono:")
    c.setFont("Helvetica", 8)
    c.drawString(bx + 65, form_y + 1, "320 952 2791")
    c.line(bx + 60, form_y - 2, bx + 215, form_y - 2)

    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx + 230, form_y, "Cel:")
    c.setFont("Helvetica", 8)
    c.drawString(bx + 255, form_y + 1, "320 952 2791")
    c.line(bx + 250, form_y - 2, left_line_end, form_y - 2)
    form_y -= step_y

    draw_form_line("Lugar y Fecha de Nacimiento:", "Saravena (Arauca), 15/04/1988", bx + 15, form_y, left_line_end, 140, font_size=7.5)
    form_y -= step_y

    # Cargo y Género
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx + 15, form_y, "Cargo/Grado:")
    c.setFont("Helvetica", 7.5)
    c.drawString(bx + 85, form_y + 1, "COMERCIANTE / CIVIL")
    c.line(bx + 80, form_y - 2, bx + 240, form_y - 2)

    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx + 255, form_y, "Género:")
    c.setFont("Helvetica", 8)
    c.drawString(bx + 300, form_y + 1, "MASCULINO")
    c.line(bx + 295, form_y - 2, left_line_end, form_y - 2)
    form_y -= step_y

    # Campos 9 a 11: Ya debajo de la foto, abarcan todo el ancho hasta (bx + bw - 15)
    full_line_end = bx + bw - 15

    # Tipo Documento de Identidad
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx + 15, form_y, "Tipo Documento de Identidad: C.C.")
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(bx + 155, form_y + 1, "X" if tipo_doc == "CC" else "")
    c.line(bx + 150, form_y - 2, bx + 175, form_y - 2)

    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx + 195, form_y, "Otro")
    c.line(bx + 220, form_y - 2, bx + 255, form_y - 2)

    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx + 275, form_y, "Cual")
    c.line(bx + 305, form_y - 2, full_line_end, form_y - 2)
    form_y -= step_y

    # Numero del Documento y Expedido en (con separación limpia)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx + 15, form_y, "Numero del Documento:")
    c.setFont("Helvetica-Bold", 8)
    c.drawString(bx + 125, form_y + 1, doc_id)
    c.line(bx + 120, form_y - 2, bx + 235, form_y - 2)

    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx + 255, form_y, "Expedido en")
    c.setFont("Helvetica", 8)
    c.drawString(bx + 325, form_y + 1, "Saravena (Arauca)")
    c.line(bx + 320, form_y - 2, full_line_end, form_y - 2)

    # 5. Título de Sección de Rangos
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(width / 2.0, 682, "RANGOS DE EVALUACION")
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width / 2.0, 671, "(RESOLUCION No. 2894 DE JULIO 27 DE 2007)")

    # -------------------------------------------------------------------------
    # TABLA 1: CAPACIDAD MENTAL - PERSONALIDAD
    # -------------------------------------------------------------------------
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width / 2.0, 656, "CAPACIDAD MENTAL – PERSONALIDAD")

    tbl_x = bx + 15
    tbl_w = bw - 30
    t1_y = 646

    col_w1 = 185
    col_w2 = 82
    col_w3 = 82
    col_w4 = 82
    col_w5 = 81

    # Header de la tabla
    c.setLineWidth(0.7)
    c.rect(tbl_x, t1_y - 22, tbl_w, 22)
    c.line(tbl_x + col_w1, t1_y - 22, tbl_x + col_w1, t1_y)
    c.line(tbl_x + col_w1 + col_w2 + col_w3, t1_y - 22, tbl_x + col_w1 + col_w2 + col_w3, t1_y)

    c.setFont("Helvetica-Bold", 6.5)
    c.drawCentredString(tbl_x + col_w1 / 2.0, t1_y - 14, "CAPACIDAD MENTAL Y PERSONALIDAD")
    
    # Subheaders Porte Civil
    c.line(tbl_x + col_w1, t1_y - 10, tbl_x + col_w1 + col_w2 + col_w3, t1_y - 10)
    c.drawCentredString(tbl_x + col_w1 + (col_w2 + col_w3) / 2.0, t1_y - 8, "PORTE CIVIL DE ARMAS")
    c.line(tbl_x + col_w1 + col_w2, t1_y - 22, tbl_x + col_w1 + col_w2, t1_y - 10)
    c.setFont("Helvetica-Bold", 5.5)
    c.drawCentredString(tbl_x + col_w1 + col_w2 / 2.0, t1_y - 16, "PRESENTA ALTERACIÓN")
    c.drawCentredString(tbl_x + col_w1 + col_w2 / 2.0, t1_y - 21, "(S/N)")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 / 2.0, t1_y - 16, "PARAMETRO NORMAL")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 / 2.0, t1_y - 21, "(S/N)")

    # Subheaders Seguridad Privada
    c.setFont("Helvetica-Bold", 6.5)
    c.line(tbl_x + col_w1 + col_w2 + col_w3, t1_y - 10, tbl_x + tbl_w, t1_y - 10)
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + (col_w4 + col_w5) / 2.0, t1_y - 8, "SEGURIDAD PRIVADA Y FUERZAS ARMADAS")
    c.line(tbl_x + col_w1 + col_w2 + col_w3 + col_w4, t1_y - 22, tbl_x + col_w1 + col_w2 + col_w3 + col_w4, t1_y - 10)
    c.setFont("Helvetica-Bold", 5.5)
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 / 2.0, t1_y - 16, "PRESENTA ALTERACIÓN")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 / 2.0, t1_y - 21, "(S/N)")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 + col_w5 / 2.0, t1_y - 16, "PARAMETRO NORMAL")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 + col_w5 / 2.0, t1_y - 21, "(S/N)")

    # 11 Filas de Capacidad Mental
    mental_items = [
        "Retraso Mental",
        "Trastornos de estado de Animo",
        "Trastornos de personalidad",
        "Trastorno Disociativo",
        "Esquizofrenia y Trastornos Psicóticos",
        "Demencia",
        "Trastornos de Sueño",
        "Alcoholismo y Dependencia al Alcohol o Psicotrópicos",
        "Otras Patologías",
        "Memoria General",
        "Coeficiente Intelectual",
    ]

    row_h = 8.0
    curr_y = t1_y - 22
    for item in mental_items:
        curr_y -= row_h
        c.rect(tbl_x, curr_y, tbl_w, row_h)
        c.line(tbl_x + col_w1, curr_y, tbl_x + col_w1, curr_y + row_h)
        c.line(tbl_x + col_w1 + col_w2, curr_y, tbl_x + col_w1 + col_w2, curr_y + row_h)
        c.line(tbl_x + col_w1 + col_w2 + col_w3, curr_y, tbl_x + col_w1 + col_w2 + col_w3, curr_y + row_h)
        c.line(tbl_x + col_w1 + col_w2 + col_w3 + col_w4, curr_y, tbl_x + col_w1 + col_w2 + col_w3 + col_w4, curr_y + row_h)

        c.setFont("Helvetica", 6.2)
        c.drawString(tbl_x + 6, curr_y + 2, item)
        c.drawCentredString(tbl_x + col_w1 + col_w2 / 2.0, curr_y + 2, "N")
        c.setFont("Helvetica-Bold", 6.2)
        c.setFillColor(colors.HexColor("#15803d"))
        c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 / 2.0, curr_y + 2, "S")
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 6.2)
        c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 / 2.0, curr_y + 2, "N")
        c.setFont("Helvetica-Bold", 6.2)
        c.setFillColor(colors.HexColor("#15803d"))
        c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 + col_w5 / 2.0, curr_y + 2, "S")
        c.setFillColor(colors.black)

    # Bloque Profesional Psicología
    draw_professional_block(c, tbl_x, curr_y - 18, tbl_w, "Dra. Claudia M. Vega (Psicóloga)", "Claudia Vega M.", "PSI-4892 MinSalud")

    # -------------------------------------------------------------------------
    # TABLA 2: PRUEBAS PSICOMOTRICES
    # -------------------------------------------------------------------------
    t2_y = curr_y - 38
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width / 2.0, t2_y + 6, "PRUEBAS PSICOMOTRICES")

    # Header Pruebas Psicomotrices
    c.setLineWidth(0.7)
    c.rect(tbl_x, t2_y - 20, tbl_w, 20)
    c.line(tbl_x + col_w1, t2_y - 20, tbl_x + col_w1, t2_y)
    c.line(tbl_x + col_w1 + col_w2 + col_w3, t2_y - 20, tbl_x + col_w1 + col_w2 + col_w3, t2_y)

    c.setFont("Helvetica-Bold", 6.5)
    c.drawCentredString(tbl_x + col_w1 / 2.0, t2_y - 12, "PRUEBAS PSICOMOTRICES")

    c.line(tbl_x + col_w1, t2_y - 9, tbl_x + col_w1 + col_w2 + col_w3, t2_y - 9)
    c.drawCentredString(tbl_x + col_w1 + (col_w2 + col_w3) / 2.0, t2_y - 7, "PORTE CIVIL DE ARMAS")
    c.line(tbl_x + col_w1 + col_w2, t2_y - 20, tbl_x + col_w1 + col_w2, t2_y - 9)
    c.setFont("Helvetica-Bold", 5.5)
    c.drawCentredString(tbl_x + col_w1 + col_w2 / 2.0, t2_y - 15, "PRESENTA ALTERACIÓN")
    c.drawCentredString(tbl_x + col_w1 + col_w2 / 2.0, t2_y - 19, "(S/N)")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 / 2.0, t2_y - 15, "CUMPLE RANGO PERCENTIL")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 / 2.0, t2_y - 19, "(S/N)")

    c.setFont("Helvetica-Bold", 6.5)
    c.line(tbl_x + col_w1 + col_w2 + col_w3, t2_y - 9, tbl_x + tbl_w, t2_y - 9)
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + (col_w4 + col_w5) / 2.0, t2_y - 7, "SEGURIDAD PRIVADA Y FUERZAS ARMADAS")
    c.line(tbl_x + col_w1 + col_w2 + col_w3 + col_w4, t2_y - 20, tbl_x + col_w1 + col_w2 + col_w3 + col_w4, t2_y - 9)
    c.setFont("Helvetica-Bold", 5.5)
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 / 2.0, t2_y - 15, "PRESENTA ALTERACIÓN")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 / 2.0, t2_y - 19, "(S/N)")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 + col_w5 / 2.0, t2_y - 15, "CUMPLE RANGO PERCENTIL")
    c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 + col_w5 / 2.0, t2_y - 19, "(S/N)")

    psico_items = [
        ("Atención", "TN"),
        ("", "NE"),
        ("Reacción", "TR"),
        ("", "NE"),
        ("Velocidad", "Desviación"),
        ("Coordinación", "TE"),
        ("", "NE"),
    ]

    curr_y = t2_y - 20
    for area, metric in psico_items:
        curr_y -= row_h
        c.rect(tbl_x, curr_y, tbl_w, row_h)
        c.line(tbl_x + 130, curr_y, tbl_x + 130, curr_y + row_h)
        c.line(tbl_x + col_w1, curr_y, tbl_x + col_w1, curr_y + row_h)
        c.line(tbl_x + col_w1 + col_w2, curr_y, tbl_x + col_w1 + col_w2, curr_y + row_h)
        c.line(tbl_x + col_w1 + col_w2 + col_w3, curr_y, tbl_x + col_w1 + col_w2 + col_w3, curr_y + row_h)
        c.line(tbl_x + col_w1 + col_w2 + col_w3 + col_w4, curr_y, tbl_x + col_w1 + col_w2 + col_w3 + col_w4, curr_y + row_h)

        c.setFont("Helvetica", 6.2)
        c.drawString(tbl_x + 6, curr_y + 2, area)
        c.drawString(tbl_x + 135, curr_y + 2, metric)
        c.drawCentredString(tbl_x + col_w1 + col_w2 / 2.0, curr_y + 2, "N")
        c.setFont("Helvetica-Bold", 6.2)
        c.setFillColor(colors.HexColor("#15803d"))
        c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 / 2.0, curr_y + 2, "S")
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 6.2)
        c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 / 2.0, curr_y + 2, "N")
        c.setFont("Helvetica-Bold", 6.2)
        c.setFillColor(colors.HexColor("#15803d"))
        c.drawCentredString(tbl_x + col_w1 + col_w2 + col_w3 + col_w4 + col_w5 / 2.0, curr_y + 2, "S")
        c.setFillColor(colors.black)

    # Bloque Profesional Psicomotricidad
    draw_professional_block(c, tbl_x, curr_y - 18, tbl_w, "Lic. Andrea Torres (Psicomotrista)", "Andrea Torres L.", "PSI-1029 MinSalud")

    # -------------------------------------------------------------------------
    # TABLA 3: CAPACIDAD VISUAL
    # -------------------------------------------------------------------------
    t3_y = curr_y - 38
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width / 2.0, t3_y + 6, "CAPACIDAD VISUAL")

    col_v1 = 145
    col_v2 = 145
    col_v3 = 111
    col_v4 = 111

    # Header Capacidad Visual
    c.rect(tbl_x, t3_y - 20, tbl_w, 20)
    c.line(tbl_x + col_v1, t3_y - 20, tbl_x + col_v1, t3_y)
    c.line(tbl_x + col_v1 + col_v2, t3_y - 20, tbl_x + col_v1 + col_v2, t3_y)
    c.line(tbl_x + col_v1 + col_v2 + col_v3, t3_y - 20, tbl_x + col_v1 + col_v2 + col_v3, t3_y)

    c.setFont("Helvetica-Bold", 6.5)
    c.drawCentredString(tbl_x + col_v1 / 2.0, t3_y - 13, "CAPACIDAD VISUAL")
    c.drawCentredString(tbl_x + col_v1 + col_v2 / 2.0, t3_y - 13, "RANGO")
    
    # Subheaders con saltos limpios
    c.setFont("Helvetica-Bold", 6.0)
    c.drawCentredString(tbl_x + col_v1 + col_v2 + col_v3 / 2.0, t3_y - 7, "PORTE CIVIL DE ARMAS")
    c.setFont("Helvetica-Bold", 5.2)
    c.drawCentredString(tbl_x + col_v1 + col_v2 + col_v3 / 2.0, t3_y - 15, "SE ADMITE (S/N)")

    c.setFont("Helvetica-Bold", 5.8)
    c.drawCentredString(tbl_x + col_v1 + col_v2 + col_v3 + col_v4 / 2.0, t3_y - 7, "SEGURIDAD PRIVADA Y")
    c.drawCentredString(tbl_x + col_v1 + col_v2 + col_v3 + col_v4 / 2.0, t3_y - 13, "FUERZAS ARMADAS")
    c.setFont("Helvetica-Bold", 5.2)
    c.drawCentredString(tbl_x + col_v1 + col_v2 + col_v3 + col_v4 / 2.0, t3_y - 18, "SE ADMITE (S/N)")

    visual_items = [
        ("Agudeza Visual Lejana (AV)", "AV =<20/30"),
        ("Agudeza Visual Cercana (AV)", "Min.0.75M(20/40)"),
        ("Campo Visual (CV)", "<=120°"),
        ("Visión del Color", "Sin alteraciones"),
        ("Deslumbramiento o Saturación Luminosa", "Sin alteraciones / Max. 3 líneas AV"),
        ("Córnea", "Según valoración"),
        ("Retina", "Según valoración"),
        ("Cristalino", "Según valoración"),
        ("Órbita", "Según valoración"),
        ("Motilidad extrínseca", "Según valoración"),
        ("Afecciones Traumáticas", "Según valoración"),
        ("Fusión", "Sin alteraciones"),
        ("Estereopsis", "Valores <40seg de arco (80%) Visión monocular"),
        ("Agudeza Visual cinética", "=< 20/80"),
    ]

    curr_y = t3_y - 20
    row_hv = 8.2
    for item, rango in visual_items:
        curr_y -= row_hv
        c.rect(tbl_x, curr_y, tbl_w, row_hv)
        c.line(tbl_x + col_v1, curr_y, tbl_x + col_v1, curr_y + row_hv)
        c.line(tbl_x + col_v1 + col_v2, curr_y, tbl_x + col_v1 + col_v2, curr_y + row_hv)
        c.line(tbl_x + col_v1 + col_v2 + col_v3, curr_y, tbl_x + col_v1 + col_v2 + col_v3, curr_y + row_hv)

        c.setFont("Helvetica", 6.2)
        c.drawString(tbl_x + 6, curr_y + 2, item)
        c.drawString(tbl_x + col_v1 + 6, curr_y + 2, rango)
        c.setFont("Helvetica-Bold", 6.2)
        c.setFillColor(colors.HexColor("#15803d"))
        c.drawCentredString(tbl_x + col_v1 + col_v2 + col_v3 / 2.0, curr_y + 2, "S")
        c.drawCentredString(tbl_x + col_v1 + col_v2 + col_v3 + col_v4 / 2.0, curr_y + 2, "S")
        c.setFillColor(colors.black)

    # Fin de Página 1
    c.showPage()

    # =========================================================================
    # PÁGINA 2
    # =========================================================================
    draw_watermark(c, width, height, consecutivo)

    # Nota superior fuera del margen
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(bx, 988, "Continuación Resolución No. 2056 de Diciembre 10 de 2007/ ANEXO")

    # Borde perimetral exterior
    c.setLineWidth(1.2)
    c.rect(bx, by, bw, bh)

    p2_y = 960

    # 1. Bloque Profesional Optometría (Cierre de Capacidad Visual de Pág 1)
    draw_professional_block(c, tbl_x, p2_y - 10, tbl_w, "Dr. Fernando Castro (Optómetra)", "Fernando Castro", "OPT-7741 MinSalud")

    # -------------------------------------------------------------------------
    # TABLA 4: RANGOS DE APROBACION AUDITIVO
    # -------------------------------------------------------------------------
    p2_y -= 40
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width / 2.0, p2_y + 6, "RANGOS DE APROBACION AUDITIVO")

    col_a1 = 120
    col_a2 = 172
    col_a3 = 110
    col_a4 = 110

    # Header Rangos Auditivo
    c.setLineWidth(0.7)
    c.rect(tbl_x, p2_y - 20, tbl_w, 20)
    c.line(tbl_x + col_a1 + col_a2, p2_y - 20, tbl_x + col_a1 + col_a2, p2_y)
    c.line(tbl_x + col_a1 + col_a2 + col_a3, p2_y - 20, tbl_x + col_a1 + col_a2 + col_a3, p2_y)

    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(tbl_x + 8, p2_y - 13, "RANGOS DE APROBACIÓN AUDITIVO")
    c.drawCentredString(tbl_x + col_a1 + col_a2 + col_a3 / 2.0, p2_y - 8, "PORTE CIVIL DE ARMAS")
    c.setFont("Helvetica-Bold", 5.5)
    c.drawCentredString(tbl_x + col_a1 + col_a2 + col_a3 / 2.0, p2_y - 16, "SE ADMITE (S/N)")
    
    # Subheader Seguridad Privada (dividido en 2 líneas para evitar traslape)
    c.setFont("Helvetica-Bold", 5.8)
    c.drawCentredString(tbl_x + col_a1 + col_a2 + col_a3 + col_a4 / 2.0, p2_y - 7, "SEGURIDAD PRIVADA Y")
    c.drawCentredString(tbl_x + col_a1 + col_a2 + col_a3 + col_a4 / 2.0, p2_y - 13, "FUERZAS ARMADAS")
    c.setFont("Helvetica-Bold", 5.2)
    c.drawCentredString(tbl_x + col_a1 + col_a2 + col_a3 + col_a4 / 2.0, p2_y - 18, "SE ADMITE (S/N)")

    # Fila Audición Bilateral
    aud_h = 20
    curr_y = p2_y - 20 - aud_h
    c.rect(tbl_x, curr_y, tbl_w, aud_h)
    c.line(tbl_x + col_a1, curr_y, tbl_x + col_a1, curr_y + aud_h)
    c.line(tbl_x + col_a1 + col_a2, curr_y, tbl_x + col_a1 + col_a2, curr_y + aud_h)
    c.line(tbl_x + col_a1 + col_a2 + col_a3, curr_y, tbl_x + col_a1 + col_a2 + col_a3, curr_y + aud_h)

    c.setFont("Helvetica", 6.2)
    c.drawString(tbl_x + 6, curr_y + 7, "Audición Bilateral")
    c.drawString(tbl_x + col_a1 + 6, curr_y + 11, "PTA >25dB")
    c.drawString(tbl_x + col_a1 + 6, curr_y + 3, "Frecuencia de 4000 a 8000 Hz. = >55dB")
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(colors.HexColor("#15803d"))
    c.drawCentredString(tbl_x + col_a1 + col_a2 + col_a3 / 2.0, curr_y + 7, "S")
    c.drawCentredString(tbl_x + col_a1 + col_a2 + col_a3 + col_a4 / 2.0, curr_y + 7, "S")
    c.setFillColor(colors.black)

    # Bloque Profesional Audiología
    draw_professional_block(c, tbl_x, curr_y - 18, tbl_w, "Dra. Sofía Rentería (Audióloga)", "Sofía Rentería", "AUD-3310 MinSalud")

    # -------------------------------------------------------------------------
    # TABLA 5: EVALUACION MÉDICA
    # -------------------------------------------------------------------------
    med_y = curr_y - 38
    c.setFont("Helvetica-Bold", 8.5)
    c.drawCentredString(width / 2.0, med_y + 6, "EVALUACION MÉDICA")

    # Gran Recuadro de Evaluación Médica
    med_box_h = 135
    med_box_y = med_y - med_box_h
    c.setLineWidth(0.8)
    c.rect(tbl_x, med_box_y, tbl_w, med_box_h)

    # 3 Columnas interiores
    col_m_w = (tbl_w - 20) / 3.0 # ~164 pt
    m_x1 = tbl_x + 7
    m_x2 = m_x1 + col_m_w + 5
    m_x3 = m_x2 + col_m_w + 5

    def draw_med_subtable(title, items, x_pos, y_top, sub_w):
        c.setLineWidth(0.5)
        c.rect(x_pos, y_top - 9, sub_w, 9)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x_pos + 4, y_top - 7, title)
        y_cursor = y_top - 9
        for it in items:
            y_cursor -= 7.5
            c.rect(x_pos, y_cursor, sub_w, 7.5)
            c.setFont("Helvetica", 5.2)
            c.drawString(x_pos + 4, y_cursor + 2, it)
        return y_cursor

    # Columna 1
    y1 = draw_med_subtable("SISTEMA CARDIOVASCULAR", [
        "Insuficiencia Cardiaca",
        "Trastornos del Ritmo",
        "Marcapasos y Desfibrilador automático implantable",
        "Prótesis valvulares cardíacas",
        "Cardiopatía Isquémica",
        "Hipertensión Arterial",
        "Aneurismas de Grandes Vasos"
    ], m_x1, med_y - 5, col_m_w)

    draw_med_subtable("SISTEMA NERVIOSO Y MUSCULAR", [
        "Enfermedades encefálicas medulares y del sistema nervioso",
        "Epilepsias y crisis convulsivas de otras etiologías",
        "Alteraciones del equilibrio",
        "Accidente Isquémico transitorio",
        "Accidentes Isquémicos recurrentes"
    ], m_x1, y1 - 4, col_m_w)

    # Columna 2
    y2 = draw_med_subtable("MOVILIDAD DE LA MANO", [
        "Motilidad",
        "Afecciones o anomalías progresivas"
    ], m_x2, med_y - 5, col_m_w)

    y2 = draw_med_subtable("TRASTORNOS HEMATOLOGICOS", [
        "Trastornos de coagulación",
        "Tratamiento Anticoagulante"
    ], m_x2, y2 - 4, col_m_w)

    draw_med_subtable("SISTEMA RESPIRATORIO", [
        "Disneas",
        "Trastornos del sueño",
        "Otras afecciones",
        "Diabetes Mellitus"
    ], m_x2, y2 - 4, col_m_w)

    # Columna 3
    y3 = draw_med_subtable("SISTEMA RENAL", [
        "Nefropatías",
        "Transplante renal"
    ], m_x3, med_y - 5, col_m_w)

    draw_med_subtable("TRASTORNOS CON SUSTANCIAS Y ALCOHOL", [
        "Abusos de Alcohol",
        "Dependencia del Alcohol",
        "Consumo habitual de drogas y medicamentos",
        "Abuso de drogas y medicamentos",
        "Dependencia de drogas y Medicamentos"
    ], m_x3, y3 - 4, col_m_w)

    # Barra inferior de Criterios Médicos
    c.line(tbl_x, med_box_y + 16, tbl_x + tbl_w, med_box_y + 16)
    c.line(tbl_x + tbl_w / 2.0, med_box_y, tbl_x + tbl_w / 2.0, med_box_y + 16)

    c.setFont("Helvetica-Bold", 6)
    c.drawCentredString(tbl_x + tbl_w / 4.0, med_box_y + 9, "PORTE CIVIL DE ARMAS")
    c.setFont("Helvetica", 5.5)
    c.drawCentredString(tbl_x + tbl_w / 4.0, med_box_y + 3, "SE AJUSTA A CRITERIOS DE EVALUACIÓN MEDICA (S/N):  S")

    c.setFont("Helvetica-Bold", 6)
    c.drawCentredString(tbl_x + 3 * tbl_w / 4.0, med_box_y + 9, "SEGURIDAD PRIVADA Y FUERZAS ARMADAS")
    c.setFont("Helvetica", 5.5)
    c.drawCentredString(tbl_x + 3 * tbl_w / 4.0, med_box_y + 3, "SE AJUSTA A CRITERIOS DE EVALUACIÓN MEDICA (S/N):  S")

    # Bloque Profesional Medicina General
    draw_professional_block(c, tbl_x, med_box_y - 18, tbl_w, "Dr. Roberto Mendoza (Médico General)", "Roberto Mendoza", "MED-9943 MinSalud")

    # -------------------------------------------------------------------------
    # DICTAMEN FINAL OFICIAL
    # -------------------------------------------------------------------------
    dict_y = med_box_y - 48
    c.setFont("Helvetica-Bold", 11)
    c.drawString(bx + 110, dict_y, "APTO:")
    # Casilla APTO
    c.setLineWidth(1.2)
    c.rect(bx + 155, dict_y - 4, 34, 20)
    if dictamen == "APTO":
        c.setFont("Helvetica-Bold", 15)
        c.setFillColor(colors.HexColor("#15803d"))
        c.drawCentredString(bx + 172, dict_y - 1, "X")
        c.setFillColor(colors.black)

    c.setFont("Helvetica-Bold", 11)
    c.drawString(bx + 290, dict_y, "NO APTO:")
    # Casilla NO APTO
    c.rect(bx + 355, dict_y - 4, 34, 20)
    if dictamen != "APTO":
        c.setFont("Helvetica-Bold", 15)
        c.setFillColor(colors.HexColor("#b91c1c"))
        c.drawCentredString(bx + 372, dict_y - 1, "X")
        c.setFillColor(colors.black)

    # -------------------------------------------------------------------------
    # PROFESIONAL QUE EXPIDE EL CERTIFICADO (Director Médico)
    # -------------------------------------------------------------------------
    exp_y = dict_y - 30
    c.setFont("Helvetica-Bold", 7.2)
    c.drawString(tbl_x, exp_y, "PROFESIONAL QUE EN REPRESENTACIÓN DE LA INSTITUCIÓN EXPIDE EL PRESENTE CERTIFICADO DE APTITUD PSICOFISICA:")
    
    # Nombre
    c.setFont("Helvetica-Bold", 7)
    c.drawString(tbl_x, exp_y - 14, "NOMBRE:")
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(tbl_x + 50, exp_y - 14, "Dr. Roberto Mendoza Gómez")
    c.line(tbl_x + 45, exp_y - 16, tbl_x + 185, exp_y - 16)

    # Firma
    c.setFont("Helvetica-Bold", 7)
    c.drawString(tbl_x + 195, exp_y - 14, "FIRMA:")
    c.setFont("Helvetica-Oblique", 7.5)
    c.setFillColor(colors.HexColor("#1e3a8a"))
    c.drawString(tbl_x + 235, exp_y - 14, "Roberto Mendoza G.")
    c.setFillColor(colors.black)
    c.line(tbl_x + 230, exp_y - 16, tbl_x + 350, exp_y - 16)

    # Registro
    c.setFont("Helvetica-Bold", 7)
    c.drawString(tbl_x + 360, exp_y - 14, "REGISTRO:")
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(tbl_x + 410, exp_y - 14, "MED-9943 (Director Médico)")
    c.line(tbl_x + 405, exp_y - 16, tbl_x + tbl_w, exp_y - 16)

    # -------------------------------------------------------------------------
    # IDENTIFICACIÓN BIOMÉTRICA DEL USUARIO (Firmas y Huellas)
    # -------------------------------------------------------------------------
    bio_y = exp_y - 36
    c.setFont("Helvetica-Bold", 7.5)
    c.drawRightString(bx + bw - 15, bio_y, "IDENTIFICACIÓN BIOMÉTRICA DEL USUARIO")

    # Columna Izquierda: Datos y Firma
    draw_form_line("Nombre del Usuario:", nombres, tbl_x, bio_y - 25, tbl_x + 235, 105, is_bold=True)
    draw_form_line("Firma del Usuario:", nombres.title(), tbl_x, bio_y - 58, tbl_x + 235, 95)
    draw_form_line("Identificación:", f"C.C. {doc_id} de Saravena", tbl_x, bio_y - 92, tbl_x + 235, 80)

    # Columna Derecha: Recuadros de Huellas
    h_w = 78
    h_h = 92
    h_y = bio_y - 95
    h_x1 = tbl_x + 265
    h_x2 = h_x1 + h_w + 14

    fp_buf = make_fingerprint_image()

    # Huella Izquierda
    c.setLineWidth(0.8)
    c.rect(h_x1, h_y, h_w, h_h)
    c.drawImage(ImageReader(fp_buf), h_x1 + 10, h_y + 12, width=h_w - 20, height=h_h - 24, mask="auto")
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(h_x1 + h_w / 2.0, h_y - 10, "Índice Izquierdo")

    # Huella Derecha
    c.rect(h_x2, h_y, h_w, h_h)
    fp_buf.seek(0)
    c.drawImage(ImageReader(fp_buf), h_x2 + 10, h_y + 12, width=h_w - 20, height=h_h - 24, mask="auto")
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(h_x2 + h_w / 2.0, h_y - 10, "Índice Derecho")

    # -------------------------------------------------------------------------
    # VIGENCIA REGLAMENTARIA (Ubicada claramente debajo de las huellas)
    # -------------------------------------------------------------------------
    vig_y = h_y - 30
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(tbl_x, vig_y, "VIGENCIA (MAXIMO HASTA 60 DIAS)")
    c.drawString(tbl_x + 215, vig_y, "EXPEDIDO:")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(tbl_x + 270, vig_y, fecha_exp)

    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(tbl_x + 365, vig_y, "VENCE:")
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(colors.HexColor("#b91c1c"))
    c.drawString(tbl_x + 410, vig_y, fecha_venc)
    c.setFillColor(colors.black)

    # Declaración bajo juramento
    c.setFont("Helvetica", 5.5)
    c.drawString(tbl_x, vig_y - 14, "Declaro haber suministrado en forma cierta y veraz la información necesaria para la realización de los exámenes de aptitud psicofísica y asumo la responsabilidad")
    c.drawString(tbl_x, vig_y - 21, "de las consecuencias que se generen como resultado de tal información.")

    # -------------------------------------------------------------------------
    # RECUADRO DE VALIDACIÓN Y AUTENTICIDAD DIGITAL (QR + CÓDIGO)
    # -------------------------------------------------------------------------
    sec_y = vig_y - 75
    sec_h = 48
    c.setLineWidth(0.8)
    c.setStrokeColor(colors.HexColor("#008b85"))
    c.setFillColor(colors.HexColor("#f0fdfa"))
    c.rect(tbl_x, sec_y, tbl_w, sec_h, fill=1, stroke=1)
    c.setFillColor(colors.black)
    c.setStrokeColor(colors.black)

    # Código QR Scannable
    url_verif = f"https://plataforma-servir-crc.vercel.app/verificar?codigo={cod_verif}"
    qr_code = qr.QrCodeWidget(url_verif)
    bounds = qr_code.getBounds()
    qr_w = bounds[2] - bounds[0]
    qr_h = bounds[3] - bounds[1]
    qr_drawing = Drawing(40, 40, transform=[40.0 / qr_w, 0, 0, 40.0 / qr_h, 0, 0])
    qr_drawing.add(qr_code)
    renderPDF.draw(qr_drawing, c, tbl_x + tbl_w - 46, sec_y + 4)

    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(colors.HexColor("#0c232e"))
    c.drawString(tbl_x + 12, sec_y + 34, "VALIDACIÓN DE AUTENTICIDAD Y SEGURIDAD DIGITAL:")
    c.setFont("Helvetica", 6.8)
    c.setFillColor(colors.HexColor("#334155"))
    c.drawString(tbl_x + 12, sec_y + 22, "Consulte y verifique en línea en: https://plataforma-servir-crc.vercel.app/verificar")
    c.setFont("Helvetica-Bold", 7.2)
    c.setFillColor(colors.HexColor("#008b85"))
    c.drawString(tbl_x + 12, sec_y + 10, f"CÓDIGO DE VERIFICACIÓN: {cod_verif}  •  Expedido en Plataforma Sistematizada SERVIR CRC")
    c.setFillColor(colors.black)

    # -------------------------------------------------------------------------
    # OBSERVACIONES (Los 7 numerales legales completos)
    # -------------------------------------------------------------------------
    obs_y = sec_y - 12
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(tbl_x, obs_y, "OBSERVACIONES:")

    observaciones = [
        "1. El buen uso de este documento es responsabilidad exclusiva de la persona certificada, que declara expresamente y bajo juramento no utilizarlo ni emplearlo en fines ilícitos, fraudulentos o para fines distintos al objeto de esta certificación.",
        "2. La información contenida en este documento ni las fechas podrán ser cambiadas, modificadas, adulteradas o suplantadas. El uso indebido dará lugar a las acciones y sanciones legales correspondientes.",
        "3. El presente documento deberá ser renovado, una vez vencido el límite máximo de vigencia que es de 60 días contados a partir de la fecha de su expedición.",
        "4. La información obtenida por la Institución con ocasión de la realización de las pruebas gozará de la reserva y confidencialidad correspondiente, salvo las excepciones legales y/o cuando sean requeridos por autoridades o instituciones competentes.",
        "5. El presente certificado deberá ser registrado en la base de datos del Ministerio de Defensa Nacional-Departamento de Control Comercio de Armas, Municiones y explosivos, así como en la base de datos de la Dirección General de Sanidad Militar en los términos señalados en el Decreto 2858 de 2007 o normas que lo modifiquen.",
        "6. El presente Certificado es válido para los fines previstos en el artículo 11 de la Ley 1119 de 2006 y Decreto 2858 de 2007.",
        "7. En caso de pérdida de este documento el usuario deberá de manera inmediata instaurar la respectiva denuncia ante las autoridades correspondientes e informar a la Institución para que se proceda a expedir un nuevo Certificado."
    ]

    curr_obs_y = obs_y - 8
    c.setFont("Helvetica", 4.8)
    for obs in observaciones:
        words = obs.split()
        line = ""
        for w in words:
            test_line = f"{line} {w}".strip()
            if c.stringWidth(test_line, "Helvetica", 4.8) < tbl_w:
                line = test_line
            else:
                c.drawString(tbl_x, curr_obs_y, line)
                curr_obs_y -= 6.2
                line = w
        if line:
            c.drawString(tbl_x, curr_obs_y, line)
            curr_obs_y -= 7.0

    c.save()
    return filepath

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

    base_dir = os.path.dirname(os.path.abspath(__file__))
    for item in certs:
        out_path = os.path.join(base_dir, item["filename"])
        create_clean_certificate(out_path, item)
        print(f"Generado Certificado Vectorial Limpio: {out_path}")
