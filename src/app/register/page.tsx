import { Signupform } from "@/components/signup-form"
import { RedirectIfAuthenticated } from "@/components/RedirectIfAuthenticated"

export default function RegisterPage() {
  return (
    <RedirectIfAuthenticated>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <Signupform />
        </div>
      </div>
    </RedirectIfAuthenticated>
  )
}
