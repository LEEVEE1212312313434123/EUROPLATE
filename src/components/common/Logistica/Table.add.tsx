// src/components/common/Logistica/Table.add.tsx

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProductoRow {
  tempId: number
  order: string
  gradeTypeWidthGsm: string
  lMetre: string
  productId: string
  grossNetWt: string
}

interface Props {
  onChange: (rows: ProductoRow[]) => void
}

export default function TableAddImport({ onChange }: Props) {
  const [productos, setProductos] = useState<ProductoRow[]>([
    {
      tempId: 1,
      order: "",
      gradeTypeWidthGsm: "",
      lMetre: "",
      productId: "",
      grossNetWt: "",
    },
  ])

  // cada vez que cambia productos, notificamos al padre
  useEffect(() => {
    onChange(productos)
  }, [productos, onChange])

  const handleChange = (
    tempId: number,
    field: keyof ProductoRow,
    value: string
  ) => {
    setProductos((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, [field]: value } : p))
    )
  }

  const agregarFila = () => {
    const newTempId =
      productos.length > 0 ? productos[productos.length - 1].tempId + 1 : 1
    setProductos((prev) => [
      ...prev,
      {
        tempId: newTempId,
        order: "",
        gradeTypeWidthGsm: "",
        lMetre: "",
        productId: "",
        grossNetWt: "",
      },
    ])
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      <div className="flex items-start gap-4">
        <h3 className="text-base font-semibold mb-4">Productos</h3>
      </div>

      <Table className="text-sm">
        <TableHeader>
          <TableRow className="h-8">
            <TableHead className="px-2 text-center">Order</TableHead>
            <TableHead className="px-2 text-center">
              Grade / Type / Width / Gsm
            </TableHead>
            <TableHead className="px-2 text-center">LMetre</TableHead>
            <TableHead className="px-2 text-center">Product ID</TableHead>
            <TableHead className="px-2 text-center">Gross/net Wt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.tempId} className="h-8">
              <TableCell className="px-1 py-1">
                <Input
                  value={producto.order}
                  onChange={(e) =>
                    handleChange(producto.tempId, "order", e.target.value)
                  }
                  className="h-7 text-sm w-full"
                />
              </TableCell>
              <TableCell className="px-1 py-1">
                <Input
                  value={producto.gradeTypeWidthGsm}
                  onChange={(e) =>
                    handleChange(
                      producto.tempId,
                      "gradeTypeWidthGsm",
                      e.target.value
                    )
                  }
                  className="h-7 text-sm w-full"
                />
              </TableCell>
              <TableCell className="px-1 py-1">
                <Input
                  value={producto.lMetre}
                  onChange={(e) =>
                    handleChange(producto.tempId, "lMetre", e.target.value)
                  }
                  className="h-7 text-sm w-full"
                />
              </TableCell>
              <TableCell className="px-1 py-1">
                <Input
                  value={producto.productId}
                  onChange={(e) =>
                    handleChange(producto.tempId, "productId", e.target.value)
                  }
                  className="h-7 text-sm w-full"
                />
              </TableCell>
              <TableCell className="px-1 py-1">
                <Input
                  value={producto.grossNetWt}
                  onChange={(e) =>
                    handleChange(producto.tempId, "grossNetWt", e.target.value)
                  }
                  className="h-7 text-sm w-full"
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={5} className="text-start py-1">
              <Button
                variant="ghost"
                onClick={agregarFila}
                className="inline-flex items-center gap-1 rounded-full p-1 text-primary hover:bg-primary/20 cursor-pointer"
              >
                <PlusCircle size={20} />
                <span>Agregar</span>
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
