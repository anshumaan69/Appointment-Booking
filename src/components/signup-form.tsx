"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export function Signupform({
  className,
  ...props
}: React.ComponentProps<"div">) {



  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)






  const router = useRouter()



  //This will help in gettoing the register user function from auth context
  const { register } = useAuth()


  //To perform an asynchronous operation of submitting the form 

  const handleSubmit = async (e: React.FormEvent) => {

    //This prevents the default browser behavior(reloading the page when the form is submitted)
    e.preventDefault()
    //This tells the app the form is submitting
    setIsLoading(true)
    //Clears any previous errors before submitting the application form or when we rerender the page
    setError("")

    try {

      //this is an api call to the register function to check if registerred successfully otherwise return a false
      const success = await register(name, email, password)
      //The api tells whether it was a success 
      if (success) {
        //success is stored as true in the frontend 
        setSuccess(true)
        //then after waithing for 2 second(SOME mf'S call this ux we push them to the router page )
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  //This code will be shown on the fucking screen
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome </h1>
                <p className="text-muted-foreground text-balance">
                  Create your account
                </p>
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}



              {/* Conditionally render if a user is logged in 
              if success is true then render the component
              otherwise dont render the component*/}
              {success && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  Account created successfully! Redirecting to login...
                </div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>







                {/*onchange -----> updates the password when we change the password
                required ---> makes input mandatory in the form*/}
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>






              {/*Disables loading when registering is in process
              if is loading is true then it shows creating account otherwise signup*/}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>







              <div className="text-center text-sm">
                Already have an account?{" "}

                {/* redirects to the login page */}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
