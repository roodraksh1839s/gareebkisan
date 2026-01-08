import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Info, 
  Droplets, 
  Flower, 
  Lightbulb, 
  MessageCircle, 
  Send, 
  X, 
  Languages, 
  Bot,
  Loader2
} from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { mockCropAdvisory, crops, growthStages } from "../data/mockData"

const AdvisoryCard = ({ 
  title, 
  icon: Icon, 
  data, 
  colorClass, 
  bgClass 
}: { 
  title: string, 
  icon: React.ElementType, 
  data: { advice: string, reason: string, confidence: number },
  colorClass: string,
  bgClass: string
}) => (
  <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden">
    <div className={`h-1 w-full ${bgClass}`} />
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded-lg ${bgClass} p-2 bg-opacity-20`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <Badge variant="outline" className={`${colorClass} border-current`}>
          {data.confidence}% Confidence
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-base font-medium mb-2">{data.advice}</p>
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-muted-foreground">Why: </span>
              <span className="text-muted-foreground">{data.reason}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Accuracy Score</span>
          <span>{data.confidence}/100</span>
        </div>
        <Progress value={data.confidence} className="h-2" />
      </div>
    </CardContent>
  </Card>
)

export function CropAdvisory() {
  const [selectedCrop, setSelectedCrop] = useState(crops[0])
  const [selectedStage, setSelectedStage] = useState(growthStages[2])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatLanguage, setChatLanguage] = useState("English")
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    { role: 'bot', content: 'Namaste! I am your AI Crop Assistant. How can I help you today?' }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI("AIzaSyACMEIJf8h-KI7jo3lZcr2oR3BQVzAnVgE")

  const suggestions = [
    "Pest control for Wheat?",
    "Best time to water?",
    "Fertilizer dosage?"
  ]

  const handleSendMessage = async (text: string = inputMessage) => {
    if (!text.trim()) return
    
    // Add user message
    const userMessage = { role: 'user' as const, content: text }
    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    
    try {
      // Get Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })
      
      // Context for the AI
      const context = `You are Kisan Sahayak, an expert agricultural AI assistant for Indian farmers. 
      Current Context:
      - Selected Crop: ${selectedCrop}
      - Growth Stage: ${selectedStage}
      - User Language Preference: ${chatLanguage}
      
      Please provide helpful, practical advice for farmers. Keep answers concise and easy to understand.`
      
      const prompt = `${context}\n\nUser Question: ${text}`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const textResponse = response.text()

      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: textResponse 
      }])
    } catch (error: any) {
      console.error("Error calling Gemini API:", error)
      console.error("Error details:", error?.message, error?.response)
      
      let errorMessage = "I apologize, but I'm having trouble right now. "
      
      if (error?.message?.includes('API key')) {
        errorMessage = "There's an issue with the API key. Please check if it's valid."
      } else if (error?.message?.includes('quota')) {
        errorMessage = "The API quota has been exceeded. Please try again later."
      } else if (error?.message?.includes('404')) {
        errorMessage = "The AI model is not available. Please contact support."
      } else {
        errorMessage += error?.message || "Please try again."
      }
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: errorMessage
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-200px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 text-3xl font-bold">Crop Advisory</h1>
        <p className="text-muted-foreground">
          AI-powered personalized recommendations for your farm
        </p>
      </motion.div>

      {/* Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Crop</label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Growth Stage</label>
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {growthStages.map((stage) => (
                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Advisory Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AdvisoryCard 
            title="Sowing Advice" 
            icon={Flower} 
            data={mockCropAdvisory.sowing}
            colorClass="text-green-600"
            bgClass="bg-green-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AdvisoryCard 
            title="Irrigation" 
            icon={Droplets} 
            data={mockCropAdvisory.irrigation}
            colorClass="text-blue-600"
            bgClass="bg-blue-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2 lg:col-span-1"
        >
          <AdvisoryCard 
            title="Fertilizer" 
            icon={Lightbulb} 
            data={mockCropAdvisory.fertilizer}
            colorClass="text-amber-600"
            bgClass="bg-amber-600"
          />
        </motion.div>
      </div>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[350px] rounded-xl border bg-background shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
            >
              {/* Chat Header */}
              <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold text-sm">Kisan Sahayak</h3>
                    <div className="flex items-center gap-1 text-xs opacity-80">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Select value={chatLanguage} onValueChange={setChatLanguage}>
                    <SelectTrigger className="h-7 w-[100px] bg-primary-foreground/10 border-transparent text-xs text-primary-foreground focus:ring-0">
                      <Languages className="mr-1 h-3 w-3" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Punjabi">Punjabi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsChatOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 h-[300px] overflow-y-auto bg-muted/30">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted border'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-3 py-2 bg-muted border flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestions & Input */}
              <div className="p-4 border-t bg-background space-y-3">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {suggestions.map((s) => (
                    <Button 
                      key={s} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs whitespace-nowrap h-7 px-2"
                      onClick={() => handleSendMessage(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2"
                >
                  <Input 
                    placeholder="Ask about your crop..." 
                    className="h-9 text-sm"
                    value={inputMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-xl p-0 hover:scale-110 transition-transform"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  )
}
