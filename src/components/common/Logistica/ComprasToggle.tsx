import { Button } from "@/components/ui/button";
import type { TipoCompraView } from "@/types/compras/compras";

interface Props {
    value: TipoCompraView;
    onChange: (v: TipoCompraView) => void;
}

export function ComprasToggle({ value, onChange }: Props) {
    return (
        <div className="flex gap-2">
            <Button
                variant={value === "importacion" ? "default" : "outline"}
                onClick={() => onChange("importacion")}
            >
                Importaciones
            </Button>

            <Button
                variant={value === "nacional" ? "default" : "outline"}
                onClick={() => onChange("nacional")}
            >
                Compras Nacionales
            </Button>
        </div>
    );
}
