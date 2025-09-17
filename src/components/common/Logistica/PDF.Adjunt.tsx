import { useState } from "react"
import { useDropzone } from "react-dropzone"

export default function PDFAdjunto() {
  const [files, setFiles] = useState<(File | null)[]>(Array(5).fill(null))
  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files]
    for (let i = 0; i < acceptedFiles.length; i++) {
      const firstEmptyIndex = newFiles.findIndex((f) => f === null)
      if (firstEmptyIndex !== -1) {
        newFiles[firstEmptyIndex] = acceptedFiles[i]
      }
    }
    setFiles(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: true,
  })

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
          Arrastra y suelta tus archivos PDF aquí, o haz clic para subir.
        </p>
      </div>
    </div>
  )
}
