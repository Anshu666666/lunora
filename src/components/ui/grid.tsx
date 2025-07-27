import Image from "next/image";
import AudioPlayer from "./grid-music";
import DigitalClock from "./clock";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function Grid() {
    return (
        <div className="parent w-[80%] h-[90vh] mx-auto my-auto ">
            <div className="div1 grid-item relative">
                <Image
                    src='/images/div1.jpg'
                    alt="image"
                    width={500}
                    height={200}
                    className="w-full h-full object-cover"
                />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[0.5rem] tracking-[0.2rem] text-[1.3rem] text-center whitespace-pre unbounded text-gray-100  text-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                        Start Timed<br></br>Meditation</div>
            </div>
            <div className="div2 grid-item relative">
                <Image
                    src='/images/div2.png'
                    alt="image"
                    width={918}
                    height={378}
                    className="w-full h-full "
                />

                <div className="absolute inset-0 z-50">
                    <h1 className="text-[1.1rem] absolute z-30 leading-[1.4rem] unbounded w-[20%] p-4 font-black text-[#E0A099]">The Meditation Library</h1>
                    <Image
                        src='/images/braingif.webp'
                        alt="brain animation"
                        width={80}
                        height={80}
                        className="absolute w-[4rem] top-[0.5rem] right-[0.5rem] rounded-[10px] "
                    />
                    <p className="text-[0.7rem] absolute bottom-[1.5rem] sfpro leading-[0.7rem] w-[90%] px-5  text-[#BD8282]">View your favorite sounds, and daily streaks. In stillness, you will discover your truest self emerging</p>
                </div>
            </div>
            <div className="div3 grid-item relative">
                <Image
                    src='/images/meditation.png'
                    alt="image"
                    width={500}
                    height={200}
                    className=" w-full h-full object-cover "
                />
                <div className="absolute inset-0 z-10">
                    <div className="p-2">
                        <h1 className="w-[20%] sfpro text-xl text-[#656D70] font-semibold">Dive </h1>
                        <h1 className="w-[40%] sfpro text-xl text-[#656D70] font-semibold -mt-2">into the</h1>
                        <h1 className="w-[40%] text-xl font-serif italic text-[#656D70] font-normal -mt-1">VOID</h1>

                    </div>
                </div>
            </div>
            <div className="div4 grid-item relative ">
                <Image
                    src='/images/div4.png'
                    alt="image"
                    width={918}
                    height={378}
                    className="w-full h-full "
                />
                <AudioPlayer />
            </div>
            <div className="div5 grid-item ">
                <Image
                    src='/images/dnd.jpg'
                    alt="image"
                    width={918}
                    height={378}
                    className="h-full object-cover"
                />
            </div>
            <div className="div6 grid-item overflow-hidden relative">
                <video
                    src='/videos/logobg.mp4'
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="text-center inter text-white text-9xl font-bold">
                        <h1 className=" bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent ">lunora</h1>
                    </div>
                </div>
            </div>
            <div className="div7 grid-item relative">
                <Image
                    src='/images/div7grad.jpg'
                    alt="image"
                    width={736}
                    height={1472}
                    className=" absolute w-full h-full "
                />
                <Image
                    src='/images/div7.png'
                    alt="image"
                    width={113}
                    height={112}
                    className=" w-[35%] absolute z-20 top-[1rem] left-[1rem] "
                />
                <div className="div7desc text-[0.5rem] tracking-wide [word-spacing:0.2rem] text-[#9ed3b6] sfpro absolute top-[1.5rem] right-[1rem] w-[40%] text-right  ">investigate recent research on meditation’s effects—focus, emotional regulation, even changes in brain structure.</div>
                <div className="div7desc text-[1rem] leading-[0.9rem] text-[#0C5D4E] gloock absolute bottom-[1rem] right-[1rem] w-[40%] text-right  ">The<br/>Science<br/>of<br/>Meditation</div>
                
            </div>
            <div className="div8 flex grid-item relative !bg-[#00000000] overflow-hidden"> {/* Add overflow-hidden */}
                <div className="shimmer-button absolute top-0 left-1/2 -translate-x-1/2 h-[30%] w-[80%] flex justify-center items-center ">
                    <ShimmerButton className=" !text-[1rem] " >Quick Calm</ShimmerButton>
                </div>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline // Important for autoplay on mobile
                    src="/videos/div8.mp4" // Use the new .mp4 file
                    className="absolute rounded-[15px] bottom-0 h-[60%] w-[100%] object-cover " // Use object-cover, remove inline style
                />
            </div>
            <div className="div9  !bg-[#261931] grid-item relative ">
                <Image
                    src='/images/div9.png'
                    alt="image"
                    width={1026}
                    height={547}
                    className=" w-[95%] h-[95%] absolute top-[10%] left-1/2 -translate-x-1/2 "
                />
                <div className="div9head absolute text-[1.2rem] unbounded font-thin top-[0.6rem] left-[1rem] text-[#885eecbc] ">Track<br/>your<br/><p className="text-[1.8rem] tracking-[0.2rem] sfpro font-black text-shadow-[1px_1px_0px_rgba(255,218,0,1)] ">stats</p></div>
            </div>
            <div className="div10 grid-item relative !bg-[#0F100D] ">
                <Image
                    src='/images/div10.png'
                    alt="image"
                    width={800}
                    height={800}
                    className="absolute bottom-[0.4rem] right-[0.4rem] rounded-[15px] w-[50%] z-20  "
                />
                <DigitalClock />
            </div>
        </div>
    );
}