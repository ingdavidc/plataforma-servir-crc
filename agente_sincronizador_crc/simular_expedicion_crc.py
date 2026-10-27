#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SIMULADOR DE EXPEDICIÓN DE CERTIFICADO CRC
Genera un PDF idéntico al Anexo de la Resolución 2056 de 2007
y lo deposita en 'carpeta_local_certificados' para simular que el
software del CRC acaba de expedir un nuevo certificado.
"""

import os
import sys
import random

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import legal
from reportlab.pdfgen import canvas
from reportlab.lib import colors

BASE_DIR = Path(__file__).resolve().parent
DESTINO = BASE_DIR / "carpeta_local_certificados"

NOMBRES_PRUEBA = [
    ("CARLOS ANDRES", "GUTIERREZ SILVA", "1018456123"),
    ("DIANA PATRICIA", "MORENO VARGAS", "52987123"),
    ("GUSTAVO ADOLFO", "QUINTERO MEJIA", "80456789"),
    ("LILIANA PAOLA", "HERRERA DUARTE", "1023456789"),
]

def generar_pdf_simulado():
    nombres, apellidos, doc = random.choice(NOMBRES_PRUEBA)
    hoy = datetime.now()
    fecha_str = hoy.strftime("%d-%m-%Y")
    
    # Consecutivo de 6 dígitos + DD-MM-AAAA
    num_consecutivo = random.randint(130, 999)
    consecutivo = f"{num_consecutivo:06d}-{fecha_str}"
    dictamen = "APTO"

    # Formato de nombre de archivo
    # {consecutivo}_{tipo_doc}_{num_doc}_{dictamen}_{nombres_apellidos}.pdf
    filename = f"{consecutivo}_CC_{doc}_{dictamen}_{nombres}_{apellidos}.pdf"
    filepath = DESTINO / filename

    c = canvas.Canvas(str(filepath), pagesize=legal)
    width, height = legal

    # Borde exterior
    c.rect(30, 30, width - 60, height - 60)

    # Encabezado
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(width / 2.0, height - 55, "REPÚBLICA DE COLOMBIA")
    c.drawCentredString(width / 2.0, height - 70, "MINISTERIO DE DEFENSA NACIONAL - DIRECCIÓN GENERAL DE SANIDAD MILITAR")
    c.setFont("Helvetica", 8)
    c.drawCentredString(width / 2.0, height - 85, "RESOLUCIÓN NÚMERO 2056 DE 2007 - ANEXO")

    # Institución
    c.rect(40, height - 145, width - 80, 50)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(45, height - 105, "INSTITUCIÓN:")
    c.setFont("Helvetica", 9)
    c.drawString(130, height - 105, "CENTRO DE RECONOCIMIENTO SERVIR CRC S.A.S.")
    
    c.setFont("Helvetica-Bold", 9)
    c.drawString(400, height - 105, "No. CONTROL DGSM:")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(510, height - 105, "DGSM-CRC-042")

    c.setFont("Helvetica-Bold", 9)
    c.drawString(400, height - 125, "CONSECUTIVO No.:")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(510, height - 125, consecutivo)

    # Título
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(width / 2.0, height - 170, "CERTIFICADO MÉDICO DE APTITUD PSICOFÍSICA")

    # Datos
    y = height - 210
    c.setFont("Helvetica-Bold", 8)
    c.drawString(45, y, "NOMBRE COMPLETO:")
    c.setFont("Helvetica", 9)
    c.drawString(160, y, f"{nombres} {apellidos}")

    y -= 20
    c.drawString(45, y, "DOCUMENTO DE IDENTIDAD:")
    c.setFont("Helvetica", 9)
    c.drawString(180, y, f"CC {doc}")

    y -= 20
    c.drawString(45, y, "DICTAMEN FINAL:")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(180, y, f"● {dictamen} ●")

    y -= 50
    c.setFont("Helvetica", 8)
    c.drawString(45, y, "Resolución 2056 de 2007 - Vigencia máxima 60 días calendario.")

    c.save()
    print(f"✅ Nuevo Certificado expedido y guardado en carpeta local:")
    print(f"   Archivo: {filename}")
    print(f"   Titular: {nombres} {apellidos} (CC {doc})")
    print(f"   Consecutivo: {consecutivo}")
    return filepath

if __name__ == "__main__":
    generar_pdf_simulado()
