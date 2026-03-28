import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { SocialProof } from "@/components/social-proof"
import { HowItWorksOrg } from "@/components/how-it-works-org"
import { HowItWorksCitizen } from "@/components/how-it-works-citizen"
import { Features } from "@/components/features"
import { LiveDemo } from "@/components/live-demo"
import { Pricing } from "@/components/pricing"
import { CtaBanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorksOrg />
      <HowItWorksCitizen />
      <Features />
      <LiveDemo />
      <Pricing />
      <CtaBanner />
      <Footer />
    </main>
  )
}
