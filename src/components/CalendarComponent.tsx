import { useEffect, useState } from 'react';
import { CalendarEvent, WordPressAPIError } from '../types';
import { useSetRecoilState } from 'recoil';
import { setlistState } from '../store';
import { parseCalendarAPIResponse } from "../utils";
import { addDays, format, isSameDay, isAfter, startOfDay, isWeekend } from 'date-fns';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card";
import LoadingBar from "../components/LoadingBar"
import CustomCardTitle from './CustomCardTitle';


const CalendarComponent = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const setSetlist = useSetRecoilState(setlistState);
  const [loading, setLoading] = useState<boolean>(true);
  const today = startOfDay(new Date());

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

  // Create an array for the current day and the next 6 days
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const weekDays = days.filter((day) => !isWeekend(day))

  // Calculate the earliest event start time for the week
  const earliestStartTime = events.reduce((earliest, event) => {
    const eventStart = new Date(event.startTime);

    // Normalize time by setting the date to a common anchor day (e.g., Jan 1, 1970)
    const normalizedEventStart = new Date(1970, 0, 1, eventStart.getUTCHours() + 1, eventStart.getUTCMinutes());
    const normalizedEarliest = new Date(1970, 0, 1, earliest.getUTCHours() + 1, earliest.getUTCMinutes());
    console.log(`normalizedEventStart: ${normalizedEventStart}\nnormalizedEarliest: ${normalizedEarliest}`)


    return normalizedEventStart < normalizedEarliest ? eventStart : earliest;
  }, new Date(events[0]?.startTime || new Date())); // Start with the first event as the initial value

  const earliestHour = earliestStartTime.getUTCHours() + 1; // Get the hour of the earliest event
  const totalHours = 24 - earliestHour;

  console.log(`ealiestHour: ${earliestHour}`)


  // Utility function to handle row calculation
  const calculateRowPosition = (date: Date) => {
    const hour = date.getUTCHours() + 1;
    console.log(`hour: ${hour}`)
    const minutes = date.getUTCMinutes();
    const quarters = Math.floor(minutes / 15);
    console.log(`quarters for time ${date.toLocaleString()}: ${quarters}`)

    if (hour === 0) {
      return totalHours * 2;
    }

    const position = ((hour - earliestHour) * 4) + (quarters) + 1; // Each row represents 30 minutes, +2 for header
    return position;
  };

  const parser = new DOMParser();
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
                      .map(event => (
                        <li key={event.id} className="mb-4">
                          <Card
                            key={event.id}
                            className='overflow-hidden z-5 bg-[#1c1c1c] border border-zinc-700 text-foreground  bg-gradient-to-br from-neutral-900 via-transparent to-neutral-700 backdrop-blur '
                          >
                            <CardHeader className='p-3'>
                              <CardTitle className='text-base'>
                                {parser.parseFromString(event.title, "text/html").documentElement.textContent}{" "}
                              </CardTitle>
                              <CardDescription className='text-xs'>
                                {format(new Date(event.startTime), 'p')} -{' '}
                                {format(new Date(event.endTime), 'p')}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </li>
                      ))}
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
                    className={`relative grid h-full`}
                    style={{
                      gridTemplateRows: `repeat(${totalHours * 4}, minmax(10px, 20px))`,
                      backgroundImage: `linear-gradient(to bottom, transparent 99%,rgb(62, 62, 62) 99%)`,
                      backgroundSize: `100% 80px`, // Adjust this to match the row height
                    }}
                  > {/* Modified: 24 rows for 24 hours */}
                    {events
                      .filter(event => isSameDay(new Date(event.startTime), day))
                      .map(event => {
                        const eventStart = new Date(event.startTime);
                        const eventEnd = new Date(event.endTime);
                        const rowStart = calculateRowPosition(eventStart);
                        const rowEnd = calculateRowPosition(eventEnd);
                        console.log(rowEnd - rowStart);
                        
                        // TODO: create component for text line-clamp
                        return (
                          <Card
                            key={event.id}
                            className='overflow-hidden z-5 bg-[#1c1c1c] border border-zinc-700 text-foreground  bg-gradient-to-br from-neutral-900 via-transparent to-neutral-700 backdrop-blur  '
                            style={{
                              gridRowStart: rowStart,
                              gridRowEnd: rowEnd
                            }}
                          >
                            <CardHeader className='p-4'>
                              <CustomCardTitle
                                title={event.title.toString()}
                              />
                              <CardDescription className='text-xs'>
                                {format(new Date(event.startTime), 'p')} -{' '}
                                {format(new Date(event.endTime), 'p')}
                              </CardDescription>
                            </CardHeader>
                          </Card>
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
