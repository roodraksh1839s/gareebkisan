import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Calendar, AlertCircle, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { mockPricePrediction, crops, mandis } from "../data/mockData"

export function MandiPrices() {
  const [selectedCrop, setSelectedCrop] = useState(crops[0])
  const [selectedMandi, setSelectedMandi] = useState(mandis[0])
  const [timeframe, setTimeframe] = useState("7")

  const getChartData = () => {
    const days = parseInt(timeframe)
    return mockPricePrediction.predictedPrices.slice(0, days)
  }

  const chartData = getChartData()
  const currentPrice = mockPricePrediction.currentPrice
  const maxPrice = Math.max(...chartData.map((d) => d.price))
  const minPrice = Math.min(...chartData.map((d) => d.price))

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 text-3xl font-bold">Mandi Price Prediction</h1>
        <p className="text-muted-foreground">
          AI-powered price forecasts to help you decide when and where to sell
        </p>
      </motion.div>

      {/* Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">Select Crop</label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop} value={crop}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Select Mandi</label>
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
      </motion.div>

      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Price Forecast</CardTitle>
                <CardDescription>
                  Predicted prices for {selectedCrop} at {selectedMandi}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">₹{currentPrice.toLocaleString()}</span>
                <Badge variant="success" className="ml-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +10.2%
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={timeframe} onValueChange={setTimeframe}>
              <TabsList className="mb-4">
                <TabsTrigger value="7">7 Days</TabsTrigger>
                <TabsTrigger value="15">15 Days</TabsTrigger>
                <TabsTrigger value="30">30 Days</TabsTrigger>
              </TabsList>
              <TabsContent value={timeframe}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
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
                        formatter={(value: number | undefined) => value !== undefined ? [`₹${value.toLocaleString()}`, "Price"] : ["", ""]}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                      <ReferenceLine
                        y={currentPrice}
                        stroke="#94a3b8"
                        strokeDasharray="3 3"
                        label={{ value: "Current", position: "right" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Best Selling Window */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Best Selling Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Recommended Date Range</p>
                  <p className="text-lg font-bold text-green-700">
                    {new Date(mockPricePrediction.bestSellingWindow.start).toLocaleDateString()} - {new Date(mockPricePrediction.bestSellingWindow.end).toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 border border-green-200">
                  <p className="text-sm text-green-900">
                    Prices are expected to peak during this period. Plan your harvest and transportation accordingly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendation & Volatility */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          {/* Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold capitalize">{mockPricePrediction.recommendation}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockPricePrediction.recommendation === "hold"
                      ? "Wait for better prices"
                      : "Good time to sell"}
                  </p>
                </div>
                {mockPricePrediction.recommendation === "hold" ? (
                  <TrendingUp className="h-12 w-12 text-green-500" />
                ) : (
                  <TrendingDown className="h-12 w-12 text-orange-500" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Price Volatility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Price Volatility
              </CardTitle>
            </CardHeader>
            <CardContent>
                <Badge
                  variant={
                    mockPricePrediction.volatility === "high"
                      ? "danger"
                      : mockPricePrediction.volatility === "medium"
                      ? "warning"
                      : "success"
                  }
                  className="text-sm"
                >
                  {mockPricePrediction.volatility.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  Price range: ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {mockPricePrediction.volatility === "high"
                    ? "Prices may fluctuate significantly. Monitor daily."
                    : mockPricePrediction.volatility === "medium"
                    ? "Moderate price movements expected."
                    : "Stable prices with minimal fluctuations."}
                </p>
              </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
