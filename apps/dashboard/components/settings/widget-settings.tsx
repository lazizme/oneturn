"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon, Building02Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Card } from "@workspace/ui/components/card"

const COLOR_PRESETS = [
  "#2563EB",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#0F172A",
]

type Position = "bottom-right" | "bottom-left"
type Lang = "uz" | "ru" | "en"

export function WidgetSettings() {
  const [selectedColor, setSelectedColor] = useState("#2563EB")
  const [position, setPosition] = useState<Position>("bottom-right")
  const [lang, setLang] = useState<Lang>("uz")
  const [oneIdEnabled, setOneIdEnabled] = useState(false)
  const [copied, setCopied] = useState(false)

  const embedCode = `<script
  src="https://cdn.oneturn.uz/widget.js"
  data-org-id="agrobank-demo"
  data-color="${selectedColor}"
  data-lang="${lang}"
  data-position="${position}"
></script>`

  function handleCopy() {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-8">
      {/* Controls — left */}
      <div className="w-[55%] space-y-6">
        {/* Color picker */}
        <div>
          <Label className="mb-2 text-xs font-medium">Asosiy rang</Label>
          <div className="flex items-center gap-2">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                className="size-8 rounded-full transition-all"
                style={{
                  backgroundColor: color,
                  boxShadow:
                    selectedColor === color
                      ? `0 0 0 2px white, 0 0 0 4px ${color}`
                      : "none",
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
            <div className="ml-2 flex items-center gap-2">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="size-8 cursor-pointer rounded-full border-0 bg-transparent p-0"
              />
            </div>
          </div>
        </div>

        {/* Position */}
        <div>
          <Label className="mb-2 text-xs font-medium">Widget holati</Label>
          <div className="flex gap-2">
            <Button
              variant={position === "bottom-right" ? "default" : "outline"}
              className="flex-1 rounded-xl text-xs text-white"
              style={
                position === "bottom-right"
                  ? { backgroundColor: "var(--brand-primary)" }
                  : undefined
              }
              onClick={() => setPosition("bottom-right")}
            >
              ↘ Pastki o&apos;ng
            </Button>
            <Button
              variant={position === "bottom-left" ? "default" : "outline"}
              className="flex-1 rounded-xl text-xs text-white"
              style={
                position === "bottom-left"
                  ? { backgroundColor: "var(--brand-primary)" }
                  : undefined
              }
              onClick={() => setPosition("bottom-left")}
            >
              ↙ Pastki chap
            </Button>
          </div>
        </div>

        {/* Language */}
        <div>
          <Label className="mb-2 text-xs font-medium">Til</Label>
          <div className="flex gap-2">
            {(
              [
                { value: "uz", label: "O'zbek" },
                { value: "ru", label: "Русский" },
                { value: "en", label: "English" },
              ] as const
            ).map((item) => (
              <Button
                key={item.value}
                variant={lang === item.value ? "default" : "outline"}
                className="flex-1 rounded-xl text-xs"
                style={
                  lang === item.value
                    ? {
                        backgroundColor: "var(--brand-primary)",
                        color: "white",
                      }
                    : undefined
                }
                onClick={() => setLang(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* OneID toggle */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">OneID integratsiyasi</Label>
            <button
              onClick={() => setOneIdEnabled(!oneIdEnabled)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                oneIdEnabled ? "" : "bg-gray-300"
              }`}
              style={
                oneIdEnabled
                  ? { backgroundColor: "var(--brand-accent)" }
                  : undefined
              }
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                  oneIdEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {oneIdEnabled ? (
            <span className="mt-2 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              Faol
            </span>
          ) : (
            <p className="mt-2 text-xs text-gray-400">
              OneID o&apos;chirilgan. Faqat telefon orqali tasdiqlash ishlaydi.
            </p>
          )}
        </div>

        {/* Embed code */}
        <div>
          <Label className="mb-2 text-xs font-medium">Embed kodi</Label>
          <div className="relative rounded-xl bg-gray-900 p-4">
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-gray-100">
              <span className="text-gray-400">&lt;script</span>
              {"\n"}
              {"  "}
              <span className="text-gray-400">src=</span>
              <span className="text-blue-400">
                &quot;https://cdn.oneturn.uz/widget.js&quot;
              </span>
              {"\n"}
              {"  "}
              <span className="text-gray-400">data-org-id=</span>
              <span className="text-blue-400">&quot;agrobank-demo&quot;</span>
              {"\n"}
              {"  "}
              <span className="text-gray-400">data-color=</span>
              <span className="text-blue-400">&quot;{selectedColor}&quot;</span>
              {"\n"}
              {"  "}
              <span className="text-gray-400">data-lang=</span>
              <span className="text-blue-400">&quot;{lang}&quot;</span>
              {"\n"}
              {"  "}
              <span className="text-gray-400">data-position=</span>
              <span className="text-blue-400">&quot;{position}&quot;</span>
              {"\n"}
              <span className="text-gray-400">&gt;&lt;/script&gt;</span>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-3 right-3 gap-1.5 rounded-lg border-gray-700 bg-gray-800 text-xs text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <HugeiconsIcon icon={Tick02Icon} size={12} />
                  Nusxalandi
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Copy01Icon} size={12} />
                  Nusxa olish
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Live preview — right */}
      <div className="w-[45%]">
        <p
          className="mb-3 text-xs font-medium"
          style={{ color: "var(--brand-muted)" }}
        >
          Jonli ko&apos;rinish
        </p>
        <Card className="overflow-hidden rounded-2xl border border-gray-200">
          {/* Fake address bar */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 rounded-md bg-white px-3 py-1 text-xs text-gray-500">
              ← → ⟳ &nbsp;agrobank.uz
            </div>
          </div>

          {/* Content area */}
          <div className="relative bg-white" style={{ height: 320 }}>
            {/* Fake bank header */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ backgroundColor: selectedColor }}
            >
              <div className="flex size-7 items-center justify-center rounded bg-white/20 text-xs font-bold text-white">
                A
              </div>
              <span className="text-sm font-semibold text-white">Agrobank</span>
            </div>

            {/* Fake content lines */}
            <div className="space-y-3 p-4">
              <div className="h-3 w-3/4 rounded bg-gray-100" />
              <div className="h-3 w-1/2 rounded bg-gray-100" />
              <div className="h-3 w-2/3 rounded bg-gray-100" />
              <div className="h-8 w-1/3 rounded-lg bg-gray-50" />
            </div>

            {/* Widget button */}
            <button
              className={`absolute bottom-4 flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all ${
                position === "bottom-right" ? "right-4" : "left-4"
              }`}
              style={{ backgroundColor: selectedColor }}
            >
              <HugeiconsIcon icon={Building02Icon} size={14} /> Navbat
              <span className="text-[10px]">→</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
