"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Branch } from "@workspace/types"
import { getBusyInfo } from "@/lib/utils"

interface OrgMapProps {
  branches: Branch[]
}

export default function OrgMap({ branches }: OrgMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map)

    const markers: L.Marker[] = []

    for (const branch of branches) {
      const busy = getBusyInfo(branch.busyIndex)
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: ${busy.dotColor};
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const marker = L.marker([branch.lat, branch.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<strong>${branch.name}</strong><br/>${branch.address}<br/>~${branch.avgWaitMinutes} daq kutish`
        )

      markers.push(marker)
    }

    if (markers.length > 0) {
      const group = L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.2))
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [branches])

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}
