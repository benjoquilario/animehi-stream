import React from "react"
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Policies - Terms of Service",
}

const TermsOfService = () => {
  return (
    <div className="px-[2%]">
      <div className="mt-4 flex items-start gap-2">
        <h1 className="text-3xl">Terms of Service</h1>
        <div className="rounded-full bg-secondary/50 p-2 text-xs font-semibold">
          User Agreement
        </div>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Acceptance of Terms </h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            Agreement
          </div>
        </div>
        <p className="mt-2 text-lg">
          By using AnimeHi, you agree to these Terms of Service and acknowledge
          that they affect your legal rights and obligations. If you do not
          agree with any part of these terms, you must not use our services.
        </p>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Content</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            Third-Party Sources
          </div>
        </div>
        <p className="mt-2 text-lg">
          AnimeHi does not host video content but embeds videos from various
          third-party sources. We are not responsible for the content, quality,
          or policies of these external sites. Users are advised to review the
          terms and privacy policies of these third-party providers before
          interacting with their content.
        </p>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Use of Site</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            User Responsibility
          </div>
        </div>
        <p className="mt-2 text-lg">
          The service is provided &quot;as is&quot; and is used at the user’s
          own risk. Users must not misuse the service in any way that breaches
          laws or regulations. Misuse includes, but is not limited to,
          unauthorized access, data mining, and distribution of harmful content.
        </p>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">User Content</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            Community Standards
          </div>
        </div>
        <p className="mt-2 text-lg">
          Users may share content, such as comments or reviews, responsibly. We
          reserve the right to remove any content that violates our policies or
          is deemed inappropriate. Users are encouraged to report any content
          that violates these standards.
        </p>
      </div>

      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Intellectual Property</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            Rights and Ownership
          </div>
        </div>
        <p className="mt-2 text-lg">
          The intellectual property rights of the embedded videos remain with
          their respective owners. AnimeHi respects these rights and does not
          claim ownership of this content. Users must not infringe on the
          intellectual property rights of others while using our service.
        </p>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Changes to Terms of Service</h2>
          <div className="rounded-full bg-primary/50 p-2 px-3 text-xs font-semibold">
            Updates
          </div>
        </div>
        <p className="mt-2 text-lg">
          We reserve the right to modify these terms at any time. Continued use
          of the site after changes constitutes acceptance of the new terms.
          Users are encouraged to review the terms periodically to stay informed
          of any updates.
        </p>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="mt-4 flex items-start gap-2">
          <h2 className="text-2xl">Termination</h2>
          <div className="rounded-full bg-destructive/50 p-2 px-3 text-xs font-semibold">
            Account Suspension
          </div>
        </div>
        <p className="mt-2 border border-destructive bg-destructive/40 p-4 text-lg text-destructive">
          We may terminate or suspend access to our service immediately, without
          prior notice, for any breach of these Terms. Upon termination, users
          must cease all use of the service and any provisions of these terms,
          which by their nature should survive termination, shall remain in
          effect.
        </p>
      </div>
    </div>
  )
}

export default TermsOfService
