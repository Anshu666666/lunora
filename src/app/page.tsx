"use client";
import Image from "next/image";
import { gsap } from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { MouseEvent } from "react";
import { SignInButton } from "@clerk/nextjs";
import Grid from "@/components/ui/grid";

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
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: page1Ref.current,
        start: "top top",
        end:  "bottom+=50% top",
        scrub: 3,
        pin: true,
        anticipatePin: 1,
      }
    });

      gsap.fromTo(relax.current,{ opacity: 0 },
        {
          opacity: 1,
          yPercent: 12,
          delay: 0.5, duration: 2
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
      {showPopup && (
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
      )}

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
          <Image
            src='/images/relax.png'
            alt="image"
            width={1213}
            height={366}
            ref={relax}
            className="fg-image absolute opacity-0 w-[62vw] top-1/2 left-1/2 -translate-y-[60%] -translate-x-[47%] z-1" // Use object-fit, not w-full/h-full
          />
          <Image
            src='/images/layer.png'
            alt="image"
            width={1836}
            height={400}
            className=" absolute z-2 w-full h-[47.5vh] bottom-0  " // Use object-fit, not w-full/h-full
          />
                    <div className="absolute top-0 z-50">
            <SignInButton mode="modal" appearance={{
              elements: {
                modalBackdrop: "!bg-[#4a90e2]/10",
                card: " !backdrop-blur-md !bg-[rgba(13,19,30,0.1)] !border-white/20 !rounded-xl !shadow-2xl", // for all Clerk modals
              }
            }} />
          </div>
          </div>

          <div
            ref={page2Ref}
            className="page2 w-full h-[300vh] bg-[#00000000] absolute top-[100vh] left-0 flex flex-col items-center pt-10 text-4xl text-white z-10"
          >
                      <video
            ref={gradientVideoRef}
            autoPlay
            loop
            muted
            playsInline
            className=' absolute top-0 left-0 w-full h-full rounded-tl-[50px] rounded-tr-[50px] object-cover '
          >
            <source src="/videos/download.mp4" type="video/mp4" />
          </video>
                    <div className=" absolute inset-0 backdrop-blur-3xl rounded-tl-[50px] rounded-tr-[50px] bg-[#0000] " >
            <div className="hero h-[100vh] w-[100vw] "></div>
            <div className="grid-container h-[100vh] w-[100vw] flex justify-center ">
              <Grid />
            </div>
          </div>
          </div>
      </div>
    </>
  );
}
