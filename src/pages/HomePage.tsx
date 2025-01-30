import React from 'react';
import CalendarComponent from '../components/CalendarComponent';
import PinnedPostsComponent from '../components/PinnedPostsComponent';

const HomePage: React.FC = () => {
  return (
    <main className='mx-4'>
          <PinnedPostsComponent></PinnedPostsComponent>
          <CalendarComponent />
        </main>
  );
};

export default HomePage;

