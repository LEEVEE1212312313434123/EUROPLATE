import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardMetric } from "./metrics.data";

interface MetricCardProps {
  metric: DashboardMetric;
  size?: "sm" | "md";
}

export function MetricCard({ metric, size = "sm" }: MetricCardProps) {
  const isUp = metric.trendType === "up";
  const TrendIcon = isUp ? IconTrendingUp : IconTrendingDown;

  const cardClass =
    size === "sm"
      ? "max-w-xs w-full"
      : "max-w-md w-full";

  return (
    <Card
      data-slot="card"
      className={cn(
        "@container/card",
        cardClass,
        "bg-gradient-to-t from-primary/5 to-card shadow-xs transition-all hover:shadow-md"
      )}
    >
      <CardHeader>
        <CardDescription>{metric.title}</CardDescription>
        <CardTitle className="text-xl font-semibold tabular-nums sm:text-2xl">
          {metric.value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className="gap-1">
            <TrendIcon className="size-4" />
            {metric.trendValue}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex items-center gap-2 font-medium">
          {metric.highlight}
          <TrendIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">{metric.description}</div>
      </CardFooter>
    </Card>
  );
}
