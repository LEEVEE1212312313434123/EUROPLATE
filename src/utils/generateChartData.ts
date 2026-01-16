// utils/generateChartData.ts
export function generateChartData(days: number) {
  const data = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(now.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0], // yyyy-mm-dd
      desktop: Math.floor(Math.random() * 500), // números aleatorios
      mobile: Math.floor(Math.random() * 500),
    })
  }

  return data
}
