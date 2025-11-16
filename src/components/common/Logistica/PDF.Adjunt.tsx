"use client"

import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { FileText, FileSpreadsheet, Trash } from "lucide-react"
import { FaFileWord } from "react-icons/fa"
import { Button } from "@/components/ui/button"

interface PDFAdjuntoProps {
  initialFiles?: { url: string; nombre_archivo: string }[]
  onChangeFiles?: (adjuntos: { url: string; nombre_archivo: string }[]) => void
}

export default function PDFAdjunto({ initialFiles = [], onChangeFiles }: PDFAdjuntoProps) {
  const [files, setFiles] = useState<File[]>([])
  const [existingUrls, setExistingUrls] = useState<
    { url: string; nombre_archivo: string }[]
  >(initialFiles)

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, 5)
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

  // 🚀 FIX DEL LOOP + INCLUIR nombre_archivo
  useEffect(() => {
    const nuevosAdjuntos = files.map((file) => {
      const url = `https://europlate.com/documents/${file.name}`
      return {
        url,
        nombre_archivo: file.name,
      }
    })

    const combinados = [...existingUrls, ...nuevosAdjuntos]
    onChangeFiles?.(combinados)
  }, [files]) // ❗ solo depende de "files"

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return <FileText className="text-red-500" size={20} />
    if (file.type.includes("word")) return <FaFileWord className="text-blue-500" size={20} />
    if (file.type.includes("sheet") || file.type.includes("excel")) return <FileSpreadsheet className="text-green-500" size={20} />
    return <FileText size={20} />
  }

  const removeExistingFile = (url: string) => {
    const updated = existingUrls.filter((file) => file.url !== url)
    setExistingUrls(updated)
    onChangeFiles?.(updated) // actualizar padre
  }

  const removeNewFile = (file: File) => {
    const updated = files.filter((f) => f !== file)
    setFiles(updated)
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
          Arrastra archivos PDF, Word o Excel aquí, o haz clic para subir (máx 5).
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {existingUrls.map((file, idx) => (
          <div key={idx} className="flex items-center justify-between border p-2 rounded-md bg-gray-50 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="text-gray-500" size={20} />
              <span className="truncate">{file.nombre_archivo}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeExistingFile(file.url)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {files.map((file, idx) => (
          <div key={idx} className="flex items-center justify-between border p-2 rounded-md bg-gray-50 text-sm">
            <div className="flex items-center gap-2">
              {getFileIcon(file)}
              <span className="truncate">{file.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeNewFile(file)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
