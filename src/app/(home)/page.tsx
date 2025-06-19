import React from 'react'
import ShowPoem from './show_poem';
import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="bg-white">
      <Header 
        className="fixed top-0 left-0 min-w-[320px]"
      />
      <div className="main pt-14 w-full max-w-[640px] mx-auto">
        <div className="content flex mx-auto">
          <div className="main-content flex-1">
            <ShowPoem />
          </div>
        </div>
      </div>
    </div>
  );
}