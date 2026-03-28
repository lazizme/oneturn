"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import type { Branch } from "@workspace/types"
import { useEffect } from "react"

function getBusyColor(busyIndex: number) {
  if (busyIndex <= 40) return "#10B981"
  if (busyIndex <= 70) return "#F59E0B"
  return "#EF4444"
}

function createBusyIcon(busyIndex: number) {
  const color = getBusyColor(busyIndex)
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: 700;
    ">${busyIndex}%</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function MapBounds({
  branches,
  userLocation,
}: {
  branches: Branch[]
  userLocation: { lat: number; lng: number } | null
}) {
  const map = useMap()

  useEffect(() => {
    const points: [number, number][] = branches.map((b) => [b.lat, b.lng])
    if (userLocation) {
      points.push([userLocation.lat, userLocation.lng])
    }
    if (points.length > 0) {
      map.fitBounds(points, { padding: [30, 30] })
    }
  }, [branches, userLocation, map])

  return null
}

interface BranchMapProps {
  branches: Branch[]
  userLocation: { lat: number; lng: number; label?: string } | null
  onSelectBranch: (branch: Branch) => void
}

export default function BranchMap({
  branches,
  userLocation,
  onSelectBranch,
}: BranchMapProps) {
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [41.311, 69.279]

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "200px", borderRadius: "12px" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBounds branches={branches} userLocation={userLocation} />

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={L.divIcon({
            className: "user-marker",
            html: `<div style="
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #2563EB;
              border: 3px solid white;
              box-shadow: 0 0 0 4px rgba(37,99,235,0.3);
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
        />
      )}

      {branches.map((branch) => (
        <Marker
          key={branch.id}
          position={[branch.lat, branch.lng]}
          icon={createBusyIcon(branch.busyIndex)}
          eventHandlers={{
            click: () => onSelectBranch(branch),
          }}
        >
          <Popup>
            <div className="text-xs">
              <strong>{branch.name}</strong>
              <br />
              {branch.currentQueue} kutmoqda · ~{branch.avgWaitMinutes} daq
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
