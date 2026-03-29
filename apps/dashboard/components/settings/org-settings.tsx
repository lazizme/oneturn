"use client"

import { useState, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon, Building02Icon, Upload01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "sonner"

const ORG_TYPES = [
  { value: "bank", label: "Bank" },
  { value: "clinic", label: "Klinika" },
  { value: "government", label: "Davlat idorasi" },
  { value: "other", label: "Boshqa" },
]

export function OrgSettings() {
  const [name, setName] = useState("Agrobank")
  const [orgType, setOrgType] = useState("bank")
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [email, setEmail] = useState("info@agrobank.uz")
  const [phone, setPhone] = useState("+998 71 200 00 00")
  const [website, setWebsite] = useState("agrobank.uz")
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Fayl hajmi 2MB dan oshmasligi kerak")
      return
    }
    const url = URL.createObjectURL(file)
    setLogoPreview(url)
  }

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("Saqlandi")
    }, 800)
  }

  return (
    <div className="flex gap-8">
      {/* Form — left 60% */}
      <div className="w-[60%] space-y-5">
        <div>
          <Label className="mb-1.5 text-xs font-medium">
            Tashkilot nomi
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masalan: Agrobank"
            className="rounded-xl"
          />
        </div>

        <div>
          <Label className="mb-1.5 text-xs font-medium">
            Tashkilot turi
          </Label>
          <Select value={orgType} onValueChange={setOrgType}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Turini tanlang" />
            </SelectTrigger>
            <SelectContent>
              {ORG_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1.5 text-xs font-medium">Logotip</Label>
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400 hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            {logoPreview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoPreview}
                alt="Logo preview"
                className="mb-2 size-16 rounded-lg object-contain"
              />
            ) : (
              <HugeiconsIcon icon={Upload01Icon} size={32} className="mb-2 text-gray-400" />
            )}
            <p className="text-sm font-medium text-gray-600">
              Rasm yuklash yoki bu yerga tashlang
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG &middot; Maks 2MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div>
          <Label className="mb-1.5 text-xs font-medium">
            Aloqa email
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@example.uz"
            className="rounded-xl"
          />
        </div>

        <div>
          <Label className="mb-1.5 text-xs font-medium">Telefon</Label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998 XX XXX XX XX"
            className="rounded-xl"
          />
        </div>

        <div>
          <Label className="mb-1.5 text-xs font-medium">Veb-sayt</Label>
          <Input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="example.uz"
            className="rounded-xl"
          />
        </div>

        <Button
          className="rounded-xl text-white"
          style={{ backgroundColor: "var(--brand-primary)" }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <HugeiconsIcon icon={Loading03Icon} size={14} className="mr-2 animate-spin" />
              Saqlanmoqda...
            </>
          ) : (
            "Saqlash"
          )}
        </Button>
      </div>

      {/* Preview — right 40% */}
      <div className="w-[40%]">
        <p
          className="mb-3 text-xs font-medium"
          style={{ color: "var(--brand-muted)" }}
        >
          Widget ko&apos;rinishi
        </p>
        <Card className="overflow-hidden rounded-2xl">
          <div
            className="flex items-center gap-3 p-4"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {logoPreview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoPreview}
                alt="Logo"
                className="size-10 rounded-lg bg-white/20 object-contain p-1"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-lg bg-white/20">
                <HugeiconsIcon icon={Building02Icon} size={20} className="text-white" />
              </div>
            )}
            <div className="text-white">
              <p className="text-sm font-bold">{name || "Tashkilot nomi"}</p>
              <p className="text-xs text-white/80">Chilonzor filiali</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-3">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: "var(--brand-accent)" }}
            />
            <span className="text-xs font-medium text-gray-700">
              Ochiq
            </span>
            <span className="text-xs text-gray-400">&middot;</span>
            <span className="text-xs text-gray-500">09&ndash;18</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
