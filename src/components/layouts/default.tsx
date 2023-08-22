import Header from "../header/header"
import Footer from "./footer"

export interface IDefaultProps {
  children: React.ReactNode
  header?: boolean
  footer?: boolean
}

const DefaultLayout = ({
  children,
  footer = true,
  header = true,
}: IDefaultProps) => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-screen-2xl overflow-x-hidden bg-black">
      {header && <Header />}
      {children}
      {footer && <Footer />}
    </div>
  )
}

export default DefaultLayout
