import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { PortableText } from '@portabletext/react';


const ShowDetailPage = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
        
        const showData = await showResponse.json();
        setShow(showData);

        // Fetch image if it exists
        if (showData.acf.post_image) {
          const imageResponse = await fetch(
            `https://www.xlair.be/wp-json/wp/v2/media/${showData.acf.post_image}`
          );
          const imageData = await imageResponse.json();
          setImageUrl(imageData.source_url);
        }
      } catch (err) {
        // For any error, redirect to homepage
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

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
          <button className='underline mb-2'>
            Back
          </button>
          <div>
            <div className="text-4xl font-bold mb-4">
              {new DOMParser().parseFromString(show.title.rendered, "text/html").documentElement.textContent}
            </div>
          </div>
          <div className="space-y-6">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={show.title.rendered}
                className="w-full h-96 object-cover rounded-lg opacity-70"
              />
            )}
            
            {show.acf.mixcloud_link && show.acf.mixcloud_link.url && (
              <iframe
                className="w-full h-96 rounded-lg"
                src={`https://player-widget.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(
                  show.acf.mixcloud_link.url
                )}`}
                title={show.title.rendered}
                frameBorder="0"
              ></iframe>
            )}

            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: show.content.rendered }}
            />
            
            {show.acf.description && (
              <div className="mt-4 description-block">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <PortableText value={show.acf.description} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShowDetailPage;