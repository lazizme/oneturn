"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon, ZapIcon } from "@hugeicons/core-free-icons"
import { useBooking } from "@/lib/booking"
import { getAvailableSlots } from "@/lib/booking/mock-api"
import { SlotPicker } from "../shared/SlotPicker"

const UZ_DAY_SHORT = ["Ya", "Du", "Se", "Cho", "Pa", "Ju", "Sha"]
const UZ_MONTH_SHORT = [
  "yan", "fev", "mar", "apr", "may", "iyn",
  "iyl", "avg", "sen", "okt", "noy", "dek",
]

function getDayLabel(date: Date, index: number): string {
  if (index === 0) return "Bugun"
  if (index === 1) return "Ertaga"
  return UZ_DAY_SHORT[date.getDay()]!
}

function buildNext7Days(): { date: Date; iso: string }[] {
  const days: { date: Date; iso: string }[] = []
  const now = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const iso = d.toISOString().split("T")[0]!
    days.push({ date: d, iso })
  }
  return days
}

interface StepSlotProps {
  onAdvanceScheduled: () => void
}

export function StepSlot({ onAdvanceScheduled }: StepSlotProps) {
  const { state, dispatch } = useBooking()
  const [activePanel, setActivePanel] = useState<"scheduled" | "live">(
    state.selectedMode === "live" ? "live" : "scheduled",
  )
  const scrollRef = useRef<HTMLDivElement>(null)

  const days = useMemo(() => buildNext7Days(), [])

  // Load slots when date changes in scheduled mode
  useEffect(() => {
    if (state.step !== "slot") return
    if (activePanel !== "scheduled") return

    let cancelled = false

    async function load() {
      dispatch({ type: "SLOTS_LOADING" })
      try {
        const slots = await getAvailableSlots(
          state.branch?.id ?? "",
          state.selectedServiceId ?? "",
          new Date(state.selectedDate),
        )
        if (!cancelled) {
          dispatch({ type: "SLOTS_LOADED", slots })
        }
      } catch {
        if (!cancelled) {
          dispatch({ type: "SLOTS_LOADED", slots: [] })
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [state.step, activePanel, state.selectedDate, state.branch?.id, state.selectedServiceId, dispatch])

  const branch = state.branch

  return (
    <div>
      {/* Panel Toggle */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => setActivePanel("scheduled")}
          className="rounded-xl px-3 py-3 text-center text-sm font-medium transition-all"
          style={{
            border: activePanel === "scheduled"
              ? "2px solid var(--c-primary)"
              : "1px solid var(--c-border)",
            backgroundColor: activePanel === "scheduled"
              ? "var(--c-primary-light)"
              : "transparent",
            color: activePanel === "scheduled"
              ? "var(--c-primary)"
              : "var(--c-muted)",
          }}
        >
          <span className="inline-flex items-center gap-1.5"><HugeiconsIcon icon={Calendar01Icon} size={14} /> Vaqt band qilish</span>
        </button>
        <button
          onClick={() => setActivePanel("live")}
          className="rounded-xl px-3 py-3 text-center text-sm font-medium transition-all"
          style={{
            border: activePanel === "live"
              ? "2px solid var(--c-primary)"
              : "1px solid var(--c-border)",
            backgroundColor: activePanel === "live"
              ? "var(--c-primary-light)"
              : "transparent",
            color: activePanel === "live"
              ? "var(--c-primary)"
              : "var(--c-muted)",
          }}
        >
          <span className="inline-flex items-center gap-1.5"><HugeiconsIcon icon={ZapIcon} size={14} /> Hozir kelish</span>
        </button>
      </div>

      {/* Scheduled Panel */}
      {activePanel === "scheduled" && (
        <div>
          {/* Date Selector */}
          <div
            ref={scrollRef}
            className="mb-4 flex gap-2 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {days.map((day, i) => {
              const isActive = state.selectedDate === day.iso
              return (
                <button
                  key={day.iso}
                  onClick={() => dispatch({ type: "SELECT_DATE", date: day.iso })}
                  className="flex shrink-0 flex-col items-center rounded-xl px-3 py-2 transition-all"
                  style={{
                    minWidth: 60,
                    backgroundColor: isActive ? "var(--c-primary)" : "transparent",
                    color: isActive ? "white" : "var(--c-text)",
                    border: isActive
                      ? "1px solid var(--c-primary)"
                      : "1px solid var(--c-border)",
                  }}
                >
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: isActive ? "rgba(255,255,255,0.8)" : "var(--c-muted)",
                    }}
                  >
                    {getDayLabel(day.date, i)}
                  </span>
                  <span className="text-lg font-bold">
                    {day.date.getDate()}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{
                      color: isActive ? "rgba(255,255,255,0.8)" : "var(--c-muted)",
                    }}
                  >
                    {UZ_MONTH_SHORT[day.date.getMonth()]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Slot Picker */}
          <SlotPicker
            slots={state.slots}
            loading={state.slotsLoading}
            selectedSlot={state.selectedSlot}
            onSelect={(slot: string) => dispatch({ type: "SELECT_SLOT", slot })}
          />

          {/* Continue Button */}
          {state.selectedSlot && (
            <button
              onClick={() => {
                dispatch({ type: "SELECT_MODE", mode: "scheduled" })
                onAdvanceScheduled()
              }}
              className="mt-4 w-full rounded-xl py-3 text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: "var(--c-primary)" }}
            >
              {"Davom \u2192"}
            </button>
          )}
        </div>
      )}

      {/* Live Panel */}
      {activePanel === "live" && branch && (
        <div>
          <div
            className="mb-4 rounded-xl p-4"
            style={{ backgroundColor: "var(--c-surface)" }}
          >
            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--c-muted)" }}>
                  Navbatdagilar
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--c-text)" }}
                >
                  {branch.currentQueue} kishi navbatda
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--c-muted)" }}>
                  Kutish vaqti
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--c-text)" }}
                >
                  ~{branch.avgWaitMinutes} daqiqa kutish
                </span>
              </div>
            </div>

            <div
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: "var(--c-primary-light)",
                border: "1px dashed var(--c-primary)",
              }}
            >
              <p className="text-xs" style={{ color: "var(--c-muted)" }}>
                Taxminiy chipta raqamingiz
              </p>
              <p
                className="text-2xl font-black"
                style={{ color: "var(--c-primary)" }}
              >
                A-{branch.currentQueue + 1}
              </p>
              <p className="text-[10px]" style={{ color: "var(--c-muted)" }}>
                (taxminiy)
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch({ type: "JOIN_LIVE_QUEUE" })}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all"
            style={{ backgroundColor: "var(--c-accent)" }}
          >
            <span className="inline-flex items-center gap-1.5"><HugeiconsIcon icon={ZapIcon} size={14} /> Navbatga kirish {"\u2192"}</span>
          </button>
        </div>
      )}
    </div>
  )
}
