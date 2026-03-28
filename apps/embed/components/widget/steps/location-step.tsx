"use client"

import { useState } from "react"
import { MapPin, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useBookingDispatch } from "../booking-context"

const TASHKENT_DISTRICTS = [
  { value: "chilonzor", label: "Chilonzor tumani", lat: 41.2995, lng: 69.2401 },
  { value: "yunusobod", label: "Yunusobod tumani", lat: 41.3425, lng: 69.3044 },
  { value: "mirobod", label: "Mirobod tumani", lat: 41.3111, lng: 69.2833 },
  { value: "yakkasaroy", label: "Yakkasaroy tumani", lat: 41.2987, lng: 69.2714 },
  { value: "shayxontohur", label: "Shayxontohur tumani", lat: 41.3286, lng: 69.2523 },
  { value: "sergeli", label: "Sergeli tumani", lat: 41.2433, lng: 69.2200 },
]

// Default Tashkent center
const TASHKENT_CENTER = { lat: 41.311, lng: 69.279 }

export function LocationStep() {
  const dispatch = useBookingDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleGeolocation() {
    if (!navigator.geolocation) {
      setError("Brauzeringiz joylashuvni qo'llab-quvvatlamaydi")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch({
          type: "SET_LOCATION",
          payload: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: "Toshkent",
          },
        })
        setLoading(false)
        dispatch({ type: "NEXT_STEP" })
      },
      () => {
        setError("Joylashuvni aniqlash imkoni bo'lmadi. Tumanni tanlang.")
        setLoading(false)
      },
      { timeout: 10000 }
    )
  }

  function handleDistrictSelect(value: string) {
    const district = TASHKENT_DISTRICTS.find((d) => d.value === value)
    if (district) {
      dispatch({
        type: "SET_LOCATION",
        payload: {
          lat: district.lat,
          lng: district.lng,
          label: district.label,
        },
      })
      dispatch({ type: "NEXT_STEP" })
    }
  }

  return (
    <div className="flex flex-col gap-6 p-5">
      <Button
        onClick={handleGeolocation}
        disabled={loading}
        className="h-12 gap-2 rounded-xl text-base"
        style={{ backgroundColor: "var(--brand-primary)" }}
      >
        {loading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <MapPin className="size-5" />
        )}
        {loading ? "Aniqlanmoqda..." : "Joylashuvimni aniqlash"}
      </Button>

      {error && (
        <p className="text-center text-sm text-amber-600">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">yoki</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tumanni tanlang
        </label>
        <Select onValueChange={handleDistrictSelect}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Tuman tanlang..." />
          </SelectTrigger>
          <SelectContent>
            {TASHKENT_DISTRICTS.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
