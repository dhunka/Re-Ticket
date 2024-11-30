"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface UploadFormProps {
  ticketId: number;
  onConfirmarEntrada: () => void;  // Recibimos la función como prop
}

export default function UploadForm({ ticketId, onConfirmarEntrada }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null); // Asegúrate de limpiar el estado si no hay archivo
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("No se ha seleccionado ningún archivo.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ticketId", ticketId.toString()); // Agregamos el ticketId

    try {
      const response = await fetch("/api/subidaSupabase", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setFileUrl(data.fileUrl); // Cambiado a `data.fileUrl` si la API lo devuelve así
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Ocurrió un error al subir el archivo.");
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
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Seleccionar archivo
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
              </label>
              <span className="text-sm text-gray-500">
                {file ? file.name : "Ningún archivo seleccionado"}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Cargar archivo PDF de la entrada.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {fileUrl && (
            <div className="text-sm text-gray-600">
              <p>Archivo subido exitosamente. Puedes verlo aquí:</p>
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

          <div className="flex justify-between">
            <Button
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
              onClick={onConfirmarEntrada} // Aquí llamamos la función pasada por prop
            >
              Confirmar Entrada
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
