"use client";
import { useEffect, useRef, useState } from "react";
// FIX 6: Removed unused imports: explorePageLogic, handleClick, Card components, framer-motion div
import { items } from "@/lib/data";

import { useUser } from "@clerk/nextjs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    X,
    MessageCircle,
    Send,
    Loader2,
    ArrowDownCircleIcon
} from 'lucide-react';
import { useChat } from '@ai-sdk/react';
gsap.registerPlugin(ScrollTrigger);
import Carousel from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
// FIX 2: Imported the Input component
import { Input } from "@/components/ui/input";

export default function ExplorePage() {
    const { user } = useUser();
    const mainRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const chatIconRef = useRef<HTMLButtonElement>(null);

    // FIX 1: Moved `useChat` hook to the top level of the component, outside of useEffect.
    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error } = useChat({ api: "/api/gemini" });

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray<HTMLElement>(".panel");
            // gsap.set([".cat2", ".cat3"], { yPercent: 100 });

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: mainRef.current,
                    pin: true,
                    scrub: 1,
                    end: () => `+=${mainRef.current!.offsetHeight * (sections.length - 1)}`,
                    snap: {
                        snapTo: 1 / (sections.length - 1),
                        duration: 0.5,
                        ease: "power2.inOut",
                    },
                }
            });

            timeline.to(".cat2", {
                yPercent: -100
            }).to(".cat3", {
                yPercent: -100
            });
        }, mainRef);

        return () => ctx.revert();
    }, []); // Empty dependency array is correct here as GSAP setup runs once.

    useEffect(() => {
      if(scrollRef.current) {
        scrollRef.current.scrollIntoView({behavior: "smooth"})
      }

    }, [messages])
    

    return (
        <div>
            <div className="scroll-container relative overflow-hidden w-[100vw] h-[100vh]" ref={mainRef}>
                <div className="cat1 panel w-full h-full absolute z-1 top-0 left-0 !bg-amber-400">
                    <Carousel items={items} />
                </div>
                <div className="cat2 panel w-full h-full absolute z-2 top-[100%] left-0 !bg-blue-400">
                    <Carousel items={items} />
                </div>
                <div className="cat3 panel w-full h-full absolute z-3 top-[100%] left-0 !bg-green-400">
                    <Carousel items={items} />
                </div>
            </div>

            <div className="fixed z-50 bottom-[1rem] right-[1rem] w-[4.5rem] h-[3rem] flex items-center justify-center rounded-full backdrop-blur-lg shadow-lg">
                <button ref={chatIconRef} onClick={toggleChat}>
                    {!isChatOpen ? (
                        <MessageCircle className="size-6" />
                    ) : (
                        <ArrowDownCircleIcon />
                    )}
                </button>
            </div>

            {isChatOpen && (
                <div className="sfpro rounded-[10px] px-[1rem] py-[0.7rem] bg-[#0000003e] backdrop-blur-lg border border-[#a4a4a434] shadow-[4px_3px_10px_rgba(255,255,255,0.2)] md:w-[450px] w-[95%] fixed z-50 bottom-[5rem] right-[1rem]">
                    <div className="text-[1.3rem] mb-[1rem] flex justify-between text-white font-bold">
                        Chat with Lunora
                        <button onClick={toggleChat}>
                            <X className="size-4" />
                        </button>
                    </div>
                    <ScrollArea className="h-[300px] w-full p-2">
                        {messages?.length === 0 && (
                            <div className="text-center text-gray-300">No messages yet.</div>
                        )}
                        {messages?.map((message) => (
                            // FIX 5: Used message.id for the key for a stable identity.
                            <div key={message.id} className={`mb-[1rem] ${message.role === "user" ? "text-right" : "text-left"}`}>
                                <div className={`inline-block p-2 rounded-[10px] ${message.role === "user" ? "bg-amber-200 text-[#1f2937]" : "bg-blue-500 text-white"}`}>
                                    <ReactMarkdown
                                        children={message.content}
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code: (props) => {
                                                const { inline, className, children, ...rest } = props as React.ComponentProps<'code'> & { inline?: boolean };
                                                return inline ? (
                                                    <code {...rest} className="bg-gray-200 text-black px-[0.5rem] rounded">{children}</code>
                                                ) : (
                                                    <pre {...rest as React.HTMLAttributes<HTMLPreElement>} className="bg-gray-800 text-white p-2 my-2 rounded"><code>{children}</code></pre>
                                                );
                                            },
                                            ul: ({ children }) => <ul className="list-disc ml-[1rem]">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal ml-[1rem]">{children}</ol>,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="w-full flex items-center justify-center gap-[1rem] text-white">
                                <Loader2 className="animate-spin h-5 w-5" />
                                <button type="button" onClick={() => stop()} className="underline">
                                    Abort
                                </button>
                            </div>
                        )}
                        {error && (
                            <div className="w-full flex items-center justify-center gap-[1rem] text-red-400">
                                <div>Error occurred.</div>
                                <button type="button" onClick={() => reload()} className="underline">
                                    Retry
                                </button>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </ScrollArea>
                    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 mt-2">
                        <Input
                            value={input}
                            // FIX 3: Changed 'onchange' to 'onChange'
                            onChange={handleInputChange}
                            className='flex-1 bg-gray-700 text-white border-gray-600 placeholder:text-gray-400'
                            placeholder='Type your message here...'
                        />
                        <Button
                            type="submit"
                            size="icon" // Using size="icon" for better button styling
                            className="bg-blue-500 hover:bg-blue-600"
                            disabled={isLoading}
                        >
                            <Send className="size-4" />
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
