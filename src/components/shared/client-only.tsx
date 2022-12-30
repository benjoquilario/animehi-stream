import React, { useEffect, useState } from 'react';

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted ? <React.Fragment>{children}</React.Fragment> : null;
};

export default ClientOnly;
