"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { handleClick } from "@/utils/explorePageLogic"; // Your existing handleClick logic
import { items1 as initialItems } from "@/lib/data"; // Assuming this is the type

// Define the type for a single item
type Item = {
  id: string;
  name:string;
  description: string;
  imageUrl?: string;
  songUrl: string;
};

// Define props for the Carousel component
type CarouselProps = {
  items: Item[];
};

const ItemCard = ({ item, onPlayClick }:{ item: Item, onPlayClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => (
        <div className="item" key={item.name}
            style={{ backgroundImage: `url(${item.imageUrl})` }}>
          <div className="content-container">
            <div className="content ">
                <div className="name">{item.name}</div>
                <div className="des">{item.description}</div>
                <button onClick={onPlayClick} >Play</button>
                <div className="custom bg-[#e7e7e7] relative text-[#212121]   hidden">

                    <div className="music-duration w-full flex justify-between  ">
                        <span id="current-time">0:00</span>
                        <span id="duration">0:00</span>
                    </div>

                    <div className="player-progress bg-[#fff] absolute w-[90%] h-[6px] rounded-[5px] my-[2rem] cursor-pointer " id="player-progress">
                        <div className="progress bg-[#212121] rounded-[5px] w-[0%] h-full transition-[width] duration-100 ease-linear " id="progress"></div>
                    </div>
                    <div className="flex flex-col items-center w-full mt-2">
                        {/* Timer display */}
                        <p id="timer-display" className="text-gray-400 text-sm h-5"></p> {/* h-5 to prevent layout shift */}

                        {/* Timer buttons */}
                        <div className="flex items-center space-x-4 mt-1">
                            <button data-time="60" className="timer-btn bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                                1 min
                            </button>
                            <button data-time="180" className="timer-btn bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                                3 min
                            </button>
                            <button data-time="300" className="timer-btn bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                                5 min
                            </button>
                        </div>
                    </div>


                    <div className="player-controls  ">
                        <i className="fa-solid fa-backward" title="Previous" id="prevSong"></i>
                        <i className="fa-solid fa-play play-button" title="Play" data-role="play" ></i>
                        <i className="fa-solid fa-forward" title="Next" id="nextSong"></i>
                    </div>
                </div>
            </div>
          </div>
        </div>
    )

export default function Carousel({ items: initialItems }: CarouselProps) {
  const { user } = useUser();
  const [orderedItems, setOrderedItems] = useState<Item[]>(initialItems);

const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        // 1. Find the container from the clicked button
        const container = e.currentTarget.closest('.container');
        if (!container) return;

        // 2. Find the .slide and .item elements within the container
        const slide = container.querySelector('.slide');
        const items = slide?.querySelectorAll('.item');

        // 3. Manipulate the DOM directly
        if (slide && items && items.length > 0) {
            slide.appendChild(items[0]);
        }
    };

    const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
        // 1. Find the container from the clicked button
        const container = e.currentTarget.closest('.container');
        if (!container) return;

        // 2. Find the .slide and .item elements
        const slide = container.querySelector('.slide');
        const items = slide?.querySelectorAll('.item');

        // 3. Prepend the last item to the beginning of the slide
        if (slide && items && items.length > 0) {
            slide.prepend(items[items.length - 1]);
        }
    };

  return (
    <div className="container">
      <div className="slide">
        {initialItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onPlayClick={(e) => handleClick(e, item, user)}
          />
        ))}
      </div>
      <div className="button">
        <button className="prev" onClick={handlePrev}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className="next" onClick={handleNext}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}    
