import React from 'react'
import Image from 'next/image';
import Medi from "../../../public/images/preview.jpg";

const Preview = () => {
  return (
      <div className="flex flex-row h-full">
        {/* Left Content - 50% */}
        <div className="w-1/2 flex flex-col py-[5rem] px-8 lg:px-16  ">
            <div className='leading-[1.7rem] sfpro text-[1.3rem] ' >
              welcome to
              <p className='  bg-gradient-to-br from-white to-slate-700 text-transparent bg-clip-text tracking-[0.2rem] leading-[2.2rem] not-italic unbounded text-[3rem] '>Lunora</p>
            </div>
            <div className="text-[1.3rem] text-gray-300 font-light mt-[0.8rem] mb-[2rem] tracking-wide">Your Gateway to Inner Peace and Tranquil Soundscapes</div>
            {/* FIX: Escaped the apostrophe in "you're" */}
            <div className='text-[1.2rem] sfpro tracking-wider '> Discover curated collection of meditation sounds designed to guide you towards deeper relaxation and mindful awareness. Whether you&apos;re seeking stress relief better sleep or enhanced focus, create your perfect sonic environment for transformation.</div>
            <blockquote className="border-l-2 border-green-400 pl-[1rem] mt-[3rem]  space-y-3">
                {/* FIX: Escaped quotes and apostrophe */}
                <p className=" mix-blend-difference text-[1rem] text-[#cbcbcb]  italic">
                  &quot;In the stillness between sounds, we find the profound silence where true healing begins. This platform doesn&apos;t just play audio—it opens doorways to inner wisdom.&quot;
                </p>
                <cite className="text-green-400 text-[0.8rem] font-medium block">
                  —  Sarah Mitchell, Mindfulness Coach & Sound Therapist
                </cite>
            </blockquote>
        </div>

        {/* Right Content - 50% */}
        <div className="w-1/2 flex items-center justify-center p-[4rem] ">
          <Image 
            src={Medi} 
            alt="meditation image" 
            className=" rounded-2xl shadow-[4px_4px_10px_rgba(255,255,255,0.1)] object-contain" 
          />
        </div>
      </div>
  )
}

export default Preview