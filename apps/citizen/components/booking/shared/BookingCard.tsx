"use client"

interface BookingCardProps {
  orgName: string
  branchName: string
  busyIndex: number
  isOpen: boolean
}

function getStatus(busyIndex: number): { color: string; label: string } {
  if (busyIndex < 40) {
    return { color: "#22c55e", label: "Bo'sh" }
  }
  if (busyIndex <= 70) {
    return { color: "#f59e0b", label: "O'rtacha" }
  }
  return { color: "#ef4444", label: "Band" }
}

export function BookingCard({
  orgName,
  branchName,
  busyIndex,
  isOpen,
}: BookingCardProps) {
  const status = getStatus(busyIndex)

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "var(--c-text)" }}
        >
          {orgName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-xs truncate"
            style={{ color: "var(--c-muted)" }}
          >
            {branchName}
          </span>
          {isOpen && (
            <>
              <span
                className="inline-block size-1.5 rounded-full shrink-0"
                style={{ backgroundColor: status.color }}
              />
              <span
                className="text-xs font-medium shrink-0"
                style={{ color: status.color }}
              >
                {status.label}
              </span>
            </>
          )}
          {!isOpen && (
            <span
              className="text-xs font-medium shrink-0"
              style={{ color: "var(--c-muted)" }}
            >
              Yopiq
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
