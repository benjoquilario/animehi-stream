import React from "react"
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Policies - Privacy Policy",
}

const PrivacyPolicy = () => {
  return (
    <div className="px-[2%]">
      <div className="mt-4 flex items-start gap-2">
        <h1 className="text-3xl">Privacy Policy</h1>
        <div className="rounded-full bg-secondary/50 p-2 text-xs font-semibold">
          User Data Protection
        </div>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Data Collection</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            User Minimal
          </div>
        </div>
        <p className="mt-2 text-lg">
          We collect minimal user data necessary for the functioning of AnimeHi,
          such as account information, user preferences, and interaction data.
          This information helps us provide a personalized experience and
          improve our services.
        </p>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Use of Data</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            Service Quality
          </div>
        </div>
        <p className="mt-2 text-lg">
          The data collected is used to enhance service quality and user
          experience. We utilize this data to tailor content recommendations,
          improve site functionality, and address user concerns effectively. We
          do not share personal data with third parties except as required by
          law or to protect our legal rights.
        </p>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Cookies and Tracking</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            Enhanced Experience
          </div>
        </div>
        <p className="mt-2 text-lg">
          AnimeHi uses cookies and similar tracking technologies to enhance the
          user experience. These technologies help with functions like caching
          video timestamps, tracking watched content, and remembering user
          preferences. Users can manage cookie settings through their browser,
          though some site features may be affected.
        </p>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Third-Party Services</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            Read Policies
          </div>
        </div>
        <p className="mt-2 text-lg">
          Embedded videos from third-party sites may have their own privacy
          policies. We advise users to read these policies on the respective
          sites, as AnimeHi is not responsible for the privacy practices of
          these external providers.
        </p>
      </div>

      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Security</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            Data Protection
          </div>
        </div>
        <p className="mt-2 text-lg">
          We are committed to ensuring your data is secure but remind users that
          no method of transmission over the Internet is 100% secure. We employ
          various security measures to protect your personal information and
          regularly review our practices to enhance data security.
        </p>
      </div>
    </div>
  )
}

export default PrivacyPolicy
