import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, TrendingUp, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { mandis } from "../data/mockData"

export function Simulator() {
  const [harvestDate, setHarvestDate] = useState("2024-01-12")
  const [selectedMandi, setSelectedMandi] = useState(mandis[0])
  const [compareMandi, setCompareMandi] = useState(mandis[1])

  // Mock profit calculation
  const calculateProfit = (date: string, mandi: string) => {
    const basePrice = 2450
    const dateObj = new Date(date)
    const dayOfYear = Math.floor((dateObj.getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24))
    const mandiMultiplier = mandi === mandis[0] ? 1.05 : mandi === mandis[1] ? 1.02 : mandi === mandis[2] ? 1.08 : 1.0
    const price = basePrice + (dayOfYear * 15) * mandiMultiplier
    const productionCost = 1800
    const profit = (price - productionCost) * 50 // Assuming 50 quintals
    return { price: Math.round(price), profit: Math.round(profit) }
  }

  const option1 = calculateProfit(harvestDate, selectedMandi)
  const option2 = calculateProfit(harvestDate, compareMandi)
  const betterOption = option1.profit > option2.profit ? 1 : 2

  // Generate comparison data
  const generateComparisonData = () => {
    const dates = []
    const today = new Date('2024-01-05')
    for (let i = 0; i < 15; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const opt1 = calculateProfit(dateStr, selectedMandi)
      const opt2 = calculateProfit(dateStr, compareMandi)
      dates.push({
        date: dateStr,
        [`${selectedMandi}`]: opt1.price,
        [`${compareMandi}`]: opt2.price,
      })
    }
    return dates
  }

  const comparisonData = generateComparisonData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">What-If Simulator</h1>
        </div>
        <p className="text-muted-foreground">
          Compare different scenarios to find the best selling strategy
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">Harvest Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Mandi Option 1</label>
          <Select value={selectedMandi} onValueChange={setSelectedMandi}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mandis.map((mandi) => (
                <SelectItem key={mandi} value={mandi}>
                  {mandi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Mandi Option 2</label>
          <Select value={compareMandi} onValueChange={setCompareMandi}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mandis.filter(m => m !== selectedMandi).map((mandi) => (
                <SelectItem key={mandi} value={mandi}>
                  {mandi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Price Comparison</CardTitle>
            <CardDescription>
              Compare predicted prices across different mandis over the next 15 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tickFormatter={(value) => `₹${value}`}
                    stroke="#6b7280"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number | undefined, name: string | undefined) => value !== undefined && name !== undefined ? [`₹${value.toLocaleString()}`, name] : ["", ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMandi}
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: "#22c55e", r: 4 }}
                    name={selectedMandi}
                  />
                  <Line
                    type="monotone"
                    dataKey={compareMandi}
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    name={compareMandi}
                  />
                  <ReferenceLine
                    x={harvestDate}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label={{ value: "Selected Date", position: "top" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profit Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className={betterOption === 1 ? "border-primary border-2 shadow-lg" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Option 1: {selectedMandi}
                </CardTitle>
                {betterOption === 1 && (
                  <Badge variant="default" className="bg-green-500">
                    Better Option
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Expected Price</p>
                <p className="text-2xl font-bold">₹{option1.price.toLocaleString()}/quintal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Profit (50 quintals)</p>
                <p className="text-3xl font-bold text-green-600">₹{option1.profit.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm">
                  <strong>Harvest Date:</strong> {new Date(harvestDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className={betterOption === 2 ? "border-primary border-2 shadow-lg" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Option 2: {compareMandi}
                </CardTitle>
                {betterOption === 2 && (
                  <Badge variant="default" className="bg-green-500">
                    Better Option
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Expected Price</p>
                <p className="text-2xl font-bold">₹{option2.price.toLocaleString()}/quintal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Profit (50 quintals)</p>
                <p className="text-3xl font-bold text-green-600">₹{option2.profit.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm">
                  <strong>Harvest Date:</strong> {new Date(harvestDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-2">Recommendation</h3>
                <p className="text-muted-foreground">
                  Based on your selected parameters, <strong>{betterOption === 1 ? selectedMandi : compareMandi}</strong> offers better profit potential with an estimated profit of ₹{betterOption === 1 ? option1.profit.toLocaleString() : option2.profit.toLocaleString()}.
                  The price difference is ₹{Math.abs(option1.price - option2.price).toLocaleString()} per quintal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
