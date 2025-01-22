//import axios from "axios";
//import { CalendarEvent } from '../types';
//
//const SERVERLESS_FUNCTION_URL = "https://fetch-ics-function-q1k3jmm5b-rokussadees-projects.vercel.app";
//
//export const fetchICSLinkContent = async (url: string): Promise<CalendarEvent[]> => {
//  try {
//    const response = await axios.get(SERVERLESS_FUNCTION_URL, {
//      params: { url }
//    })
//
//    console.log(`response:\n${response}`);
//
//    const events: CalendarEvent[] = response.data.map((ev: any) => ({
//      id: ev.uid,
//      title: ev.summary,
//      description: ev.description || "",
//      startTime: ev.startTime,
//      endTime: ev.endTime,
//      imageLink: ev.imageLink || "",
//    }));
//
//    return events;
//  } catch (error) {
//    console.error("Error fetching events from the serverless function:", error);
//    return [];
//  }
//}
//
//export const parseCalendarICS = async (ICSResponse: string) => {
//  console.log(ICSResponse);
//  const event: CalendarEvent = {
//    id: "",
//    title: "",
//    description: "",
//    startTime: "",
//    endTime: "",
//    imageLink: ""
//  }
//  const events: CalendarEvent[] = [event];
//  return events;
//}
