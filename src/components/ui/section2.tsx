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
import Mantras from '../../../public/images/mantras.png'

interface Playlist {
  title: string
  description: string
  image: string | StaticImageData
}

const Section2: React.FC = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const triggerRef = useRef<HTMLDivElement>(null);

//   gsap.registerPlugin(ScrollTrigger);

// useEffect(()=>{
//   const pin=gsap.fromTo(sectionRef.current,{
//     translateX:0
//   },{
//     translateX:"-230vw",
//     ease:"none",
//     duration:2,
//     scrollTrigger:{
//       trigger: triggerRef.current,
//       start:"top 15%",
//       end:"+=235",
//       scrub: 0.9,
//       anticipatePin: 1,

//     }
//   })
// },[])

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
      title: "Mantras & Chants",
      description: "Traditional chants, powerful mantras, and sacred sound frequencies designed to harmonize mind, body, and spirit through ancient vocal wisdom.",
      image: Mantras
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
    <div className=' my-[3rem] '>
      <div className=' mb-[2rem] flex items-center ' >
        <h1 className='text-left px-14 text-[2rem] font-sans font-black'>RECOMMENDED <span className='underline ml-[0.5rem] unbounded ' >playlists</span></h1>
      </div>
      <div className='playlists mx-[1rem] flex items-center gap-4 overflow-x-scroll h-[82%] '>
        {playlists.map((playlist, index) => (
          <div key={index} className='flex-shrink-0 flex flex-col items-center mb-[3.5rem] rounded-lg w-[29vw]'>
            <Image 
              src={playlist.image} 
              alt={playlist.title} 
              width={200}
              height={200}
              className='w-[18rem] h-[18rem] object-cover rounded-lg mb-4' 
            />
            {/* <h2 className='text-lg font-semibold mb-2 text-center'>{playlist.title}</h2> */}
            <p className='text-sm w-[85%] text-left text-gray-400'>{playlist.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Section2