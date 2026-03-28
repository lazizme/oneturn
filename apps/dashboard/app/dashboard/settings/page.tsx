"use client"

import { useEffect, useState } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Topbar } from "@/components/topbar"
import { OrgSettings } from "@/components/settings/org-settings"
import { WidgetSettings } from "@/components/settings/widget-settings"
import { SmsSettings } from "@/components/settings/sms-settings"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <>
        <Topbar title="Sozlamalar" />
        <div className="flex-1 overflow-auto p-6">
          <Skeleton className="mb-6 h-10 w-80 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[160px] rounded-xl" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar title="Sozlamalar" />
      <div className="flex flex-1 flex-col overflow-hidden p-6">
        <Tabs defaultValue="org" className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="mb-6 w-fit rounded-xl">
            <TabsTrigger
              value="org"
              className="rounded-lg px-4 py-1.5 text-xs font-medium data-[state=active]:text-white"
              style={{ "--tw-shadow-color": "var(--brand-primary)" } as React.CSSProperties}
            >
              Tashkilot
            </TabsTrigger>
            <TabsTrigger
              value="widget"
              className="rounded-lg px-4 py-1.5 text-xs font-medium data-[state=active]:text-white"
            >
              Widget
            </TabsTrigger>
            <TabsTrigger
              value="sms"
              className="rounded-lg px-4 py-1.5 text-xs font-medium data-[state=active]:text-white"
            >
              SMS shablonlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="org" className="flex-1 overflow-auto">
            <OrgSettings />
          </TabsContent>

          <TabsContent value="widget" className="flex-1 overflow-auto">
            <WidgetSettings />
          </TabsContent>

          <TabsContent value="sms" className="flex-1 overflow-auto">
            <SmsSettings />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
