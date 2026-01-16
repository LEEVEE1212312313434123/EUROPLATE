import { useMemo } from "react"
import type { TimeRange } from "@/components/common/Forms/Dashboard/timeRange"

export function useTimeRangeFilter<T extends { date: string }>(
  data: T[],
  range: TimeRange
) {
  return useMemo(() => {
    const now = new Date()

    const from = (() => {
      switch (range) {
        case "7d":
          return new Date(now.setDate(now.getDate() - 7))
        case "30d":
          return new Date(now.setDate(now.getDate() - 30))
        case "3m":
          return new Date(now.setMonth(now.getMonth() - 3))
        case "12m":
          return new Date(now.setFullYear(now.getFullYear() - 1))
      }
    })()

    return data.filter((item) => new Date(item.date) >= from)
  }, [data, range])
}
