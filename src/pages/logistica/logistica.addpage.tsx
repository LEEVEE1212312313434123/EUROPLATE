import { useState } from "react";
import { Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import ProductosAgregarForm from "@/components/common/Logistica/Logisitica.Tableadd";

export default function AgregarLogistica() {
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState<string>("");
    const [step, setStep] = useState<number>(1);
    const [productosStep1, setProductosStep1] = useState<any[]>([]);

    
    return(
        <div className="space-y-6 ml-6">
            <div className="flex items-start gap-4">
                <Package className="h-12 w-12 text-primary mt-1" />
                <div className="flex flex-col">
                    <h1 className="text-xl font-semibold">Registro Nueva Compra</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Completa los datos de la compras
                    </p>
                    {step === 1 && (
                        <div className="mt-6 ml-[36px]">
                        <label className="block text-base font-semibold mb-1">
                            Categoría
                        </label>
                        <Select
                            value={categoria}
                            onValueChange={(value) => setCategoria(value)}
                            disabled={step > 1}
                        >
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Importacion">Importación</SelectItem>
                            <SelectItem value="Nacional">Nacional</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    )}
                </div>
            </div>
            <div className="mt-10 ml-[100px] max-w-6xl">
                {step === 1 && (
                    <ProductosAgregarForm
                        navigate={navigate}
                        categoria={categoria}
                        onNext={(productos) => {
                        setProductosStep1(productos);
                        setStep(2);
                        }}
                    />
                )}
            </div>
        </div>
    );
}