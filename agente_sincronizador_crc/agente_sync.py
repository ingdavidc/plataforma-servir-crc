#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AGENTE DE SINCRONIZACIÓN LOCAL - SERVIR CRC
Resolución 2056 de 2007 (Sanidad Militar & DCCAE)

Vigila la carpeta local donde el software del CRC expide los certificados PDF
y los transmite automáticamente al servidor web en línea.
"""

import os
import sys
import time
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import shutil
import mimetypes
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CONFIG_FILE = BASE_DIR / "config.json"
CARPETA_LOCAL = BASE_DIR / "carpeta_local_certificados"
CARPETA_SYNC = BASE_DIR / "sincronizados"
CARPETA_ERROR = BASE_DIR / "errores"

def load_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "servidor_api_url": "http://localhost:3000/api/certificados/sync",
        "codigo_control_crc": "DGSM-CRC-042",
        "intervalo_segundos": 5,
    }

def parse_filename(filename):
    """
    Formato esperado:
    {consecutivo}_{tipo_doc}_{num_doc}_{dictamen}_{nombres_apellidos}.pdf
    Ejemplo: 000127-27-10-2026_CC_1015487920_APTO_JORGE ELIECER GAITAN.pdf
    """
    stem = Path(filename).stem
    parts = stem.split("_")
    
    if len(parts) >= 5:
        return {
            "numeroCertificado": parts[0].strip(),
            "tipoDocumento": parts[1].strip().upper(),
            "numeroDocumento": parts[2].strip(),
            "dictamen": parts[3].strip().upper(),
            "nombres": parts[4].strip().upper(),
            "apellidos": " ".join(parts[5:]).strip().upper() if len(parts) > 5 else "",
            "objetivo": "PORTE_CIVIL",
        }
    elif len(parts) >= 3:
        # Formato abreviado: consecutivo_numdoc_nombres.pdf
        return {
            "numeroCertificado": parts[0].strip(),
            "tipoDocumento": "CC",
            "numeroDocumento": parts[1].strip(),
            "dictamen": "APTO",
            "nombres": parts[2].strip().upper(),
            "apellidos": "",
            "objetivo": "PORTE_CIVIL",
        }
    else:
        # Si el nombre solo es el consecutivo
        return {
            "numeroCertificado": stem.strip(),
            "tipoDocumento": "CC",
            "numeroDocumento": "00000000",
            "dictamen": "APTO",
            "nombres": "USUARIO EVALUADO",
            "apellidos": "",
            "objetivo": "PORTE_CIVIL",
        }

def upload_certificate(api_url, codigo_control, filepath, meta):
    """
    Envía el archivo PDF y sus metadatos usando multipart/form-data nativo de Python.
    """
    boundary = "----ServirCrcBoundary" + str(int(time.time() * 1000))
    body = bytearray()

    fields = {
        "numeroCertificado": meta.get("numeroCertificado", ""),
        "tipoDocumento": meta.get("tipoDocumento", "CC"),
        "numeroDocumento": meta.get("numeroDocumento", ""),
        "nombres": meta.get("nombres", ""),
        "apellidos": meta.get("apellidos", ""),
        "dictamen": meta.get("dictamen", "APTO"),
        "objetivo": meta.get("objetivo", "PORTE_CIVIL"),
        "codigoControl": codigo_control,
        "fechaExpedicion": datetime.now().strftime("%Y-%m-%d"),
    }

    # Adjuntar campos de texto
    for key, val in fields.items():
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{key}"\r\n\r\n'.encode("utf-8"))
        body.extend(f"{val}\r\n".encode("utf-8"))

    # Adjuntar archivo PDF
    filename = os.path.basename(filepath)
    with open(filepath, "rb") as f:
        file_bytes = f.read()

    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="pdf"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(b"Content-Type: application/pdf\r\n\r\n")
    body.extend(file_bytes)
    body.extend(b"\r\n")
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(
        api_url,
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "ServirCRC-SyncAgent/1.0",
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=30) as resp:
        res_data = resp.read().decode("utf-8")
        return json.loads(res_data)

def run_sync_cycle(config):
    api_url = config.get("servidor_api_url")
    codigo_control = config.get("codigo_control_crc", "DGSM-CRC-042")

    archivos = [f for f in CARPETA_LOCAL.glob("*.pdf") if f.is_file()]
    if not archivos:
        return 0

    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Detectados {len(archivos)} certificado(s) pendientes...")
    sincronizados = 0

    for file_path in archivos:
        try:
            # Comprobar si el archivo está listo (no está bloqueado por el software CRC escribiendo)
            time.sleep(0.5)
            meta = parse_filename(file_path.name)
            print(f" -> Procesando: {file_path.name}")
            print(f"    Consecutivo: {meta['numeroCertificado']} | Titular: {meta['nombres']} | Dictamen: {meta['dictamen']}")

            res = upload_certificate(api_url, codigo_control, file_path, meta)
            
            if res.get("status") == "ok":
                cod_verif = res.get("certificado", {}).get("codigoVerificacion", "OK")
                print(f"    [OK] Sincronizado en la nube! Código de Verificación asignado: {cod_verif}")
                # Mover a sincronizados
                destino = CARPETA_SYNC / file_path.name
                shutil.move(str(file_path), str(destino))
                sincronizados += 1
            else:
                print(f"    [ERROR] El servidor respondió: {res.get('error')}")
                destino_err = CARPETA_ERROR / file_path.name
                shutil.move(str(file_path), str(destino_err))

        except urllib.error.URLError as e:
            print(f"    [CONEXIÓN FALLIDA] No se pudo conectar al servidor ({api_url}): {e.reason}")
            print("    El certificado permanecerá en la carpeta para reintento automático.")
        except Exception as e:
            print(f"    [ERROR INESPERADO]: {e}")

    return sincronizados

def main():
    print("=" * 70)
    print("  SERVIR CRC - AGENTE LOCAL DE SINCRONIZACIÓN DE CERTIFICADOS")
    print("  Resolución 2056 de 2007 (Sanidad Militar & DCCAE)")
    print("=" * 70)

    config = load_config()
    print(f"-> Servidor destino : {config.get('servidor_api_url')}")
    print(f"-> Código CRC DGSM  : {config.get('codigo_control_crc')}")
    print(f"-> Carpeta vigilada : {CARPETA_LOCAL}")
    print(f"-> Intervalo chequeo: {config.get('intervalo_segundos')} segundos")
    print("-" * 70)
    print("Vigilando carpeta... (Presione Ctrl+C para detener)")

    while True:
        try:
            run_sync_cycle(config)
            time.sleep(config.get("intervalo_segundos", 5))
        except KeyboardInterrupt:
            print("\nAgente detenido por el usuario.")
            sys.exit(0)
        except Exception as e:
            print(f"Error en ciclo: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
