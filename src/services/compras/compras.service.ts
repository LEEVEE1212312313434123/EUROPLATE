// @/services/compras/compras.service.ts
import { ComprasRepository } from "@/repository/compras/compras.repository";

class ComprasServiceClass {
    async getAll() {
        return await ComprasRepository.getAll();
    }

    async getStatsParaDashboard() {
        const compras = await ComprasRepository.getAll();

        // Calcular Inversión Total
        const totalInversion = compras.reduce((acc, imp) => {
            const costoLote = imp.importacion_productos?.reduce((sum: number, p: any) =>
                sum + (Number(p.cantidad) * Number(p.precio_unitario || 0)), 0) || 0;
            return acc + costoLote;
        }, 0);

        // Calcular Compras del mes actual
        const mesActual = new Date().getMonth();
        const comprasMes = compras.filter(imp =>
            imp.fecha_llegada && new Date(imp.fecha_llegada).getMonth() === mesActual
        );

        return [
            {
                id: "total-purchases",
                title: "Inversión Total",
                value: `USD ${totalInversion.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                trendValue: "+8%",
                trendType: "up",
                highlight: "Stock valorizado",
                description: "Total invertido en importaciones"
            },
            {
                id: "import-count",
                title: "Órdenes de Compra",
                value: compras.length.toString(),
                trendValue: `+${comprasMes.length} este mes`,
                trendType: "up",
                highlight: "Lotes recibidos",
                description: "Frecuencia de abastecimiento"
            }
        ];
    }

    async getChartData() {
        const compras = await ComprasRepository.getAll();

        const groups = compras.reduce((acc: any, imp) => {
            if (!imp.fecha_llegada) return acc;
            const date = new Date(imp.fecha_llegada).toISOString().split('T')[0];

            if (!acc[date]) acc[date] = { date, desktop: 0 };

            const costoImp = imp.importacion_productos?.reduce((sum: number, p: any) =>
                sum + (Number(p.cantidad) * Number(p.precio_unitario || 0)), 0) || 0;

            acc[date].desktop += costoImp;
            return acc;
        }, {});

        return Object.values(groups).sort((a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }
}

export const ComprasService = new ComprasServiceClass();