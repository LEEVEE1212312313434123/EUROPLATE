import { format, isToday, parseISO } from "date-fns";

export function processComprasMetrics(compras: any[]) {

    // 1. Inversión Mercadería (ya está en SOLES)
    const inversionTotalSoles = compras.reduce((acc, c) => {
        return acc + Number(c.total || 0);
    }, 0);

    // 2. Inversión Hoy
    const comprasHoy = compras.filter(c => isToday(parseISO(c.fecha)));
    const inversionHoySoles = comprasHoy.reduce((acc, c) => {
        return acc + Number(c.total || 0);
    }, 0);

    // 3. Gastos Logísticos (estos sí están en dólares)
    const gastosLogiticosSoles = compras.reduce((acc, c) => {
        const imp = Array.isArray(c.importaciones)
            ? c.importaciones[0]
            : c.importaciones;

        if (imp) {
            const sumaCostosUSD =
                Number(imp.costo_flete || 0) +
                Number(imp.costo_seguro || 0) +
                Number(imp.costo_aduana || 0);

            const conversionASoles = c.tipo_cambio
                ? sumaCostosUSD * Number(c.tipo_cambio)
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

        // total ya está en soles
        const monto = Number(c.total || 0);

        groups[dateKey] += monto;
    });

    return Object.entries(groups)
        .map(([date, total]) => ({
            date,
            desktop: total,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}