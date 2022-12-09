import { useState } from 'react';

const useShowMore = () => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowText = () => setShowMore(!showMore);

  return [showMore, toggleShowText];
};

export default useShowMore;
