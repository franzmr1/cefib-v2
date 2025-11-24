/**
 * API Route: Upload de Imágenes Local
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Subida de imágenes a carpeta public/uploads/cursos
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

/**
 * POST - Subir imagen
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Solo se permiten imágenes' },
        { status: 400 }
      );
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La imagen debe pesar menos de 5MB' },
        { status: 400 }
      );
    }

    // Convertir a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar nombre único y seguro
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    const safeName = nameWithoutExt.replace(/[^a-z0-9-]/g, '');
    const uniqueName = `${timestamp}-${safeName}${extension}`;

    // Ruta completa del archivo
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cursos');
    const filePath = path.join(uploadsDir, uniqueName);

    // Crear directorio si no existe
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Guardar archivo
    await writeFile(filePath, buffer);

    // URL pública para acceder a la imagen
    const publicUrl = `/uploads/cursos/${uniqueName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: uniqueName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
      { status: 500 }
    );
  }
}