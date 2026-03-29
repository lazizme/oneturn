"use client"

import { useState, useRef, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon, SmartPhone01Icon, AlarmClockIcon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Card } from "@workspace/ui/components/card"
import { toast } from "sonner"

const VARIABLES = [
  "{ism}",
  "{navbat}",
  "{xizmat}",
  "{vaqt}",
  "{filial}",
  "{link}",
]

const MOCK_VALUES: Record<string, string> = {
  "{ism}": "Jasur",
  "{navbat}": "A-14",
  "{xizmat}": "Hisob ochish",
  "{vaqt}": "12 mart 14:30",
  "{filial}": "Chilonzor",
  "{link}": "oneturn.uz/t/abc123",
}

interface Template {
  id: string
  icon: typeof SmartPhone01Icon
  title: string
  defaultText: string
}

const TEMPLATES: Template[] = [
  {
    id: "confirmation",
    icon: SmartPhone01Icon,
    title: "Tasdiqlash SMS",
    defaultText:
      "Hurmatli {ism}, navbatingiz tasdiqlandi.\nNavbat: {navbat} | Xizmat: {xizmat}\nVaqt: {vaqt} | Filial: {filial}\nO'zgartirish: {link}",
  },
  {
    id: "reminder",
    icon: AlarmClockIcon,
    title: "Eslatma SMS",
    defaultText:
      "Hurmatli {ism}, navbatingiz 30 daqiqadan keyin.\nNavbat: {navbat} | Filial: {filial}\nIltimos, o'z vaqtida keling.",
  },
  {
    id: "cancellation",
    icon: Cancel01Icon,
    title: "Bekor qilish SMS",
    defaultText:
      "Hurmatli {ism}, navbatingiz bekor qilindi.\nXizmat: {xizmat} | Filial: {filial}\nYangi navbat: {link}",
  },
]

function replaceVariables(text: string): string {
  let result = text
  for (const [key, value] of Object.entries(MOCK_VALUES)) {
    result = result.replaceAll(key, value)
  }
  return result
}

function getCharCountColor(count: number): string {
  if (count >= 160) return "text-red-600"
  if (count >= 140) return "text-amber-600"
  return "text-gray-400"
}

interface TemplateEditorProps {
  template: Template
  value: string
  onChange: (value: string) => void
}

function TemplateEditor({ template, value, onChange }: TemplateEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertVariable = useCallback(
    (variable: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = value.slice(0, start)
      const after = value.slice(end)
      const newValue = before + variable + after

      onChange(newValue)

      // Restore cursor position after the inserted variable
      requestAnimationFrame(() => {
        textarea.focus()
        const newPos = start + variable.length
        textarea.setSelectionRange(newPos, newPos)
      })
    },
    [value, onChange]
  )

  const charCount = value.length
  const preview = replaceVariables(value)

  return (
    <Card className="rounded-xl p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
        <HugeiconsIcon icon={template.icon} size={16} />
        {template.title}
      </h3>

      <div>
        <Label className="mb-1.5 text-xs font-medium">Shablon matni</Label>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-gray-900 transition-colors outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
        />
      </div>

      {/* Variable chips */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {VARIABLES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => insertVariable(v)}
            className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {v}
          </button>
        ))}
      </div>

      {/* Character counter */}
      <p className={`mt-2 text-right text-xs ${getCharCountColor(charCount)}`}>
        {charCount} belgi
      </p>

      {/* Live preview */}
      <div className="mt-3">
        <p
          className="mb-1.5 text-xs font-medium"
          style={{ color: "var(--brand-muted)" }}
        >
          Ko&apos;rinishi:
        </p>
        <div className="rounded-lg bg-gray-50 p-3 text-sm whitespace-pre-line text-gray-700">
          {preview}
        </div>
      </div>
    </Card>
  )
}

export function SmsSettings() {
  const [texts, setTexts] = useState<Record<string, string>>(
    Object.fromEntries(TEMPLATES.map((t) => [t.id, t.defaultText]))
  )
  const [saving, setSaving] = useState(false)

  function handleChange(id: string, value: string) {
    setTexts((prev) => ({ ...prev, [id]: value }))
  }

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("Saqlandi")
    }, 800)
  }

  return (
    <div className="space-y-6">
      {TEMPLATES.map((template) => (
        <TemplateEditor
          key={template.id}
          template={template}
          value={texts[template.id] ?? template.defaultText}
          onChange={(val) => handleChange(template.id, val)}
        />
      ))}

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
  )
}
