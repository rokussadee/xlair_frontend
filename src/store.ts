import { atom, selector } from 'recoil';
import { CalendarEvent } from './types';
import { closestIndexTo, isAfter, isToday, isWithinInterval, parseISO } from 'date-fns';

// Store the full list of events
export const setlistState = atom<CalendarEvent[]>({
  key: "setlist",
  default: []
});

// Selector to get the currently playing event
export const currentEventSelector = selector({
  key: "currentEvent",
  get: ({ get }) => {
    const events = get(setlistState);
    const now = new Date();

    // Find the event that's currently playing
    const currentEvent = events.find(event => {
      const startTime = parseISO(event.startTime);
      const endTime = parseISO(event.endTime);

      return isWithinInterval(now, { start: startTime, end: endTime });
    });

    // Return default "offline" state if no current event
    return currentEvent || {
      id: "offline",
      title: "We are currently offline.",
      startTime: null,
      endTime: null,
      description: null,
      imageLink: null
    };
  }
});

export const nextEventSelector = selector({
  key: "nextEvent",
  get: ({ get }) => {
    const events = get(setlistState);
    const now = new Date();
    const closestUpcomingEvents: CalendarEvent[] =
      events.filter(event => {
        return isAfter(new Date(event.startTime), now) && isToday(new Date(event.startTime))
      })

    console.log(`closestUpcomingEvents:\n${JSON.stringify(closestUpcomingEvents)}`);
    const closestUpcomingDates: Date[] =
      closestUpcomingEvents.map(event => new Date(event.startTime))

    console.log(`closestUpcomingDates:\n${closestUpcomingDates}`);

    const indexOfUpcomingDate = closestIndexTo(now, closestUpcomingDates);
    if (indexOfUpcomingDate === undefined) {
      return {
        id: "offline",
        title: "We are currently offline.",
        startTime: null,
        endTime: null,
        description: null,
        imageLink: null
      }
    }

    console.log(`index of event closest to now: \n${indexOfUpcomingDate}`);

    return closestUpcomingEvents[indexOfUpcomingDate]
  }
})

// We can remove the currentItemState atom since we're using a selector)
