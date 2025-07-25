import React from 'react'
import Image from 'next/image';
import Medi from "../../../public/images/preview.jpg";

const Preview = () => {
  return (
    <div className=" text-white mt-10 h-[100vh] ">
      <div className="flex flex-row h-full">
        {/* Left Content - 50% */}
        <div className="w-1/2 flex items-center justify-center px-8 lg:px-16">
          <div className="max-w-2xl space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                <span className="text-white inter">
                  Welcome to 
                </span>
                <br/>
                <span className="bg-gradient-to-r from-green-400 inter  to-cyan-400 bg-clip-text text-transparent">
                  Lunora
                </span>
              </h1>

              {/* Subheading */}
              <h2 className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
                Your Gateway to Inner Peace and Tranquil Soundscapes
              </h2>
            </div>

            {/* Description */}
            <div className="py-6 inter">
              <p className="text-gray-400 mt-2 text-lg leading-relaxed">
                Discover a curated collection of meditation sounds designed to guide you toward deeper relaxation and mindful awareness. Our immersive audio library features nature sounds, ambient music, binaural beats, and guided meditations crafted to help you find balance in today's chaotic world. Whether you're seeking stress relief, better sleep, or enhanced focus, create your perfect sonic environment for transformation.
              </p>

              <div className="h-px w-24 bg-gradient-to-r from-green-400 to-transparent"></div>
            </div>

            {/* Quotes */}
            <div className="">
              <blockquote className="border-l-2 border-green-400 pl-6 space-y-3">
                <p className="text-gray-300 text-lg italic">
                  "In the stillness between sounds, we find the profound silence where true healing begins. This platform doesn't just play audio—it opens doorways to inner wisdom."
                </p>
                <cite className="text-green-400 text-sm font-medium block">
                  —  Sarah Mitchell, Mindfulness Coach & Sound Therapist
                </cite>
              </blockquote>

             
            </div>

            {/* CTA Button */}
            {/* <div className="pt-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25">
                <span className="relative z-10">Experience the Future</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div> */}
          </div>
        </div>
        
        {/* Right Content - 50% */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <Image 
            src={Medi} 
            alt="meditation image" 
            className=" rounded-2xl object-contain" 
          />
        </div>
      </div>
    </div>
  )
}

export default Preview