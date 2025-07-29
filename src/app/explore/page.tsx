"use client";
import { useEffect, useRef } from "react";
import { explorePageLogic } from "@/utils/explorePageLogic";
import { handleClick } from "@/utils/explorePageLogic";
import { items } from "@/lib/data";
import { useUser } from "@clerk/nextjs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Carousel from "@/components/ui/carousel";


export default function ExplorePage() {
    const { user } = useUser();
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {


        const ctx = gsap.context(() => {
            
            const sections = gsap.utils.toArray<HTMLElement>(".panel");
            
            // 2. Set the initial positions of the sections that will slide in.
            // .cat1 is already visible. .cat2 and .cat3 start 100% below the viewport.
            gsap.set([".cat2", ".cat3"], { yPercent: 100 });

           
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: mainRef.current, // Trigger the animation on the main container
                    pin: true,             // Pin the container while scrolling
                    scrub: 1,              // Smoothly "scrub" the animation on scroll (1s lag)
                    end: () => `+=${mainRef.current!.offsetHeight * (sections.length - 1)}`,
                    
                    // 4. UPDATE: Snap to each of the 3 sections.
                    // The value is 1 / (number of sections - 1), creating snap points at 0, 0.5, and 1.
                    snap: {
                        snapTo: 1 / (sections.length - 1),
                        duration: 0.5,
                        ease: "power2.inOut",
                    }, // End after scrolling the height of one section
                }
            });

            // Animate the second panel (.cat2) to slide up over the first one
            timeline.to(".cat2", {
                yPercent: 0   // Animate to its natural position (0)
            }).to(".cat3",{
                yPercent: 0
            });

        }, mainRef); // Scope the context to our mainRef

        return () => ctx.revert(); 
    }, []);

    return (
    <div className="scroll-container relative overflow-hidden w-[100vw] h-[100vh]" ref={mainRef}>
            <div className="cat1 panel w-full h-full absolute z-1 top-0 left-0 !bg-amber-400">
                <Carousel items={items} />
            </div>
            <div className="cat2 panel w-full h-full absolute z-2 top-0 left-0 !bg-blue-400">
                <Carousel items={items} />
            </div>
            <div className="cat3 panel w-full h-full absolute z-3 top-0 left-0 !bg-green-400">
                <Carousel items={items} />
            </div>
        </div>
    );
}