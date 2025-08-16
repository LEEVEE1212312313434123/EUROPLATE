import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Package } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AgregarProductos() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Foldcote 70x100 150g calibre 10 paquete 100 pliegos", peso: "13.3", minKg: "1.22", maxKg: "1.27", minPrecio: "16.23", maxPrecio: "16.89" },
    { id: 2, nombre: "Sueco 70x100 335g calibre 22 paquete 100 pliegos", peso: "23.45", minKg: "1", maxKg: "1", minPrecio: "23.45", maxPrecio: "23.45" },
    { id: 3, nombre: "Duplex 70x100 205g calibre 12 paquete 100 pliegos", peso: "14.35", minKg: "1.07", maxKg: "1.812", minPrecio: "15.35", maxPrecio: "26" },
  ])

  const [selectedProducto, setSelectedProducto] = useState("Papel Folcote")
  const navigate = useNavigate()

  const handleChange = (id: number, field: string, value: string) => {
    setProductos(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)))
  }

  return (
    <div className="space-y-6 ml-6">
      <div className="flex items-center gap-4">
        <Package className="h-12 w-12 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold">Nuevo Producto</h1>
          <p className="text-muted-foreground">Agrega un nuevo producto a tu catálogo</p>
        </div>
      </div>

      <div>
        <Select value={selectedProducto} onValueChange={setSelectedProducto}>
          <SelectTrigger className="h-11 w-[300px] text-base">
            <SelectValue placeholder="Selecciona un producto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Papel Folcote">Papel Folcote</SelectItem>
            <SelectItem value="Papel Couché">Papel Couché</SelectItem>
            <SelectItem value="Papel Bond">Papel Bond</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <hr className="border-t border-gray-300 my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Producto</TableHead>
            <TableHead className="text-center w-[70px]">Peso</TableHead>
            <TableHead className="text-center w-[70px]">Kg Min</TableHead>
            <TableHead className="text-center w-[70px]">Kg Max</TableHead>
            <TableHead className="text-center w-[90px]">Precio Min ($)</TableHead>
            <TableHead className="text-center w-[90px]">Precio Max ($)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell className="w-[300px]">
                <Input
                  value={producto.nombre}
                  onChange={(e) =>
                    handleChange(producto.id, "nombre", e.target.value)
                  }
                />
              </TableCell>

              <TableCell className="text-center w-[70px]">
                <Input
                  className="w-full text-center"
                  value={producto.peso}
                  onChange={(e) => handleChange(producto.id, "peso", e.target.value)}
                />
              </TableCell>
              <TableCell className="text-center w-[70px]">
                <Input
                  className="w-full text-center"
                  value={producto.minKg}
                  onChange={(e) => handleChange(producto.id, "minKg", e.target.value)}
                />
              </TableCell>
              <TableCell className="text-center w-[70px]">
                <Input
                  className="w-full text-center"
                  value={producto.maxKg}
                  onChange={(e) => handleChange(producto.id, "maxKg", e.target.value)}
                />
              </TableCell>
              <TableCell className="text-center w-[90px]">
                <Input
                  className="w-full text-center"
                  value={producto.minPrecio}
                  onChange={(e) =>
                    handleChange(producto.id, "minPrecio", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[90px]">
                <Input
                  className="w-full text-center"
                  value={producto.maxPrecio}
                  onChange={(e) =>
                    handleChange(producto.id, "maxPrecio", e.target.value)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Botones al final */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <Button
            variant="outline"
            onClick={() => navigate(-1)} // Va hacia atrás
        >
            Anterior
        </Button>
        <Button
            onClick={() => navigate("/productos")} // Va a /productos
        >
            Confirmar
        </Button>
        </div>
    </div>
  )
}
