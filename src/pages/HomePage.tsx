import React from 'react';
import CalendarComponent from '../components/CalendarComponent';
import PinnedPostsComponent from '../components/PinnedPostsComponent';

const HomePage: React.FC = () => {
  return (
    <main className='mx-4 lg:grid grid-cols-4 gap-2'>
      <div className='col-span-1 '>
          <PinnedPostsComponent/>
      </div>
      <div className='col-span-3'>
          <CalendarComponent />
      </div>
        </main>
  );
};

export default HomePage;

