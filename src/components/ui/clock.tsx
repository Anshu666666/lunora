"use client"
import { useState, useEffect, useMemo } from "react"

const DigitalClock = () => {
    const [time, setTime] = useState<Date>(new Date())
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(()=>{
        setMounted(true)
        const interval = setInterval(()=>{
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

const formattedTime = useMemo(() => {
    if(!mounted) return ""

    const hours = time.getHours().toString().padStart(2, "0")
    const minutes = time.getMinutes().toString().padStart(2, "0")
    
    return (
    <div className="irish absolute w-[40%] flex justify-center top-[0.4rem] left-[1rem] text-[3rem] ">
        {hours}<br/>{minutes}
    </div>
)
}, [time, mounted])

return <div>{formattedTime}</div>
}

export default DigitalClock;