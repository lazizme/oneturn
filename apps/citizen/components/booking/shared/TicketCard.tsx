"use client"

interface TicketCardProps {
  ticketNumber: string
  orgName: string
  branchName: string
  serviceName: string
  dateTime: string
  mode: "live" | "scheduled"
  phone?: string
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 9) return phone
  const d = digits.slice(-9)
  return `+998 ${d.slice(0, 2)} *** ** ${d.slice(7, 9)}`
}

export function TicketCard({
  ticketNumber,
  orgName,
  branchName,
  serviceName,
  dateTime,
  mode,
  phone,
}: TicketCardProps) {
  return (
    <div
      className="rounded-2xl border-2 overflow-hidden"
      style={{ borderColor: "var(--c-border)" }}
    >
      {/* Dashed top border effect */}
      <div
        className="w-full"
        style={{
          height: 4,
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--c-primary) 0, var(--c-primary) 8px, transparent 8px, transparent 16px)",
        }}
      />

      <div className="flex flex-col items-center px-6 py-6 text-center">
        {/* Org name */}
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--c-muted)" }}
        >
          {orgName}
        </p>

        {/* Ticket number */}
        <p
          className="font-mono text-5xl font-black mb-1"
          style={{
            color: "var(--c-primary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {ticketNumber}
        </p>

        {/* Divider */}
        <div
          className="w-full my-4"
          style={{
            height: 1,
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--c-border) 0, var(--c-border) 6px, transparent 6px, transparent 12px)",
          }}
        />

        {/* Details */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: "var(--c-muted)" }}>
              Xizmat
            </span>
            <span
              className="text-xs font-semibold text-right"
              style={{ color: "var(--c-text)" }}
            >
              {serviceName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: "var(--c-muted)" }}>
              Filial
            </span>
            <span
              className="text-xs font-semibold text-right"
              style={{ color: "var(--c-text)" }}
            >
              {branchName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: "var(--c-muted)" }}>
              Sana va vaqt
            </span>
            <span
              className="text-xs font-semibold text-right"
              style={{ color: "var(--c-text)" }}
            >
              {dateTime}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: "var(--c-muted)" }}>
              Tur
            </span>
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5"
              style={{
                backgroundColor:
                  mode === "live" ? "var(--c-accent)" : "var(--c-primary)",
                color: "white",
              }}
            >
              {mode === "live" ? "Jonli navbat" : "Bron qilingan"}
            </span>
          </div>

          {phone && (
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--c-muted)" }}>
                Telefon
              </span>
              <span
                className="text-xs font-semibold text-right"
                style={{ color: "var(--c-text)" }}
              >
                {maskPhone(phone)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
