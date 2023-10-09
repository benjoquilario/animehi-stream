import SiteFooter from "@/components/site-footer"
import SiteHeader from "@/components/site-header"

interface StickyLayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: StickyLayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter />
    </div>
  )
}
