import type { ProductWithRelations } from "@/types/products/product.relations";
import type { MaterialEntity } from "@/types/products/entity/material.entity";
export function formatProductName(product: ProductWithRelations) {
  const categoria = product.categoria;

  const m: MaterialEntity | undefined = product.materiales?.[0];

  if (!m) return categoria;

  const partes: string[] = [];

  if (m.tipo) partes.push(m.tipo);

  if (m.ancho_cm && m.largo_cm && m.ancho_cm > 0 && m.largo_cm > 0) {
    partes.push(`${m.ancho_cm}x${m.largo_cm}`);
  }

  if (m.gramaje_g && m.gramaje_g > 0) {
    partes.push(`${m.gramaje_g}g`);
  }
  if (m.calibre && m.calibre > 0) {
    partes.push(`Cal ${m.calibre}`);
  }
  if (m.unidad_medida) {
    partes.push(m.unidad_medida);
  }
  const detalle = partes.filter(Boolean).join(" ");
  return detalle.trim().length > 0 ? `${categoria} ${detalle}` : categoria;
}
