// @/services/dashboard/dashboard.adapter.ts

/**
 * Procesa las ventas para generar las métricas de los cuadros superiores
 */
export const processDashboardStats = (ventas: any[]) => {
    const totalVendido = ventas.reduce((acc, v) => acc + Number(v.total_monto || 0), 0);
    const totalVentas = ventas.length;

    // Calcular ventas de hoy
    const hoyString = new Date().toLocaleDateString();
    const ventasHoy = ventas.filter(v =>
        v.fecha_venta && new Date(v.fecha_venta).toLocaleDateString() === hoyString
    );
    const montoHoy = ventasHoy.reduce((acc, v) => acc + Number(v.total_monto || 0), 0);

    return [
        {
            id: "total-revenue",
            title: "Ingresos Totales",
            value: `USD ${totalVendido.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            trendValue: "+12.5%",
            trendType: "up",
            highlight: "Acumulado total",
            description: "Suma de todas las ventas"
        },
        {
            id: "sales-count",
            title: "Ventas Totales",
            value: totalVentas.toString(),
            trendValue: "+5%",
            trendType: "up",
            highlight: `${ventasHoy.length} hoy`,
            description: "Transacciones realizadas"
        },
        {
            id: "today-revenue",
            title: "Ingresos Hoy",
            value: `USD ${montoHoy.toFixed(2)}`,
            trendValue: montoHoy > 0 ? "+100%" : "0%",
            trendType: "up",
            highlight: "Corte diario",
            description: "Ingresos del día actual"
        },
        {
            id: "avg-ticket",
            title: "Ticket Promedio",
            value: `USD ${(totalVendido / (totalVentas || 1)).toFixed(2)}`,
            trendValue: "-2%",
            trendType: "down",
            highlight: "Promedio por transacción",
            description: "Valor medio de venta"
        }
    ];
};

/**
 * Prepara los datos para el gráfico de barras (VisitorsBarChart)
 * IMPORTANTE: Asegúrate de que esta función tenga 'export' al inicio
 */
export const prepareChartData = (ventas: any[]) => {
    if (!ventas || ventas.length === 0) return [];

    // Agrupar ventas por fecha
    const groups = ventas.reduce((acc: any, v) => {
        if (!v.fecha_venta) return acc;

        // Extraemos solo la fecha (YYYY-MM-DD)
        const date = new Date(v.fecha_venta).toISOString().split('T')[0];

        if (!acc[date]) {
            acc[date] = { date, desktop: 0, mobile: 0 };
        }

        // Sumamos al valor 'desktop' (que usaremos para ingresos)
        acc[date].desktop += Number(v.total_monto || 0);
        return acc;
    }, {});

    // Convertimos el objeto en array y ordenamos por fecha
    return Object.values(groups).sort((a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
};