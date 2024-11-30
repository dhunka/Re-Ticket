// app/supabase/page.tsx
'use client'
import UploadForm from '@/components/ui/UploadForm'; // Asegúrate de que la ruta de importación sea correcta

export default function UploadPage() {
  return (
    <div>
      <h1>Sube tu archivo PDF</h1>
      <UploadForm />
    </div>
  );
}
