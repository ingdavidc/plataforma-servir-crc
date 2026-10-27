import os
from reportlab.lib.pagesizes import legal
from reportlab.pdfgen import canvas
from reportlab.lib import colors

def create_certificate_pdf(filepath, data):
    c = canvas.Canvas(filepath, pagesize=legal)
    width, height = legal # 612 x 1008 points (oficio)

    # Margins and header
    c.setLineWidth(1)
    c.rect(30, 30, width - 60, height - 60) # Outer border

    # Header title
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(width / 2.0, height - 55, "REPÚBLICA DE COLOMBIA")
    c.drawCentredString(width / 2.0, height - 70, "MINISTERIO DE DEFENSA NACIONAL - DIRECCIÓN GENERAL DE SANIDAD MILITAR")
    c.setFont("Helvetica", 8)
    c.drawCentredString(width / 2.0, height - 85, "RESOLUCIÓN NÚMERO 2056 DE 2007 - ANEXO")
    
    # Institution Name & Control No
    c.setLineWidth(0.8)
    c.rect(40, height - 145, width - 80, 50)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(45, height - 105, "INSTITUCIÓN:")
    c.setFont("Helvetica", 9)
    c.drawString(130, height - 105, data.get("institucion", "CENTRO DE RECONOCIMIENTO SERVIR CRC S.A.S."))
    
    c.setFont("Helvetica-Bold", 9)
    c.drawString(45, height - 120, "NIT:")
    c.setFont("Helvetica", 9)
    c.drawString(130, height - 120, data.get("nit", "900.876.543-2"))
    
    c.setFont("Helvetica-Bold", 9)
    c.drawString(400, height - 105, "No. CONTROL DGSM:")
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#1e3a5f"))
    c.drawString(510, height - 105, data.get("codigo_control", "DGSM-CRC-042"))
    
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(400, height - 125, "CONSECUTIVO No.:")
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#b91c1c"))
    c.drawString(510, height - 125, data.get("numero_certificado", "000000-00-00-0000"))
    c.setFillColor(colors.black)

    # Document Title
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(colors.HexColor("#1e3a5f"))
    c.drawCentredString(width / 2.0, height - 165, "CERTIFICADO MÉDICO DE APTITUD PSICOFÍSICA")
    c.drawCentredString(width / 2.0, height - 178, "PARA TENENCIA Y PORTE DE ARMAS DE FUEGO")
    c.setFillColor(colors.black)

    # Photo Box (Top right per Res. 2056)
    c.rect(width - 130, height - 290, 85, 100) # 3x4 approx
    c.setFont("Helvetica", 7)
    c.drawCentredString(width - 87, height - 235, "[ FOTOGRAFÍA ]")
    c.drawCentredString(width - 87, height - 245, "Fondo Azul 3x4cm")
    c.drawCentredString(width - 87, height - 255, "Con Logo Institución")

    # Aspirant Personal Info
    y = height - 210
    c.setFont("Helvetica-Bold", 8)
    c.drawString(45, y, "NOMBRE COMPLETO:")
    c.setFont("Helvetica", 9)
    c.drawString(160, y, f"{data.get('nombres', '')} {data.get('apellidos', '')}")

    y -= 18
    c.setFont("Helvetica-Bold", 8)
    c.drawString(45, y, "DOCUMENTO DE IDENTIDAD:")
    c.setFont("Helvetica", 9)
    c.drawString(180, y, f"{data.get('tipo_documento', 'CC')} {data.get('numero_documento', '')}")

    y -= 18
    c.setFont("Helvetica-Bold", 8)
    c.drawString(45, y, "OBJETIVO CERTIFICACIÓN:")
    c.setFont("Helvetica", 9)
    c.drawString(180, y, data.get("objetivo_label", "PORTE CIVIL DE ARMAS"))

    y -= 18
    c.setFont("Helvetica-Bold", 8)
    c.drawString(45, y, "FECHA DE EXPEDICIÓN:")
    c.setFont("Helvetica", 9)
    c.drawString(180, y, data.get("fecha_expedicion", ""))

    y -= 18
    c.setFont("Helvetica-Bold", 8)
    c.drawString(45, y, "FECHA DE VENCIMIENTO:")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(180, y, data.get("fecha_vencimiento", ""))

    # Clinical Evaluations Summary Box (Res. 2894 de 2007)
    y -= 45
    c.setFont("Helvetica-Bold", 9)
    c.drawString(45, y, "RESULTADO DE EVALUACIONES CLÍNICAS (RESOLUCIÓN 2894 DE 2007)")
    
    y -= 15
    c.setLineWidth(0.5)
    c.rect(40, y - 110, width - 80, 120)
    
    # Table header
    c.line(40, y - 5, width - 40, y - 5)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(50, y, "ÁREA DE EVALUACIÓN")
    c.drawString(240, y, "PROFESIONAL")
    c.drawString(380, y, "REGISTRO")
    c.drawString(480, y, "CRITERIO")

    evals = [
        ("1. Capacidad Mental y Personalidad", "Dra. Claudia M. Vega (Psicóloga)", "PSI-4892", "NORMAL"),
        ("2. Pruebas Psicomotrices (Equipo)", "Lic. Andrea Torres (Psicomotrista)", "PSI-1029", "ADMITIDO"),
        ("3. Capacidad Visual (Optometría)", "Dr. Fernando Castro (Optómetra)", "OPT-7741", "ADMITIDO"),
        ("4. Capacidad Auditiva (Audiometría)", "Dra. Sofía Rentería (Audióloga)", "AUD-3310", "ADMITIDO"),
        ("5. Evaluación Médica General", "Dr. Roberto Mendoza (Médico General)", "MED-9943", "AJUSTADO"),
    ]

    for i, (area, prof, reg, crit) in enumerate(evals):
        row_y = y - 22 - (i * 18)
        c.setFont("Helvetica", 7.5)
        c.drawString(50, row_y, area)
        c.drawString(240, row_y, prof)
        c.drawString(380, row_y, reg)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(480, row_y, crit)

    # FINAL DICTAMEN
    y = y - 145
    c.setLineWidth(1.5)
    c.rect(40, y - 35, width - 80, 50)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(60, y - 8, "DICTAMEN FINAL:")
    
    dictamen = data.get("dictamen", "APTO")
    if dictamen == "APTO":
        c.setFillColor(colors.HexColor("#15803d"))
    else:
        c.setFillColor(colors.HexColor("#b91c1c"))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(200, y - 12, f"● {dictamen} ●")
    c.setFillColor(colors.black)

    # Biometric Signature Area
    y = y - 90
    c.setFont("Helvetica-Bold", 8)
    c.drawString(50, y, "IDENTIFICACIÓN BIOMÉTRICA DEL USUARIO")
    
    # Left Fingerprint
    c.rect(50, y - 90, 80, 80)
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(90, y - 85, "Índice Izquierdo")
    
    # Right Fingerprint
    c.rect(150, y - 90, 80, 80)
    c.drawCentredString(190, y - 85, "Índice Derecho")

    # User signature
    c.line(260, y - 50, 410, y - 50)
    c.drawCentredString(335, y - 62, "Firma del Usuario")
    c.drawCentredString(335, y - 72, f"C.C. {data.get('numero_documento', '')}")

    # Doctor signature
    c.line(440, y - 50, 560, y - 50)
    c.drawCentredString(500, y - 62, "Firma Director Médico")
    c.drawCentredString(500, y - 72, "Representante Legal CRC")

    # Security Verification Box & Code
    y = y - 160
    c.setLineWidth(1)
    c.setFillColor(colors.HexColor("#f8fafc"))
    c.rect(40, y - 30, width - 80, 55, fill=1)
    c.setFillColor(colors.black)
    
    c.setFont("Helvetica-Bold", 8)
    c.drawString(50, y + 10, "VALIDACIÓN DE AUTENTICIDAD Y SEGURIDAD DIGITAL:")
    c.setFont("Helvetica", 7.5)
    c.drawString(50, y - 5, "Consulte y verifique la vigencia de este certificado en:")
    c.setFont("Helvetica-Bold", 8)
    c.drawString(280, y - 5, "https://servircrc.com/verificar")
    
    c.setFont("Helvetica-Bold", 8)
    c.drawString(50, y - 20, "CÓDIGO DE VERIFICACIÓN:")
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#1e3a5f"))
    c.drawString(185, y - 20, data.get("codigo_verificacion", ""))
    c.setFillColor(colors.black)

    # Footer note
    c.setFont("Helvetica", 6.5)
    c.drawString(45, 45, "Resolución 2056 de 2007 MinDefensa - DGSM. Validez máxima de hasta sesenta (60) días calendario.")
    c.drawRightString(width - 45, 45, "Impreso en Sistema Sistematizado SERVIR CRC")

    c.save()

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
        out_path = os.path.join(r"c:\Users\LENOVO\OneDrive\Documents\PLATAFORMA SERVIR CRC\plataforma-servir-crc", item["filename"])
        create_certificate_pdf(out_path, item)
        print(f"Generado PDF: {out_path}")
