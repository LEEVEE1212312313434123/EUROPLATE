import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function StatCard({ item }: { item: any }) {
    const isPositive = item.trend.includes("+");
    const isNegative = item.trend.includes("-");

    return (
        <Card className="overflow-hidden border-slate-200 shadow-sm">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-slate-500">{item.title}</p>
                        <h3 className="text-2xl font-bold mt-1 text-slate-900">{item.value}</h3>
                    </div>
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? "bg-emerald-50 text-emerald-600" :
                        isNegative ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
                        }`}>
                        {isPositive && <ArrowUpRight className="w-3 h-3 mr-1" />}
                        {isNegative && <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {!isPositive && !isNegative && <Minus className="w-3 h-3 mr-1" />}
                        {item.trend}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50">
                    <p className="text-xs font-semibold text-slate-700">{item.highlight}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                </div>
            </CardContent>
        </Card>
    );
}