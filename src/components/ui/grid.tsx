import Image from "next/image";
import AudioPlayer from "./grid-music";

export default function Grid() {
    return (
        <div className="parent w-[80%] h-[90%] mx-auto ">
            <div className="div1 grid-item"></div>
            <div className="div2 grid-item"> </div>
            <div className="div3 grid-item"> </div>
            <div className="div4 grid-item relative ">
                <Image
                    src='/images/div4.png'
                    alt="image"
                    width={918}
                    height={378}
                    className=" w-full h-full "
                />
                <AudioPlayer />
            </div>
            <div className="div5 grid-item"> </div>
            <div className="div6 grid-item"> </div>
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
                <div className="div7desc text-[0.5rem] absolute top-[1.5rem] right-[1rem] w-[40%] text-right  ">Investigate recent research on meditation’s effects—focus, emotional regulation, even changes in brain structure.</div>
                <div className="div7desc text-[1rem] text-[#000000] font-bold absolute bottom-[1rem] right-[1rem] w-[40%] text-right  ">The<br/>Science<br/>of<br/>Meditation</div>
                
            </div>
            <div className="div8 flex grid-item relative !bg-[#00000000] overflow-hidden"> {/* Add overflow-hidden */}
                <div className="shimmer-button absolute top-0 h-[40%] w-full flex justify-center items-center rounded-[15px] ">
                    <button className=" border-[1px] bg-black text-[1rem] py-[0.5rem] px-[0.8rem] rounded-[15px] " ><p className="my-auto" >Shimmer Button</p></button>
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
                <div className="div9head absolute text-[1.2rem] top-[0.6rem] left-[1rem] text-[#885eecbc] ">Track<br/>Your<br/><p className="text-[1.4rem] font-bold italic underline">Stats</p></div>
            </div>
            <div className="div10 grid-item relative !bg-[#0F100D] ">
                <Image
                    src='/images/div10.png'
                    alt="image"
                    width={800}
                    height={800}
                    className="absolute top-1/2 -translate-y-1/2 rounded-[15px] w-[50%]  z-20 right-[0.5rem] "
                />
            </div>
        </div>
    );
}