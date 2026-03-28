"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import type { Branch } from "@workspace/types"

function getBusyColor(busyIndex: number) {
  if (busyIndex <= 40) return "#10B981"
  if (busyIndex <= 70) return "#F59E0B"
  return "#EF4444"
}

function createBranchIcon(busyIndex: number) {
  const color = getBusyColor(busyIndex)
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 700;
    ">${busyIndex}%</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

interface BranchMapProps {
  branches: Branch[]
}

export default function DashboardBranchMap({ branches }: BranchMapProps) {
  return (
    <MapContainer
      center={[41.311, 69.279]}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "100%", minHeight: "280px", borderRadius: "12px" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {branches.map((branch) => (
        <Marker
          key={branch.id}
          position={[branch.lat, branch.lng]}
          icon={createBranchIcon(branch.busyIndex)}
        >
          <Popup>
            <div style={{ minWidth: "160px" }}>
              <p style={{ fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                {branch.name}
              </p>
              <p style={{ fontSize: "11px", color: "#64748B" }}>
                {branch.currentQueue} kutmoqda · ~{branch.avgWaitMinutes} daq
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#64748B",
                }}
              >
                Operator paneli orqali boshqariladi
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
