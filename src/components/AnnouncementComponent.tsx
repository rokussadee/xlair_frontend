import { useEffect, useState} from "react"
import { Announcement } from "../types"
import { parseAnnouncements } from "../utils"
import { isAfter, isBefore } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import LoadingBar from "./LoadingBar"

const AnnouncementComponent = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const url = "https://www.xlair.be/wp-json/wp/v2/announcements"
        const announcementsAPIResponse = await fetch(url);
        const announcementsData = await announcementsAPIResponse.json();
        const announcements: Announcement[] = await parseAnnouncements(announcementsData);
  
        if (announcements.length !== 0) {
          let filteredAnnouncements: Announcement[] = announcements.filter(a => {
              console.log(`state for announcement ${a.title}: ${a.state}`)
              return a.state;
            })
    
          if(filteredAnnouncements.length === 0) {
              filteredAnnouncements = announcements.filter(a => {
                const now = Date.now();
                if (a.startTime && a.endTime) {
                  return isBefore(new Date(a.startTime), now) && isAfter(new Date(a.endTime), now)
                }
              })
            }
  
          console.log(`filteredAnnouncements:\n${JSON.stringify(filteredAnnouncements)}`)
          setAnnouncement(filteredAnnouncements[0])
        }
  
      } catch(error) {
        console.error('Error fetching announcement: ', error)
      } finally {
        setLoading(false)
      }
    };

    fetchAnnouncement();
    console.log(announcement);
  }, [])

  const parser = new DOMParser();

  return (
    <div className="mt-3 mb-3">
      <div className="min-w-80">
      {loading ? (
        // Default values shown
      <div style={{ width: '80%', margin: '0 auto' }}>
        <LoadingBar color="white" stroke="1px" />
      </div>
      ) : (announcement !== null) && (
        <Alert className={`p-2  h-36 border-zinc-700 `}>
           {/* <img
              className="rounded-lg opacity-70 w-full h-32 object-cover" // Adjust height (h-48) as needed
              src={announcement.image}
              alt="XLAIR Announcement Image"
            /> */}
          <AlertTitle className="text-bold text-2xl">
              {announcement?.title}
            </AlertTitle>
          {announcement.description ? (
            <AlertDescription>
                {parser.
                  parseFromString(
                    announcement.description,
                    'text/html')
                  .documentElement.textContent}
            </AlertDescription>
          ) : null}
        </Alert>
        )}
        </div>
    </div>
  )
}
 export default AnnouncementComponent;
