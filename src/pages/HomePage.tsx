import React from 'react';
import CalendarComponent from '../components/CalendarComponent';
import PinnedPostsComponent from '../components/PinnedPostsComponent';
// import AboutSection from '../components/AboutSection';

const HomePage: React.FC = () => {
  return (
    <main className='mt-4 mx-4 lg:grid grid-cols-4 gap-2'>
    
      <div className='col-span-1 '>
          {/* <div className='flex flex-grow justify-center px-4 py-1.5 text-xs p-0 rounded-md border border-zinc-700 ml-2 mr-2 md:max-w-xs transition-all"'><AboutSection/></div> */}
          <PinnedPostsComponent/>
      </div>
      <div className='col-span-3'>
          <CalendarComponent />
      </div>

        </main>
  );
};

export default HomePage;

