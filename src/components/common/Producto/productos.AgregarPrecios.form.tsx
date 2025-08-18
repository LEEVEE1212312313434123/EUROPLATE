import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  navigate: any;
  productosPrevios: any[]; // productos del paso anterior
}

export default function ProductosAgregarPreciosForm({ navigate, productosPrevios }: Props) {
  const [pesoPaquete, setPesoPaquete] = useState("");
  const [precioKgMin, setPrecioKgMin] = useState("");
  const [precioKgMax, setPrecioKgMax] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  const handleFinalizar = () => {
    if (!pesoPaquete || !precioKgMin || !precioKgMax || !precioMin || !precioMax) {
      toast.error("Completa todos los campos");
      return;
    }

    const dataFinal = {
      productos: productosPrevios,
      pricing: {
        pesoPaquete: Number(pesoPaquete),
        precioKgMin: Number(precioKgMin),
        precioKgMax: Number(precioKgMax),
        precioMin: Number(precioMin),
        precioMax: Number(precioMax),
      },
    };

    console.log("✅ Datos completos:", dataFinal);
    navigate("/productos"); // aquí podrías guardar con useProducts
  };

  return (
    <>
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="h-8">
            {["Peso por Paquete (Kg)", "Precio por Kg (Min)", "Precio por Kg (Max)", "Precio Min ($)", "Precio Max ($)"].map((title) => (
              <TableHead key={title} className="px-2 text-center">{title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="h-8">
            <TableCell className="px-2 py-1">
              <Input
                value={pesoPaquete}
                onChange={(e) => setPesoPaquete(e.target.value)}
                className="h-7 text-sm"
              />
            </TableCell>
            <TableCell className="px-2 py-1">
              <Input
                value={precioKgMin}
                onChange={(e) => setPrecioKgMin(e.target.value)}
                className="h-7 text-sm"
              />
            </TableCell>
            <TableCell className="px-2 py-1">
              <Input
                value={precioKgMax}
                onChange={(e) => setPrecioKgMax(e.target.value)}
                className="h-7 text-sm"
              />
            </TableCell>
            <TableCell className="px-2 py-1">
              <Input
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                className="h-7 text-sm"
              />
            </TableCell>
            <TableCell className="px-2 py-1">
              <Input
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                className="h-7 text-sm"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="fixed bottom-6 right-6 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Atrás
        </Button>
        <Button size="sm" onClick={handleFinalizar}>
          Finalizar
        </Button>
      </div>
    </>
  );
}
