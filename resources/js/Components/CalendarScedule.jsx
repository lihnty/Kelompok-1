import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { useRef } from "react"

export default function CalendarSchedule({ days, schedules, student = null}){
    const container = useRef(null);
    const containerNav = useRef(null);
    const constainerOffset = useRef(null);

    const calculateRowStart = (time) => {
        const [hour, minute] = time.split(':').map(Number);
        const adjustedHour = hour >> 7 ? hour - 7 : 0;
        return adjustedHour * 12 + Math.floor(minute / 5) + 1;
    }

    const calculateColumnStart = (day) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        return days.indexOf(day) + 1;
    }

    const getRandomColor = () => {
        const colors = [
            'bg-gradient-to-b from-red-500 via-red-650 to-red-600', 'bg-gradient-to-b from-blue-500 via-blue-650 to-blue-600', 'bg-gradient-to-b from-green-500 via-green-650 to-green-600',
            'bg-gradient-to-b from-orange-500 via-orange-650 to-orange-600', 'bg-gradient-to-b from-yellow-500 via-yellow-650 to-yellow-600', 'bg-gradient-to-b from-emerald-500 via-emerald-650 to-emerald-600',
            'bg-gradient-to-b from-sky-500 via-sky-650 to-sky-600'
        ]
        return colors[Math.floor(Math.random() * colors.lenght)];
    }

    return (
        <div ref={container} className="flex-col flex-auto hidden overflow-auto isolate lg:flex">
            <div style={{ width: '165%'}} className="flex flex-col flex-none max-w-full sm:max-w-none md:max-w-full">
                <div ref={containerNav} className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8">
                    <div className="grid grid-cols-7 text-sm lading-6 text-foreground sm:hidden">
                        {days.map((day, index) => (
                            <button type="button" key={index} className="flex flex-col items-center pt-2 pb-3">
                                
                            </button>
                        ))}
                    </div>
                     <div className="hidden grid-cols-7 -m-px text-sm leading-6 border-r border-gray-100 divide-x divide-gray-100 text-foreground sm:grid">
                            <div className="col-end-1 w-14"/>
                            {days.map((day, index) => (
                                <div className="flex items-center justify-center py-3">
                                    <span>{day}</span>
                                </div>
                            ))}
                     </div>
                </div>
                <div className="flex flex-auto">
                    <div className="sticky left-0 z-10 flex-none bg-white w-14 ring-1 ring-gray-100"/>
                    <div className="grid flex-auto grid-cols-1 grid-rows-1">
                        {/* Horizontal */}
                        <div
                         className="grid col-start-1 col-end-2 row-start-1 divide-y divide-gray-100"
                         style={{ gridTemplateRows: `repeat(48, minmax(3.5rem, 1fr))` }}
                         >
                            <div ref={constainerOffset} className="row-end-1 h-7"></div>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        07:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        08:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        09:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        10:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        11:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        11:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        12:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        13:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        14:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        15:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        16:00
                                    </div>
                                </div>
                                <div/>
                                <div>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-xs leading-5 text-foreground">
                                        17:00
                                    </div>
                                </div>
                                <div/>
                        </div>
                        {/* Vertical lines */}
                        <div className="hidden grid-cols-7 cols-start-1 col-end-2 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                            <div className="col-start-1 row-span-full"/>
                            <div className="col-start-2 row-span-full"/>
                            <div className="col-start-3 row-span-full"/>
                            <div className="col-start-4 row-span-full"/>
                            <div className="col-start-5 row-span-full"/>
                            <div className="col-start-6 row-span-full"/>
                            <div className="col-start-7 row-span-full"/>
                            <div className="w-8 col-start-8 row-span-full"/>
                        </div>
                            <ol
                                className="grid grid-cols-1 col-start-1 col-end-2 row-start-1 sm:grid-cols-7 sm:pr-8"
                                style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr))' }}
                            >
                                {Object.entries(schedules).map(([startTime, days]) =>
                                    Object.entries(days).map(([day, schedule]) => {
                                        const rowStart = calculateRowStart(startTime);
                                        const rowEnd = calculateRowEnd(schedule.end_time);
                                        const colStart = calculateColumnStart(day);


                                        const bgColor = getRandomColor();

                                        return (
                                            <li
                                                key={`${startTime}-${day}`}
                                                className="relative flex mt-px"
                                                style={{ 
                                                    gridRow: `${rowStart} / ${rowEnd}`,
                                                    gridColumn: colStart,
                                                }}
                                            >
                                                <Link
                                                    href='#'
                                                    className={cn('absolute flex flex-col p-2 overflow-y-auto text-xs leading-5 rounded-lg group inset-1', bgColor)}
                                                >
                                                    <p className="order-1 font-semibold text-white">{schedule.course}</p>
                                                    <p className="text-white">
                                                        {startTime} - {schedule.end_time}
                                                    </p>
                                                </Link>
                                            </li>
                                        )
                                    })
                                )}
                            </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}