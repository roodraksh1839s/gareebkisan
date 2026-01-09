import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { Tractor, ArrowRight, User, Loader2, Mail } from "lucide-react"
import { supabase } from "../lib/supabase"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useTranslation } from "react-i18next"

export function Auth() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Auth State
  // Auth State
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [linkSent, setLinkSent] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  const checkAndCreateProfile = async (userId: string, userMetadata: any = {}) => {
    try {
      // Check/Create Profile
      const { data: existingFarmer, error: fetchError } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error fetching profile:", fetchError)
      }

      if (existingFarmer) {
        console.log("Farmer exists:", existingFarmer)
      } else {
        console.log("Creating new farmer profile with metadata:", userMetadata)

        // Prioritize metadata (from signup), then state (if still active), then defaults
        const newName = userMetadata?.full_name || name || "Farmer"
        const newCity = userMetadata?.city || city || null
        const newState = userMetadata?.state || state || null

        const { error: insertError } = await supabase
          .from('farmers')
          .insert([
            {
              id: userId,
              name: newName,
              city: newCity,
              state: newState,
              phone: null
            }
          ])

        if (insertError) {
          console.error("Error inserting farmer profile:", insertError)
          throw insertError
        }
        console.log("New farmer profile created")
      }
      return true
    } catch (error) {
      console.error("Error checking/creating profile:", error)
      return false
    }
  }

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log("Found existing session, checking profile...")
        await checkAndCreateProfile(session.user.id, session.user.user_metadata)
        navigate("/dashboard")
      }
    }

    checkSession()

    // Listen for auth changes (Magic Link callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.id)
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in via Magic Link/OTP, checking profile...")
        await checkAndCreateProfile(session.user.id)
        navigate("/dashboard")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, name]) // name dependency is tricky but mostly fine as it's for profile creation

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true)
    // Simulate Google Sign-In
    setTimeout(() => {
      setIsGoogleLoading(false)
      navigate("/dashboard")
    }, 1500)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log("Sending Magic Link to:", email)

      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: activeTab === "signup",
          emailRedirectTo: window.location.origin,
          data: {
            full_name: name,
            city: city,
            state: state,
            // phone: null // We aren't collecting phone currently
          }
        }
      })

      console.log("SignInWithOtp result:", { data, error })

      if (error) {
        console.error("Supabase sending Magic Link error details:", error)
        throw error
      }

      setLinkSent(true)
      console.log("Magic Link sent successfully")
    } catch (error: any) {
      console.error("Error sending Magic Link:", error.message || error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-10 text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <img src="/logo.png" alt="KrishiBandhu" className="h-10 w-10 rounded-lg" />
            <span>KrishiBandhu</span>
          </Link>
          <div className="mt-20">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Empowering Farmers with AI Technology
            </h1>
            <p className="text-xl opacity-90 max-w-lg">
              Join thousands of farmers using our platform to increase yields, optimize resources, and get real-time market insights.
            </p>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-4 text-sm opacity-80">
          <div className="flex items-center gap-1">
            <Tractor className="h-4 w-4" />
            <span>Smart Farming</span>
          </div>
          <div className="h-4 w-px bg-current" />
          <span>Market Insights</span>
          <div className="h-4 w-px bg-current" />
          <span>Crop Advisory</span>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex items-center justify-center p-6 bg-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="lg:hidden flex items-center gap-2 text-xl font-bold mb-8 justify-center text-primary">
            <img src="/logo.png" alt="KrishiBandhu" className="h-8 w-8 rounded-lg" />
            <span>KrishiBandhu</span>
          </div>

          <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">{linkSent ? "Check your email" : t('dashboard.welcome')}</CardTitle>
                  <CardDescription className="text-center">
                    {linkSent ? "We've sent you a login link." : "Enter your email to access your farm dashboard"}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSendOtp}>
                  <CardContent className="space-y-4">
                    {!linkSent ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="farmer@example.com"
                            className="pl-10"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <Mail className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click the link sent to <strong>{email}</strong> to sign in instantly.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          You can close this tab.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading || isGoogleLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        <>
                          {linkSent ? "Sent!" : "Send Magic Link"} {!linkSent && <ArrowRight className="ml-2 h-4 w-4" />}
                        </>
                      )}
                    </Button>
                    {!linkSent && (
                      <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                    )}
                    {!linkSent && (
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading || isGoogleLoading}
                      >
                        {isGoogleLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                          </svg>
                        )}
                        Sign in with Google
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border shadow-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">{linkSent ? "Check your email" : t('auth.register')}</CardTitle>
                  <CardDescription className="text-center">
                    {linkSent ? "We've sent you a login link." : "Start your journey towards smarter farming today"}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSendOtp}>
                  <CardContent className="space-y-4">
                    {!linkSent ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none" htmlFor="name">
                            {t('auth.name')}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              placeholder="Ram Singh"
                              className="pl-10"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                        {/* Phone input removed for Strict Magic Link flow */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="city">
                              City
                            </label>
                            <Input
                              id="city"
                              placeholder="Bhopal"
                              required
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="state">
                              State
                            </label>
                            <Input
                              id="state"
                              placeholder="Madhya Pradesh"
                              required
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none" htmlFor="signup-email">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="farmer@example.com"
                              className="pl-10"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <Mail className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click the link sent to <strong>{email}</strong> to verify your account.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          You can close this tab.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading || isGoogleLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        <>
                          {linkSent ? "Sent!" : "Sign Up"} {!linkSent && <ArrowRight className="ml-2 h-4 w-4" />}
                        </>
                      )}
                    </Button>
                    {!linkSent && (
                      <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                    )}
                    {!linkSent && (
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading || isGoogleLoading}
                      >
                        {isGoogleLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                          </svg>
                        )}
                        Sign in with Google
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  )
}
