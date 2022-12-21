import Header from '../header/header';
import Footer from './footer';
import HTMLHead from './head';

export interface IDefaultProps {
  children: React.ReactNode;
  header?: boolean;
  footer?: boolean;
}

const DefaultLayout = ({
  children,
  footer = true,
  header = true,
}: IDefaultProps) => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#000] w-full mx-auto max-w-screen-2xl">
      {header && <Header />}
      {children}
      {footer && <Footer />}
    </div>
  );
};

export default DefaultLayout;
