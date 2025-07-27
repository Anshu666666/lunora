import React from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { StaticImageData } from 'next/image'
import Nature from '../../../public/images/nature.png'
import Classic from '../../../public/images/classic.png'
import WhiteNoise from '../../../public/images/whitenoise.png'
import Urban from '../../../public/images/urban.png'
import Asmr from '../../../public/images/asmr.png'

interface Playlist {
  title: string
  description: string
  image: string | StaticImageData
}

const Section2: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  gsap.registerPlugin(ScrollTrigger);

useEffect(()=>{
  const pin=gsap.fromTo(sectionRef.current,{
    translateX:0
  },{
    translateX:"-300vw",
    ease:"none",
    duration:2,
    scrollTrigger:{
      trigger: triggerRef.current,
      start:"top top",
      end:"100 top",
      scrub: 0.9,
    }
  })
},[])

  const playlists: Playlist[] = [
    {
      title: "Chill Vibes",
      description: "Pure, unfiltered sounds from nature including gentle rain, ocean waves, forest ambience, and birdsong to reconnect you with earth's tranquil rhythms.",
      image: Nature 
    },
    {
      title: "Classical Essentials",
      description: "Timeless piano and orchestral pieces from classical masters, curated for deep relaxation and mental clarity.",
      image: Classic 
    },
    {
      title: "White Noise",
      description: "Consistent, soothing white noise and ambient tones designed to mask distractions, enhance concentration, and promote restful sleep.",
      image: WhiteNoise
    },
    {
      title: "Urban Beats",
      description: "Therapeutic background sounds including coffee shop ambience, gentle rain on windows, and city soundscapes designed to create familiar comfort and focus.",
      image: Urban
    },
    {
      title: "ASMR Bliss",
      description: "Gentle whispers, soft tapping, and soothing trigger sounds designed to create tingling relaxation and deep stress relief.",
      image: Asmr
    }
  ]

  return (
    <div ref={triggerRef}>
      <div >
        <h1 className='text-center'>Our top Playlists</h1>
      </div>
      <div ref={sectionRef} className='flex gap-4 overflow-hidd en  p-4'>
        {playlists.map((playlist, index) => (
          <div key={index} className='flex-shrink-0 flex flex-col items-center p-4 rounded-lg w-[32vw]'>
            <Image 
              src={playlist.image} 
              alt={playlist.title} 
              width={200}
              height={200}
              className='w-78 h-78 object-cover rounded-lg mb-4' 
            />
            <h2 className='text-lg font-semibold mb-2 text-center'>{playlist.title}</h2>
            <p className='text-sm w-1/3 text-gray-400 text-center'>{playlist.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Section2