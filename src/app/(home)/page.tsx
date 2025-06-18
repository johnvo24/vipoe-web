import React from 'react'
import ShowPoem from './show_poem';
import Link from 'next/link';
import ShowWriters from './show_writer';
import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="bg-transparent">
      <Header 
        className="fixed top-0 left-0"
      />
      <div className="main pt-12 w-full">
        <div className="content flex mx-auto w-8/12 min-w-[960px] py-4">
          <div className="left-content flex-1 mr-4">
            <ShowPoem />
          </div>
          <div className="right-content w-1/4">
            {/* <PostCard className="mb-4"/> */}
            <div className="p-4 rounded-lg shadow-sm bg-white mb-2">
              <p className="font-bold text-lg mb-2">Themes & Topics</p>
              <Link 
                className="text-sm py-1 px-2 mb-1 w-fit hover:underline block text-gray-700 bg-gray-200 rounded-lg" 
                href={"#"}
              >Memory (<i>49 poems</i>)</Link>
              <Link 
                className="text-sm py-1 px-2 mb-1 w-fit hover:underline block text-gray-700 bg-gray-200 rounded-lg" 
                href={"#"}
              >Falling asleep or waking up (<i>42 poems</i>)</Link>
              <Link 
                className="text-sm py-1 px-2 mb-1 w-fit hover:underline block text-gray-700 bg-gray-200 rounded-lg" 
                href={"#"}
              >Growing older (<i>16 poems</i>)</Link>
              <Link 
                className="text-sm py-1 px-2 mb-1 w-fit hover:underline block text-gray-700 bg-gray-200 rounded-lg" 
                href={"#"}
              >When day becomes night (<i>21 poems</i>)</Link>
              <Link 
                className="text-sm py-1 px-2 mb-1 w-fit hover:underline block text-gray-700 bg-gray-200 rounded-lg" 
                href={"#"}
              >Fear and courage (<i>27 poems</i>)</Link>
              <Link 
                className="text-sm py-1 px-2 mb-1 w-fit hover:underline block text-gray-700 bg-gray-200 rounded-lg" 
                href={"#"}
              >Love and hatred (<i>134 poems</i>)</Link>
              <hr className="mt-4 mb-2"/>
              <p className="font-bold text-lg mb-2">Prominent Writers</p>
              <ShowWriters />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}