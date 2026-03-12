"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"

interface Props {
    onArchivo: (data: {
        nombre_archivo: string
        tipo_documento: string
        file: File
    }) => void
}

export default function FileDropzone({ onArchivo }: Props) {

    const inputRef = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)

    const procesarArchivo = (file: File) => {

        const nombre = file.name
        const extension = nombre.split(".").pop() || ""

        onArchivo({
            nombre_archivo: nombre,
            tipo_documento: extension,
            file
        })

    }

    const handleDrop = (e: React.DragEvent) => {

        e.preventDefault()
        setDragging(false)

        const file = e.dataTransfer.files?.[0]

        if (file) procesarArchivo(file)

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]

        if (file) procesarArchivo(file)

    }

    return (

        <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
      ${dragging ? "border-primary bg-muted" : "border-gray-300"}`}

            onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
            }}

            onDragLeave={() => setDragging(false)}

            onDrop={handleDrop}

            onClick={() => inputRef.current?.click()}
        >

            <Upload className="mx-auto mb-2 h-6 w-6 opacity-70" />

            <p className="text-sm">
                Arrastra archivos aquí o haz click para seleccionar
            </p>

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
            />

        </div>

    )

}