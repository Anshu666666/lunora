"use client";
import Image from "next/image";
import { gsap } from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import { LogIn } from 'lucide-react';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { MouseEvent } from "react";
import { SignInButton } from "@clerk/nextjs";
import NavBar from "@/components/ui/navbar";
import Grid from "@/components/ui/grid";
import Preview from "@/components/ui/preview";
import Section2 from "@/components/ui/section2";

export default function Home() {
  const containerRef = useRef(null);
  const page1Ref = useRef(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const popup = useRef(null);
  const relax = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gradientVideoRef = useRef<HTMLVideoElement>(null);

  const [showPopup, setShowPopup] = useState(false);

  const closePopup = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    gsap.to(popup.current, {
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setShowPopup(false);
      }
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

gsap.to(page2Ref.current, {
    y: "0%",
    duration: 5,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: page1Ref.current,
      start: "top top",
      end: "bottom top", // Increased scroll distance
      scrub: true, // Smoother lag
      pin: true,
      anticipatePin: 1,
      // Add this for debugging
          onUpdate: (self) => {
      console.log("Scrub progress:", self.progress);
    }
    }
  });

    gsap.fromTo(relax.current, { opacity: 0 },
      {
        opacity: 1,
        yPercent: 12,
        duration: 1,
        ease: ""
      }
    )

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // Change this value to your desired speed
    }

    if (gradientVideoRef.current) {
      gradientVideoRef.current.playbackRate = 0.3; // Change this value to your desired speed
    }

    // Delay popup display by 2 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Use useLayoutEffect so GSAP runs *after* DOM is committed but before paint
  useLayoutEffect(() => {
    if (showPopup && popup.current) {
      gsap.fromTo(popup.current, { scale: 0.9 }, {
        scale: 1,
        duration: 1,
        ease: "power3.out"
      });
    }
  }, [showPopup]);

  return (
    <>

      <div className=" z-50 fixed top-[0.6rem] right-[1rem] ">
        <SignInButton mode="modal" appearance={{
          elements: {
            modalBackdrop: "!bg-[#4a90e2]/10",
            card: " !backdrop-blur-md !bg-[rgba(13,19,30,0.1)] !border-white/20 !rounded-xl !shadow-2xl", // for all Clerk modals
          }
        }}>
          <div className=" flex h-[3rem] px-[1.3rem] cursor-pointer text-gray-200  items-center bg-[#0000003e] backdrop-blur-lg border border-[#a4a4a434] shadow-[4px_3px_10px_rgba(255,255,255,0.2)] rounded-2xl gap-[0.5rem] text-[1rem] ">
            <span className="text-[1.1rem] sfpro " >Sign In</span>
          </div>
        </SignInButton>
      </div>
      {/* {showPopup && (
        <div
          ref={popup}
          onClick={closePopup}
          className="fixed inset-0 flex scale-90 items-center justify-center z-50"
        >
          <div className="backdrop-blur-md bg-[rgba(13,19,30,0.2)] border-white/20 rounded-xl  shadow-2xl p-8 max-w-md mx-4 text-center border">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome!</h2>
            <p className="text-gray-600">This is an animated popup that appears on load.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )} */}


      <div ref={containerRef} className="relative w-full">
        {/* Page 1: The element that gets pinned */}
        <div
          ref={page1Ref}
          className="page1 w-full h-[100vh] flex items-center justify-center text-4xl text-white z-0 relative"
        >
          <Image
            src='/images/original-image.png'
            alt="image"
            fill
            className="bg-image z-0" // Use object-fit, not w-full/h-full
          />
          <div ref={relax} className="relax opacity-0 absolute text-[18rem] w-[62vw] top-1/2 left-1/2 -translate-y-[58%] -translate-x-[46%] z-1 britannic">relax.</div>
          <Image
            src='/images/layer.png'
            alt="image"
            width={1836}
            height={400}
            className=" absolute z-2 w-full h-[47.5vh] bottom-0  " // Use object-fit, not w-full/h-full
          />
        </div>

        <div
          ref={page2Ref}
          className="page2 w-full h-[340vh] bg-[#00000000] shadow-[0px_-5px_10px_rgba(0,0,0,0.3)] rounded-tl-[50px] rounded-tr-[50px] absolute top-[120vh] left-0 flex flex-col items-center pt-10 text-4xl text-white z-10"
        >
          <video
            ref={gradientVideoRef}
            autoPlay
            loop
            muted
            playsInline
            className='absolute top-0 left-0 w-full h-[100%] rounded-tl-[50px] rounded-tr-[50px] object-cover '
          > {/* Increase the Height percent to increase the length of the video background */}
            <source src="/videos/bg-neon.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 backdrop-blur-3xl mb-0 rounded-tl-[50px] rounded-tr-[50px] bg-[#0000] " >
            <div className="preview m-3 h-[120vh]">
              <Preview />
            </div>
            <div className="grid h-[120vh] w-[100vw] ">
              <Grid />
            </div>
            <div className="hero w-[100vw] ">
              <Section2 />
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
