import { format, isToday, parseISO } from "date-fns";

export function processComprasMetrics(compras: any[]) {
    // Función auxiliar para convertir a soles
    const calcularEnSoles = (monto: number, tipoCambio: number | null, monedaId: number | null) => {
        // Asumiendo que moneda_id 1 es Soles y 2 es Dólares (ajusta según tu tabla monedas)
        if (monedaId === 2 && tipoCambio) {
            return monto * tipoCambio;
        }
        return monto;
    };

    // 1. Inversión Mercadería (Total acumulado en Soles)
    const inversionTotalSoles = compras.reduce((acc, c) => {
        const totalSoles = calcularEnSoles(Number(c.total || 0), c.tipo_cambio, c.moneda_id);
        return acc + totalSoles;
    }, 0);

    // 2. Inversión Hoy
    const comprasHoy = compras.filter(c => isToday(parseISO(c.fecha)));
    const inversionHoySoles = comprasHoy.reduce((acc, c) => {
        const totalSoles = calcularEnSoles(Number(c.total || 0), c.tipo_cambio, c.moneda_id);
        return acc + totalSoles;
    }, 0);

    // 3. Gastos Logísticos (Fletes, Seguros, Aduanas)
    // Nota: Estos costos en la tabla 'importaciones' suelen estar ya en la moneda local o deben convertirse
    const gastosLogiticosSoles = compras.reduce((acc, c) => {
        // Obtenemos los datos de importación (manejando si viene como objeto o array)
        const imp = Array.isArray(c.importaciones) ? c.importaciones[0] : c.importaciones;

        if (imp) {
            // Sumamos los 3 conceptos en su moneda original (USD)
            const sumaCostosUSD = Number(imp.costo_flete || 0) +
                Number(imp.costo_seguro || 0) +
                Number(imp.costo_aduana || 0);

            // Usamos el tipo_cambio de la tabla 'compras' para pasar a Soles
            // Si la moneda es 2 (Dólares) y existe tipo_cambio, multiplicamos.
            const conversionASoles = (c.moneda_id === 2 && c.tipo_cambio)
                ? (sumaCostosUSD * Number(c.tipo_cambio))
                : sumaCostosUSD;

            return acc + conversionASoles;
        }
        return acc;
    }, 0);

    // 4. Mix de Origen
    const totalImportaciones = compras.filter(c => c.tipo_compra === 'IMPORTACION').length;
    const totalNacionales = compras.filter(c => c.tipo_compra === 'NACIONAL').length;

    return [
        {
            id: "inv-total",
            title: "Inversión Mercadería",
            value: `S/ ${inversionTotalSoles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
            trend: "+12.5%",
            highlight: "Acumulado total",
            description: "Suma de compras nacionales e importaciones",
        },
        {
            id: "inv-hoy",
            title: "Inversión Hoy",
            value: `S/ ${inversionHoySoles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
            trend: "0%",
            highlight: `${comprasHoy.length} órdenes hoy`,
            description: "Gasto registrado en las últimas 24h",
        },
        {
            id: "gastos-log",
            title: "Gastos Logísticos",
            value: `S/ ${gastosLogiticosSoles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
            trend: "+5.2%",
            highlight: "Costos de importación",
            description: "Suma de fletes, seguros y aduanas",
        },
        {
            id: "mix-origen",
            title: "Mix de Origen",
            value: `${totalImportaciones} IMP / ${totalNacionales} NAC`,
            trend: "Equilibrado",
            highlight: "Distribución de carga",
            description: "Cantidad de Importaciones vs Nacionales",
        }
    ];
}

export function prepareComprasChartData(compras: any[]) {
    const groups: Record<string, number> = {};

    compras.forEach((c) => {
        const dateKey = format(parseISO(c.fecha), "yyyy-MM-dd");
        if (!groups[dateKey]) groups[dateKey] = 0;

        // El gráfico también debe mostrarse en SOLES para ser comparativo
        const monto = (c.moneda_id === 2 && c.tipo_cambio)
            ? Number(c.total || 0) * c.tipo_cambio
            : Number(c.total || 0);

        groups[dateKey] += monto;
    });

    return Object.entries(groups)
        .map(([date, total]) => ({
            date,
            desktop: total,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}