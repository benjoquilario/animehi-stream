import React, { useState } from 'react';
import dayjs from '@/utils/time';

const AiringScheduling = () => {
  const today = dayjs();
  const todayIndex = today.day();

  const [selectedTab, setSelectedTab] = useState(todayIndex);

  console.log(todayIndex);
  const selectedDayOfWeek = dayjs().day(selectedTab);

  console.log(selectedDayOfWeek.startOf('day').unix());
  console.log(selectedDayOfWeek.endOf('day').unix());

  return <div>AiringScheduling</div>;
};

export default AiringScheduling;
