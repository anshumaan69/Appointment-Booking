import { LoginForm } from "@/components/login-form"
import { RedirectIfAuthenticated } from "@/components/RedirectIfAuthenticated"

export default function Page() {
  return (
    <RedirectIfAuthenticated>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </RedirectIfAuthenticated>
  )
}

