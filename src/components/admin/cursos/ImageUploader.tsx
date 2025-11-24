/**
 * Componente: ImageUploader
 * Version: v1.0 (Local Storage)
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Subida de imágenes a carpeta local con preview
 */

'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  currentImage?: string | null;
  onImageUploaded: (url: string) => void;
}

export default function ImageUploader({
  currentImage,
  onImageUploaded,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones del lado del cliente
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida (JPG, PNG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 5MB');
      return;
    }

    setError(null);
    setUploading(true);
    setUploadSuccess(false);

    try {
      // Crear preview local inmediato
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Subir al servidor
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      
      // Actualizar con la URL del servidor
      setPreview(data.url);
      onImageUploaded(data.url);
      setUploadSuccess(true);

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Error al subir la imagen');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    setUploadSuccess(false);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Imagen del Curso
      </label>

      {/* Área de subida o preview */}
      {!preview ? (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            uploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 cursor-pointer hover:border-red-500 hover:bg-red-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
              <p className="text-gray-600 font-semibold">Subiendo imagen...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold mb-2">
                Click para subir imagen
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, WEBP hasta 5MB
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="relative group">
          {/* Preview de imagen */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
            <Image
              src={preview}
              alt="Preview del curso"
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                console.error('Error loading image');
                setError('Error al cargar la imagen');
              }}
            />
          </div>

          {/* Overlay con acciones */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>

          {/* Estado de subida */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="font-semibold">Subiendo imagen...</p>
              </div>
            </div>
          )}

          {/* Mensaje de éxito */}
          {uploadSuccess && !uploading && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
              <Check className="w-5 h-5" />
              <span className="font-semibold">Imagen subida</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-700 text-sm font-semibold">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Información */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <ImageIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700">
            <p className="font-semibold mb-1">Recomendaciones:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Tamaño recomendado: 1200x630px</li>
              <li>Formato: JPG, PNG o WEBP</li>
              <li>Peso máximo: 5MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}