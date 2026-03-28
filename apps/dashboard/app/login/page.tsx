"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 800)
  }

  function handleDemoLogin() {
    setLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            <Building2 className="size-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">OneTurn Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tashkilot boshqaruv paneli
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-xs">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@agrobank.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs">
              Parol
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 rounded-xl"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Kirish
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-gray-400">yoki</span>
          <Separator className="flex-1" />
        </div>

        <Button
          variant="outline"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full rounded-xl"
        >
          Demo hisobiga kirish
        </Button>
      </Card>
    </div>
  )
}
