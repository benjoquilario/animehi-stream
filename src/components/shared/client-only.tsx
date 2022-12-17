import React, { useEffect, useState } from 'react';

type ClientOnlyProps = {
  children: React.ReactNode;
};

const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted ? <React.Fragment>{children}</React.Fragment> : null;
};

export default ClientOnly;
