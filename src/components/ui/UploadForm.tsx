'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface UploadFormProps {
  ticketId: number;
  onConfirmarEntrada: () => void;  // Recibimos la función como prop
  detenerTemporizador: () => void;  // Recibimos la función para detener el temporizador
}

export default function UploadForm({ ticketId, onConfirmarEntrada, detenerTemporizador }: UploadFormProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    } else {
      setPdfFile(null);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    } else {
      setVideoFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdfFile && !videoFile) {
      setError("No se ha seleccionado ningún archivo.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    if (pdfFile) formData.append("file", pdfFile);  // Subir el archivo PDF
    if (videoFile) formData.append("video", videoFile);  // Subir el archivo de video
    formData.append("ticketId", ticketId.toString());  // Añadir el ticketId

    try {
      const response = await fetch("/api/subidaSupabase", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setFileUrl(data.fileUrl); // URL del PDF
        setVideoUrl(data.videoUrl); // URL del video (si se subió)
      }
    } catch (err) {
      console.error("Error uploading files:", err);
      setError("Ocurrió un error al subir los archivos.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          <span className="text-black">Subir Entrada</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo para subir PDF */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Seleccionar archivo PDF
                <input
                  id="pdf-upload"
                  type="file"
                  className="sr-only"
                  onChange={handlePdfChange}
                  accept=".pdf"
                />
              </label>
              <span className="text-sm text-gray-500">
                {pdfFile ? pdfFile.name : "Ningún archivo seleccionado"}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Cargar archivo PDF de la entrada.
            </p>
          </div>

          {/* Campo para subir Video */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <label
                htmlFor="video-upload"
                className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Seleccionar archivo de video
                <input
                  id="video-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleVideoChange}
                  accept="video/*"
                />
              </label>
              <span className="text-sm text-gray-500">
                {videoFile ? videoFile.name : "Ningún archivo seleccionado"}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Cargar video de la entrada.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Mostrar enlaces si los archivos se suben correctamente */}
          {fileUrl && (
            <div className="text-sm text-gray-600">
              <p>Archivo PDF subido exitosamente. Puedes verlo aquí:</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Ver archivo PDF
              </a>
            </div>
          )}

          {videoUrl && (
            <div className="text-sm text-gray-600">
              <p>Video prueba subido exitosamente. Puedes verlo aquí:</p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Ver video
              </a>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              onClick={ ()=>   detenerTemporizador() }
              type="submit"
              className="bg-[#0a0f1c] text-white hover:bg-[#1a1f2c]"
              disabled={uploading}
            >          
              {uploading ? "Subiendo..." : "Subir Entrada"}
              
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-gray-700"
              disabled={uploading}
              onClick={() => {
                onConfirmarEntrada();  // Llamamos la función para confirmar la entrada
              }}
            >
              Confirmar Entrada
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
