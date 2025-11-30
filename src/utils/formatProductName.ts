import type { Product } from "@/types/product.types";

export function formatProductName(product: Product) {
    const categoria = product.categoria;
    const m = product.material;

    const partes: string[] = [];

    // Tipo de material
    if (m.tipo) partes.push(m.tipo);

    // Dimensiones válidas
    const ancho = Number(m.dimensiones?.ancho_cm);
    const largo = Number(m.dimensiones?.largo_cm);
    if (ancho > 0 && largo > 0) partes.push(`${ancho}x${largo}`);

    // Gramaje válido
    if (m.gramaje_g > 0) partes.push(`${m.gramaje_g}g`);

    // Calibre válido
    if (m.calibre > 0) partes.push(`Cal ${m.calibre}`);

    // Unidades
    if (m.unidad_medida) partes.push(m.unidad_medida);

    const detalle = partes.filter(Boolean).join(" ");

    return detalle.trim().length > 0 ? `${categoria} ${detalle}` : categoria;
}
