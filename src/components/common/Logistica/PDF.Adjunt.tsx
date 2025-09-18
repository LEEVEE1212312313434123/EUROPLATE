// src/components/common/Logistica/PDF.Adjunt.tsx
"use client"

import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, FileSpreadsheet } from "lucide-react"
import { FaFileWord } from "react-icons/fa"

interface PDFAdjuntoProps {
  onChangeFiles?: (urls: string[]) => void
}

export default function PDFAdjunto({ onChangeFiles }: PDFAdjuntoProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, 5) // máximo 5
    setFiles(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: true,
  })

  // Generar URLs y notificar al padre
  useEffect(() => {
    const urls = files.map((f) => `https://europlate.com/documents/${f.name}`)
    if (onChangeFiles) {
      onChangeFiles(urls)
    }
  }, [files])

  // Ícono según tipo
  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return <FileText className="text-red-500" size={20} />
    if (file.type.includes("word")) return <FaFileWord className="text-blue-500" size={20} />
    if (file.type.includes("sheet") || file.type.includes("excel"))
      return <FileSpreadsheet className="text-green-500" size={20} />
    return <FileText size={20} />
  }

  return (
    <div className="mt-6">
      <h3 className="text-base font-medium mb-3">Adjuntos</h3>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
        ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          Arrastra y suelta tus archivos PDF, Word o Excel aquí, o haz clic para subir (máx 5).
        </p>
      </div>

      {/* Lista de archivos */}
      <div className="mt-3 space-y-2">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 border p-2 rounded-md bg-gray-50 text-sm"
          >
            {getFileIcon(file)}
            <span className="truncate">{`https://europlate.com/documents/${file.name}`}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
