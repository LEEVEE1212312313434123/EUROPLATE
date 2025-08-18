import { toast } from "sonner";

export function exportToCSV<T>(
  data: T[],
  headers: string[],
  rowMapper: (item: T) => (string | number)[],
  fileName = "export.csv"
) {
  if (!data || data.length === 0) {
    toast.error("No hay datos para exportar");
    return;
  }

  try {
    const rows = data.map(rowMapper);

    const csvContent = [
      headers.join(","), 
      ...rows.map((r) => r.join(",")), 
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    toast.success("Exportación completada");
  } catch (err) {
    console.error("Error al exportar CSV:", err);
    toast.error("Error al exportar CSV");
  }
}
