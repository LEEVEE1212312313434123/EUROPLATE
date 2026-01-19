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



// @/services/dashboard/dashboard.adapter.ts

// ... (mantén tus funciones de ventas anteriores)

export const processComprasStats = (importaciones: any[]) => {
    // 1. Costo total de compras (asumiendo que tienes un campo total_costo o sumando productos)
    const totalCosto = importaciones.reduce((acc, imp) => {
        const sumaProductos = imp.importacion_productos?.reduce((sum: number, p: any) =>
            sum + (Number(p.cantidad) * Number(p.precio_unitario || 0)), 0);
        return acc + (Number(imp.costo_total || sumaProductos || 0));
    }, 0);

    const totalImportaciones = importaciones.length;

    return [
        {
            id: "total-purchases",
            title: "Gasto en Compras",
            value: `USD ${totalCosto.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            trendValue: "-5.2%",
            trendType: "down",
            highlight: "Inversión total",
            description: "Suma de todas las importaciones"
        },
        {
            id: "import-count",
            title: "Importaciones",
            value: totalImportaciones.toString(),
            trendValue: "+2",
            trendType: "up",
            highlight: "Lotes recibidos",
            description: "Cantidad de órdenes de compra"
        },
        // Puedes agregar métricas de stock crítico aquí también
    ];
};

export const prepareComprasChartData = (importaciones: any[]) => {
    const groups = importaciones.reduce((acc: any, imp) => {
        const date = imp.fecha_llegada ? new Date(imp.fecha_llegada).toISOString().split('T')[0] : 'Sin fecha';
        if (!acc[date]) acc[date] = { date, desktop: 0 };

        const costoImp = imp.importacion_productos?.reduce((sum: number, p: any) =>
            sum + (Number(p.cantidad) * Number(p.precio_unitario || 0)), 0) || 0;

        acc[date].desktop += costoImp;
        return acc;
    }, {});

    return Object.values(groups).sort((a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
};