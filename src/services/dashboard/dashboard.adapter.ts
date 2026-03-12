import { format, isToday, parseISO } from "date-fns";

export function processDashboardMetrics(ventas: any[]) {
    // 1. Cálculos base
    const ingresosTotales = ventas.reduce((acc, v) => acc + Number(v.total || 0), 0);
    const ventasTotales = ventas.length;

    const ventasHoy = ventas.filter(v => isToday(parseISO(v.fecha)));
    const ingresosHoy = ventasHoy.reduce((acc, v) => acc + Number(v.total || 0), 0);

    const ticketPromedio = ventasTotales > 0 ? ingresosTotales / ventasTotales : 0;

    // 2. Retorno de estructura para los StatCards
    return [
        {
            title: "Ingresos Totales",
            value: `S/ ${ingresosTotales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
            trend: "+12.5%",
            highlight: "Acumulado total",
            description: "Suma de todas las ventas",
        },
        {
            title: "Ventas Totales",
            value: ventasTotales.toString(),
            trend: "+5%",
            highlight: `${ventasHoy.length} hoy`,
            description: "Transacciones realizadas",
        },
        {
            title: "Ingresos Hoy",
            value: `S/ ${ingresosHoy.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
            trend: "0%",
            highlight: "Corte diario",
            description: "Ingresos del día actual",
        },
        {
            title: "Ticket Promedio",
            value: `S/ ${ticketPromedio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
            trend: "-2%",
            highlight: "Promedio por transacción",
            description: "Valor medio de venta",
        }
    ];
}

export function prepareChartData(ventas: any[]) {
    const groups: Record<string, number> = {};

    ventas.forEach((venta) => {
        const dateKey = format(parseISO(venta.fecha), "yyyy-MM-dd");
        if (!groups[dateKey]) {
            groups[dateKey] = 0;
        }
        groups[dateKey] += Number(venta.total || 0);
    });

    return Object.entries(groups)
        .map(([date, total]) => ({
            date,
            desktop: total,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}