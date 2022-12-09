import Header from '../header/header';
import HTMLHead from './head';

export interface IDefaultProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: IDefaultProps) => {
  return (
    <>
      <HTMLHead />
      <body>
        <Header />
        {children}
      </body>
    </>
  );
};

export default DefaultLayout;
