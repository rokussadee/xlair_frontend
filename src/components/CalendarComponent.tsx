import { useEffect, useState } from 'react';
import { CalendarEvent, WordPressAPIError } from '../types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { setlistState } from '../store';
import { parseCalendarAPIResponse } from "../utils";
import { addDays, format, isSameDay, isAfter, startOfDay, isWeekend} from 'date-fns';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card";
import LoadingBar from "../components/LoadingBar"
import CustomCardTitle from './CustomCardTitle';
import clsx from 'clsx';
import { currentEventSelector } from '../store';
import {motion} from "motion/react";
import RandomizedElements from './RandomizedElements';

const CalendarComponent = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const setSetlist = useSetRecoilState(setlistState);
  const [loading, setLoading] = useState<boolean>(true);
  const now = new Date();
  const today = startOfDay(now);
  const currentEvent = useRecoilValue(currentEventSelector);
  const [earliestStartTime, setEarliestStartTime] = useState<number>();
  const [playheadPercentage, setPlayheadPercentage] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(24);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const url = "https://www.xlair.be/wp-json/tribe/events/v1/events?_fields=events"

        const eventsAPIResponse = await fetch(url);
        const eventData: object | WordPressAPIError = await eventsAPIResponse.json();
        const calendarEvents: CalendarEvent[] = await parseCalendarAPIResponse(eventData);

        // Filter for displayed events
        const filteredEvents: CalendarEvent[] = calendarEvents.filter(event => {
          const eventDate = new Date(event.startTime);
          return isAfter(eventDate, today) || isSameDay(eventDate, today);
        });
        console.log(`filteredEvents: ${filteredEvents}`)

        // Filter for today's events (for setlist)

        setEvents(filteredEvents);
        setSetlist(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
      // Calculate the earliest event start time for the week
    const earliestTemp: Date = events.reduce((earliest, event) => {
      const eventStart = new Date(event.startTime);

      // Normalize time by setting the date to a common anchor day (e.g., Jan 1, 1970)
      const normalizedEventStart = new Date(1970, 0, 1, eventStart.getUTCHours() + 1, eventStart.getUTCMinutes());
      const normalizedEarliest = new Date(1970, 0, 1, earliest.getUTCHours() + 1, earliest.getUTCMinutes());
      console.log(`normalizedEventStart: ${normalizedEventStart}\nnormalizedEarliest: ${normalizedEarliest}`)


      return normalizedEventStart < normalizedEarliest ? eventStart : earliest;
    }, new Date(events[0]?.startTime || new Date())); // Start with the first event as the initial value

    const earliestHour = earliestTemp.getUTCHours() + 1;
    setTimeHead(earliestHour);
    setEarliestStartTime(earliestHour)
    setTotalHours(24 - earliestHour);
  }, [events]);

  useEffect(() => {
    
    if (typeof earliestStartTime !== "number") return;
    console.log(`initializing interval`);
    const interval = setInterval(() => {
      setTimeHead(earliestStartTime);
    }, 60000);

    return () => {
      console.log(`clearing interval`);
      clearInterval(interval);
    }
  }, [earliestStartTime])

  // Create an array for the current day and the next 6 days
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const weekDays = days.filter((day) => !isWeekend(day))

  function setTimeHead(startNumber: number){
    const newTime = new Date();
    const timeToGridPlacement = ((((newTime.getUTCHours() + 1) - startNumber)  + newTime.getUTCMinutes() / 60) / totalHours) * 100;
    console.log(`timeToGridPlacement: 
      \n((((${newTime.getUTCHours()} + 1) - ${startNumber}) / 60  + ${newTime.getUTCMinutes()} / 60) / ${totalHours}) * 100
      \n${timeToGridPlacement}`)
    setPlayheadPercentage(timeToGridPlacement);
  }

  // Utility function to handle row calculation
  const calculateRowPosition = (date: Date) => {
    if (typeof earliestStartTime !== "number") return;  // ✅ Prevent running when undefined
    const hour = date.getUTCHours() + 1;
    console.log(`hour: ${hour}`)
    const minutes = date.getUTCMinutes();
    const quarters = Math.floor(minutes / 15);
    console.log(`quarters for time ${date.toLocaleString()}: ${quarters}`)

    if (hour === 0) {
      return totalHours * 2;
    }

    const position = ((hour - earliestStartTime) * 4) + (quarters) + 1; // Each row represents 30 minutes, +2 for header
    return position;
  };

  const parser = new DOMParser();

  const MotionCard = motion(Card)
  return (
    <div className="py-4">

      {loading ? (

        <div style={{ width: '100%', margin: '0 auto' }}>
          <LoadingBar color="white" stroke="1px" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 w-full">
          {/* Mobile (Schedule Layout) */}
          <div className="md:hidden overflow-y-auto scroll-snap-y">
            {weekDays
              .filter(day => events.some(event => isSameDay(new Date(event.startTime), day)))
              .map((day, i, filtered) => (
                <div
                  key={day.toString()}
                  className={`scroll-snap-start pt-4 ${filtered.length === i + 1 ? 'mb-14' : ''}`}>
                  <h2 className="text-lg flex flex-col mb-2">
                    <span className="font-semibold">{format(day, 'EEEE')}</span> {/* Day */}
                    <span className="text-gray-500 text-sm font-regular">{format(day, 'MMMM d')}</span> {/* Date */}
                  </h2>
                  <ul>
                    {events
                      .filter(event => isSameDay(new Date(event.startTime), day))
                      .map(event => {
                        const isPlaying = currentEvent.id === event.id ? true : false; 
                        return (
                        <li key={event.id} className="mb-4">
                          <Card
                            key={event.id}
                            className={clsx("overflow-hidden relative z-5 bg-[#1c1c1c] border border-zinc-700 text-foreground ", isPlaying ? "bg-gradient-to-br from-red-800 via-transparent to-neutral-700 backdrop-blur" :  "bg-gradient-to-br from-neutral-900 via-transparent to-neutral-700 backdrop-blur")}
                          >
                            {
                                isPlaying && (
                            <div className='absolute bottom-2 right-2'> 
                              <div className="rounded-full h-[7px] w-[7px] transition-all duration-200 outline outline-[0.05px] bg-red-600 outline-zinc-700" ></div>
                              <div className="absolute top-0 rounded-full h-[7px] w-[7px] opacity-40 transition-all duration-200 outline outline-[0.1px] blur-[2px] outline-red-400 bg-red-600 animate-pulse "></div>
                            </div>
                                )
                              }
                            <CardHeader className='p-3'>
                              <CardTitle className='text-base'>
                                {parser.parseFromString(event.title, "text/html").documentElement.textContent}{" "}
                              </CardTitle>
                              <CardDescription className='text-xs'>
                                {format(new Date(event.startTime), 'p')} -{' '}
                                {format(new Date(event.endTime), 'p')}
                              </CardDescription>
                            </CardHeader>
                            {isPlaying  && (
                              <div
                              className="absolute bottom-0 gradient-mask-r-[transparent,transparent_60%,rgba(1,1,1,1.0)_100%] left-0 w-full h-[80%]"
                              >
                                <RandomizedElements count={20} />
                              </div>
                            )}
                          </Card>
                        </li>
                      )
                      })
                      }
                  </ul>
                </div>
              ))}
          </div>

          {/* Desktop (Timetable Layout) */}
          <div className="hidden md:block w-full">
            <div className="grid grid-cols-5 gap-2 relative w-full">
              {weekDays.map(day => (
                <div key={day.toString()} className="col-span-1 pl-2 relative"> {/* Modified: Grid for each day */}
                  <h2 className="text-lg flex flex-col mb-2">
                    <span className="font-semibold ">{format(day, 'EEEE')}</span> {/* Day */}
                    <span className="text-gray-500 text-sm font-regular">{format(day, 'MMMM d')}</span> {/* Date */}
                  </h2>
                  <div
                    className={`relative grid`}
                    style={{
                      gridTemplateRows: `repeat(${totalHours * 4}, minmax(10px, 20px))`,
                      backgroundImage: `linear-gradient(to bottom, transparent 99%,rgb(62, 62, 62) 99%)`,
                      backgroundSize: `100% 80px`, // Adjust this to match the row height
                    }}
                  > 
                  {
                    (playheadPercentage > 0 && isSameDay(now, day) ) && (
                      <>
                        <div className="bg-red-600 w-full absolute h-[1px] z-50"
                          style={{
                            top: `${playheadPercentage}%`
                          }}
                        ></div>
                        <div className="bg-red-600 w-full absolute h-[15px] z-50 blur-xl overflow-visible"
                          style={{
                            top: `${playheadPercentage}%`
                          }}
                        ></div>
                      </>
                    )
                  }

                  {/* Modified: 24 rows for 24 hours */}
                    {events
                      .filter(event => isSameDay(new Date(event.startTime), day))
                      .map(event => {
                        const eventStart = new Date(event.startTime);
                        const eventEnd = new Date(event.endTime);
                        const rowStart = calculateRowPosition(eventStart);
                        const rowEnd = calculateRowPosition(eventEnd);
                        const isSmall: boolean = rowEnd && rowStart && rowEnd-rowStart < 3 ? true : false;
                        const isPlaying = currentEvent.id === event.id ? true : false;
                        
                        // TODO: create component for text line-clamp
                        return (
                          <MotionCard
                            key={event.id}
                            className={clsx("overflow-hidden cursor-help z-5 bg-[#1c1c1c] border border-zinc-700 text-foreground ", isPlaying ? "bg-gradient-to-br from-[rgba(244,30,13,.4)] via-transparent to-neutral-700 backdrop-blur" :  "bg-gradient-to-br from-neutral-900 via-transparent to-neutral-700 backdrop-blur" )}
                            style={{
                              gridRowStart: rowStart,
                              gridRowEnd: rowEnd
                            }}
                            whileHover={{
                              scale: 1.01
                            }}
                          >
                              {
                                isPlaying && (
                            <div className='absolute bottom-2 right-2'> 
                              <div className="rounded-full h-[7px] w-[7px] transition-all duration-200 outline outline-[0.05px] bg-red-600 outline-zinc-700" ></div>
                              <div className="absolute top-0 rounded-full h-[7px] w-[7px] opacity-40 transition-all duration-200 outline outline-[0.1px] blur-[2px] outline-red-400 bg-red-600 animate-pulse "></div>
                            </div>
                                )
                              }
                            <CardHeader 
                            className={clsx('px-4', 
                              isSmall ? 'py-1' : 'py-4')}
                              >
                              <CustomCardTitle
                                active={isPlaying}
                                title={event.title.toString()}
                              />
                              <CardDescription className='text-xs'>
                                {format(new Date(event.startTime), 'p')} -{' '}
                                {format(new Date(event.endTime), 'p')}
                              </CardDescription>
                            </CardHeader>
                            {isPlaying  && (
                              <div
                              className="relative bottom-0 left-0 max-w-full h-[80%] gradient-mask-b-[transparent,transparent_20%,rgba(1,1,1,1.0)_100%]"
                              >
                                <RandomizedElements count={20} />
                              </div>
                            )}

                          </MotionCard>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
