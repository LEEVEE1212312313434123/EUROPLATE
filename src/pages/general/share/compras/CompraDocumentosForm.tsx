"use client"

import { FileText, FileSpreadsheet, FileImage, File, Trash2, FileType } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import FileDropzone from "@/pages/general/share/FileDropzone"

// Función auxiliar para obtener el icono según la extensión o nombre
const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconClass = "h-8 w-8 shrink-0";

    switch (ext) {
        case 'pdf':
            return <FileText className={`${iconClass} text-red-500`} />;
        case 'doc':
        case 'docx':
            return <FileType className={`${iconClass} text-blue-500`} />;
        case 'xls':
        case 'xlsx':
        case 'csv':
            return <FileSpreadsheet className={`${iconClass} text-emerald-500`} />;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
        case 'webp':
            return <FileImage className={`${iconClass} text-purple-500`} />;
        default:
            return <File className={`${iconClass} text-slate-400`} />;
    }
};

export default function CompraDocumentosForm({ documentos, setDocumentos }: any) {

    const eliminarDocumento = (index: number) => {
        const nuevos = documentos.filter((_: any, i: number) => i !== index);
        setDocumentos(nuevos);
    }

    const actualizarDocumento = (index: number, campo: string, valor: any) => {
        const nuevos = [...documentos]
        nuevos[index][campo] = valor
        setDocumentos(nuevos)
    }

    const agregarDesdeArchivo = (data: any) => {
        setDocumentos([
            ...documentos,
            {
                nombre_archivo: data.nombre_archivo,
                tipo_documento: data.tipo_documento || "Documento"
            }
        ])
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Documentos Adjuntos
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* DROPZONE */}
                <FileDropzone onArchivo={agregarDesdeArchivo} />

                {/* LISTA DE DOCUMENTOS */}
                <div className="grid gap-3">
                    {documentos.length === 0 ? (
                        <p className="text-center text-sm text-slate-400 py-4 italic">
                            No hay archivos cargados. Arrastra uno arriba.
                        </p>
                    ) : (
                        documentos.map((doc: any, i: number) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-3 bg-slate-50 border rounded-lg group hover:border-indigo-200 transition-colors"
                            >
                                {/* ICONO DINÁMICO */}
                                {getFileIcon(doc.nombre_archivo)}

                                <div className="grid grid-cols-2 gap-3 flex-1">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nombre</label>
                                        <Input
                                            className="h-8 text-sm bg-white"
                                            placeholder="Nombre archivo"
                                            value={doc.nombre_archivo}
                                            onChange={(e) => actualizarDocumento(i, "nombre_archivo", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tipo / Categoría</label>
                                        <Input
                                            className="h-8 text-sm bg-white"
                                            placeholder="Ej: Factura, BL, Packing List"
                                            value={doc.tipo_documento}
                                            onChange={(e) => actualizarDocumento(i, "tipo_documento", e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* BOTÓN ELIMINAR */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => eliminarDocumento(i)}
                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}