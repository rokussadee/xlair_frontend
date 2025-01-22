import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { Announcement, CalendarEvent, WordPressAPIError } from "./types";

export const dateInDutch = (day: Date): string => {
  const ISODayOfWeek = Number(format(day, 'i'));
  const dayMonth = format(day, 'dd/MM');
  const dutchWeekdays = [
    'Maandag',
    'Disndag',
    'Woensdag',
    'Donderdag',
    'Vrijdag',
    'Zaterdag',
    'Zondag'
  ];

  if (typeof ISODayOfWeek !== "number") {
    throw Error;
  }

  const mappedDay = dutchWeekdays[ISODayOfWeek - 1];

  const formattedDate = `${mappedDay} ${dayMonth}`;
  return formattedDate;

}


export const parseCalendarHTML = (content: string): CalendarEvent[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const events: CalendarEvent[] = [];

  // Select all date wrappers (each represents a day's events)
  const dateWrappers = doc.querySelectorAll(".ics-calendar-date-wrapper");
  console.log(`dateWrappers: ${JSON.stringify(dateWrappers)}`)

  dateWrappers.forEach((dateWrapper) => {
    const date = dateWrapper.getAttribute("data-date"); // Extract the date
    console.log(`date: ${date}`)

    // Find all <dt> (time) and <dd> (event details) pairs inside the <dl> within this date wrapper
    const eventPairs = dateWrapper.querySelectorAll("dl.events dt");
    console.log(`eventPairs: ${JSON.stringify(eventPairs)}`)

    eventPairs.forEach((timeElement) => {
      // Corresponding event details are in the next <dd>
      const eventElement = timeElement.nextElementSibling as HTMLElement;

      if (eventElement) {
        // Extract time information
        const startTime = timeElement.textContent?.trim().split("–")[0].trim();
        const endTime = timeElement.querySelector(".end_time")?.textContent?.replace("–", "").trim();

        // Extract event details
        const titleElement = eventElement.querySelector(".title") as HTMLElement;
        const descriptionElement = eventElement.querySelector(".eventdesc") as HTMLElement;

        const description = descriptionElement?.innerHTML || null;
        let imageLink: string | null = null;

        // Extract an image link from the description
        const linkMatch = description?.match(/https:\/\/[^\s"]+\.(?:jpg|jpeg|png|gif)/);
        if (linkMatch) {
          imageLink = linkMatch[0];
          // Remove the image link from the description
          description?.replace(imageLink, "").trim();
        }

        // Extract title
        const title = titleElement?.textContent?.trim() || "Untitled Event";

        // Generate unique ID
        const id = uuidv4();

        // Add event to the list
        events.push({
          id,
          title,
          description,
          startTime: date && startTime ? new Date(`${date} ${startTime}`).toISOString() : "",
          endTime: date && endTime ? new Date(`${date} ${endTime}`).toISOString() : "",
          imageLink,
        });
      }
    });
  });

  console.log(`
    utils; events:\n 
    ${JSON.stringify(events)}
`)

  return events;
}

export const fetchPageContent = async (url: string): Promise<string | { code: string; message: string; data: { status: number } }> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      // If the response status is not OK, return the error format
      return {
        code: "rest_post_invalid_id",
        message: "Ongeldig bericht ID.",
        data: {
          status: response.status,
        },
      };
    }

    const json = await response.json();
    console.log(`fetchPageContent, json:\n${JSON.stringify(json)}`)

    // Check if content.rendered exists in the response
    if (json.content && json.content.rendered) {
      return json.content.rendered;
    } else {
      throw new Error("Invalid response structure.");
    }
  } catch (error) {
    // Handle any fetch or parsing errors
    console.error("Error fetching page content :", error)
    return {
      code: "rest_post_invalid_id",
      message: "Unexpected error.",
      data: {
        status: 404,
      },
    };
  }
}

export const parseCalendarAPIResponse = async (data: object | WordPressAPIError): Promise<CalendarEvent[]> => {
  if ('code' in data) {
    console.error('WordPress API Error: ', data)
    return []
  }

  const eventsData = data as {
    events: Array<{
      id: string,
      title: string,
      description: string,
      start_date: string,
      end_date: string,
      image?: { url?: string }
    }>
  }

  console.log(eventsData);

  if (!eventsData.events || !Array.isArray(eventsData.events)) {
    console.error('Invalid events data. ')
    return [];
  }

  return eventsData.events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description || null,
    startTime: event.start_date,
    endTime: event.end_date,
    imageLink: event.image?.url || null
  }));

}

export const parseAnnouncements = async (data: object | WordPressAPIError): Promise<Announcement[]> => {
  if ('code' in data) {
    console.error('WordPress API Error: ', data)
    return []
  }

  const announcementsData = data as {
    announcements: Array<{
      id: number,
      title: { rendered: string },
      excerpt : { rendered: string },
      acf: { active: boolean, start_time_activity: string, end_time_activity: string }
    }>
  }

  console.log(announcementsData);

  if (!announcementsData|| !Array.isArray(announcementsData)) {
    console.error('Invalid announcements data. ')
    return [];
  }

  return announcementsData.map((object) => ({
      id: object.id.toString(),
      title: object.title.rendered,
      description: object.excerpt.rendered || null,
      state: object.acf.active,
      startTime: object.acf.start_time_activity || null,
      endTime: object.acf.end_time_activity || null
    }
  ));
}
