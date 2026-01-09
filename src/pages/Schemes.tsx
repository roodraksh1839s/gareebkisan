import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Calendar, BookmarkPlus, Check, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { mockSchemes } from "../data/mockData"
import { useTranslation } from "react-i18next"

export function Schemes() {
  const { t } = useTranslation()
  const [savedSchemes, setSavedSchemes] = useState<Set<string>>(new Set())
  const [filterApplied, setFilterApplied] = useState<string>("all")

  const toggleSaveScheme = (schemeId: string) => {
    const newSaved = new Set(savedSchemes)
    if (savedSchemes.has(schemeId)) {
      newSaved.delete(schemeId)
    } else {
      newSaved.add(schemeId)
    }
    setSavedSchemes(newSaved)
  }

  const handleApply = (scheme: any) => {
    if (scheme.link.startsWith('http')) {
      window.open(scheme.link, '_blank', 'noopener,noreferrer')
    } else {
      alert(`Application process initiated for: ${scheme.title}\n\n(In production, this would redirect to the government portal or show an application form)`)
    }
  }

  const filteredSchemes = filterApplied === "saved" 
    ? mockSchemes.filter(s => savedSchemes.has(s.id))
    : mockSchemes
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">{t('schemes.title')}</h1>
          <p className="text-muted-foreground">Find and apply for relevant government subsidies and programs</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterApplied === "all" ? "default" : "outline"}
            onClick={() => setFilterApplied("all")}
          >
            All Schemes ({mockSchemes.length})
          </Button>
          <Button
            variant={filterApplied === "saved" ? "default" : "outline"}
            onClick={() => setFilterApplied("saved")}
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Saved ({savedSchemes.size})
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6">
        {filteredSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{scheme.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSaveScheme(scheme.id)}
                        className="h-8 w-8"
                      >
                        {savedSchemes.has(scheme.id) ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CardDescription className="mt-2 text-base">
                      {scheme.description}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 ml-2">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('schemes.benefits')}</p>
                    <p className="font-semibold text-primary">{scheme.benefit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('schemes.eligibility')}</p>
                    <p className="text-sm">{scheme.eligibility}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('schemes.deadline')}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {scheme.deadline}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button className="gap-2 flex-1" onClick={() => handleApply(scheme)}>
                  {t('schemes.apply')} <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="outline" asChild>
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        
        {filteredSchemes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No saved schemes yet. Save schemes to view them here.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
