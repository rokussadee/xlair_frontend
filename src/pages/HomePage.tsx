import React from 'react';
import CalendarComponent from '../components/CalendarComponent';
import AnnouncementComponent from '../components/AnnouncementComponent';

const HomePage: React.FC = () => {
  return (
    <main className='mx-4'>
          <AnnouncementComponent />
          <CalendarComponent />
        </main>
  );
};

export default HomePage;

