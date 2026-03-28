"use client"

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { tashkentDistricts } from "@workspace/mock-data"

export interface LocationData {
  id: string
  name: string
  lat: number
  lng: number
}

interface LocationContextValue {
  location: LocationData
  setLocation: (loc: LocationData) => void
}

const defaultLocation: LocationData = {
  id: "chilonzor",
  name: "Chilonzor tumani",
  lat: 41.2880,
  lng: 69.2200,
}

function getInitialLocation(): LocationData {
  if (typeof window === "undefined") return defaultLocation
  try {
    const stored = localStorage.getItem("oneturn-location")
    if (stored) {
      const parsed = JSON.parse(stored)
      const match = tashkentDistricts.find((d) => d.id === parsed.id)
      if (match) return { ...match }
    }
  } catch {
    // ignore
  }
  return defaultLocation
}

const LocationContext = createContext<LocationContextValue>({
  location: defaultLocation,
  setLocation: () => {},
})

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationData>(getInitialLocation)

  function setLocation(loc: LocationData) {
    setLocationState(loc)
    localStorage.setItem("oneturn-location", JSON.stringify(loc))
  }

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  return useContext(LocationContext)
}
