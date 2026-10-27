-- CreateTable
CREATE TABLE "crcs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "codigo_control" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "certificados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "crc_id" TEXT NOT NULL,
    "numero_certificado" TEXT NOT NULL,
    "codigo_verificacion" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dictamen" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "fecha_expedicion" DATETIME NOT NULL,
    "fecha_vencimiento" DATETIME NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'VIGENTE',
    "pdf_path" TEXT NOT NULL,
    "qr_token" TEXT,
    "sincronizado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "certificados_crc_id_fkey" FOREIGN KEY ("crc_id") REFERENCES "crcs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "crc_id" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creada_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "api_keys_crc_id_fkey" FOREIGN KEY ("crc_id") REFERENCES "crcs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usuarios_panel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'SECCIONAL',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "logs_consulta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificado_id" TEXT,
    "tipo_accion" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "detalles" TEXT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "logs_consulta_certificado_id_fkey" FOREIGN KEY ("certificado_id") REFERENCES "certificados" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "crcs_codigo_control_key" ON "crcs"("codigo_control");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_numero_certificado_key" ON "certificados"("numero_certificado");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_codigo_verificacion_key" ON "certificados"("codigo_verificacion");

-- CreateIndex
CREATE INDEX "certificados_numero_documento_idx" ON "certificados"("numero_documento");

-- CreateIndex
CREATE INDEX "certificados_estado_idx" ON "certificados"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_panel_email_key" ON "usuarios_panel"("email");
