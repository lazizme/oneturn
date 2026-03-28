"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Branch } from "@workspace/types"
import { getBusyInfo } from "@/lib/utils"

interface BranchMapProps {
  branch: Branch
  otherBranches: Branch[]
}

export default function BranchMap({ branch, otherBranches }: BranchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView([branch.lat, branch.lng], 14)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map)

    // Main branch pin (large)
    const busy = getBusyInfo(branch.busyIndex)
    const mainIcon = L.divIcon({
      className: "",
      html: `<div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${busy.dotColor};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })

    L.marker([branch.lat, branch.lng], { icon: mainIcon })
      .addTo(map)
      .bindPopup(
        `<strong>${branch.name}</strong><br/>${branch.address}<br/>~${branch.avgWaitMinutes} daq kutish`
      )

    // Other branches of same org (smaller, lighter)
    for (const other of otherBranches) {
      const otherBusy = getBusyInfo(other.busyIndex)
      const otherIcon = L.divIcon({
        className: "",
        html: `<div style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: ${otherBusy.dotColor};
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          opacity: 0.6;
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })

      L.marker([other.lat, other.lng], { icon: otherIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${other.name}</strong><br/>${other.address}`
        )
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [branch, otherBranches])

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}
