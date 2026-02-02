import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { PortableText } from '@portabletext/react';
import { Link } from 'react-router-dom';
import { Show, WordPressAPIError } from '../types';
import { parseShowsAPIData } from '../utils';

const ShowDetailPage = () => {
  const { showId } = useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShowDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch show details
        const showResponse = await fetch(
          `https://www.xlair.be/wp-json/wp/v2/homepage-items/${showId}`
        );
        
        if (!showResponse.ok) {
          // If show is not found, redirect to homepage
          navigate('/');
          return;
        }
        
        const showData: object | WordPressAPIError = await showResponse.json();
        const show: Show = await parseShowsAPIData(showData);
        setShow(show)
        // setShow(showData);

        // Fetch image if it exists
        if (show.postImage && typeof show.postImage === "number") {
          const imageResponse = await fetch(
            `https://www.xlair.be/wp-json/wp/v2/media/${show.postImage}`
          );
          const imageData = await imageResponse.json();
          setImageUrl(imageData.source_url);
        }
      } catch (err) {
        // For any error, redirect to homepage
        console.error(err)
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (showId) {
      fetchShowDetails();
    }
  }, [showId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading show details...
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-red-500">
  //       Error: {error}
  //     </div>
  //   );
  // }

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Show not found
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-foreground text-foreground ">
          <Link to={`/shows`} className='underline mb-2'>
            All shows
          </Link>
          <div>
            <div className="text-4xl font-bold mb-4">
              {new DOMParser().parseFromString(show.title, "text/html").documentElement.textContent}
            </div>
          </div>
          <div className="space-y-6">
            {/* {imageUrl && (
              <img
                src={imageUrl}
                alt={show.title}
                className="w-full h-96 object-cover rounded-lg opacity-20 blur-[100px]"
              />
            )} */}
            
            {show.mixcloudLink && typeof show.mixcloudLink === "string" && (
              <div className="relative w-full h-96">
                {/* Glow layer */}
                {imageUrl && (
                  <div
                    className="absolute inset-0 translate-y-8 z-0 bg-cover bg-center opacity-30 blur-[80px] scale-125 pointer-events-none"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                )}

                {/* Actual iframe container */}
                <div className="relative z-10 w-full h-full rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={`https://player-widget.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(
                      show.mixcloudLink
                    )}`}
                    title={show.title}
                    frameBorder="0"
                  />
                </div>
              </div>
            )}

            <div 
              className="prose prose-invert max-w-none text-justify"
              dangerouslySetInnerHTML={{ __html: show.description }}
            />
            
            {/*{show.description && (
              <div className="mt-4 description-block">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <PortableText value={showData.acf.description} />
              </div>
            )}*/}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShowDetailPage;
