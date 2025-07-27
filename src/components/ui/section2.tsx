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
    <div className=' '>
      <div >
        <h1 className='text-left px-14 font-sans p-5 font-black'>RECOMMENDED PLAYLISTS</h1>
      </div>
      <div className='playlists flex gap-4 p-4 overflow-x-scroll'>
        {playlists.map((playlist, index) => (
          <div key={index} className='flex-shrink-0 flex flex-col items-center p-4 rounded-lg w-[32vw]'>
            <Image 
              src={playlist.image} 
              alt={playlist.title} 
              width={200}
              height={200}
              className='w-78 h-78 object-cover rounded-lg mb-4' 
            />
            {/* <h2 className='text-lg font-semibold mb-2 text-center'>{playlist.title}</h2> */}
            <p className='text-sm w-[80%] text-left text-gray-400'>{playlist.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Section2