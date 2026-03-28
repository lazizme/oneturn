"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import type { Branch } from "@workspace/types"
import { citizenOrganizations } from "@workspace/mock-data"
import { getBusyInfo } from "@/lib/utils"

function createBranchIcon(busyIndex: number) {
  const busy = getBusyInfo(busyIndex)
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: ${busy.dotColor};
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

interface LeafletMapProps {
  branches: Branch[]
}

export default function LeafletMap({ branches }: LeafletMapProps) {
  return (
    <MapContainer
      center={[41.311, 69.279]}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {branches.map((branch) => {
        const org = citizenOrganizations.find((o) => o.id === branch.orgId)
        const busy = getBusyInfo(branch.busyIndex)
        return (
          <Marker
            key={branch.id}
            position={[branch.lat, branch.lng]}
            icon={createBranchIcon(branch.busyIndex)}
          >
            <Popup>
              <div style={{ minWidth: "180px" }}>
                <p style={{ fontWeight: 700, fontSize: "13px", marginBottom: "2px" }}>
                  {branch.name}
                </p>
                <p style={{ fontSize: "11px", color: "#64748B", marginBottom: "6px" }}>
                  {org?.name}
                </p>
                <p style={{ fontSize: "11px", color: "#64748B" }}>
                  {branch.currentQueue} kutmoqda · ~{branch.avgWaitMinutes} daq
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: busy.dotColor,
                    }}
                  />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: busy.dotColor }}>
                    {busy.label}
                  </span>
                </div>
                <a
                  href={`/org/${branch.orgId}/${branch.id}`}
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "4px 12px",
                    borderRadius: "8px",
                    backgroundColor: "#2563EB",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Navbat olish →
                </a>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
