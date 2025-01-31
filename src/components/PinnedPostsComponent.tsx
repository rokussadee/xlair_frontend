import { useState, useEffect, useLayoutEffect } from 'react';
import { Tag, TagsMap, Post } from "../types";
import { Link } from 'react-router-dom';
import pin from '../assets/red_pin.png';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default function PinnedPostsComponend() {
  const [imagesMap, setImagesMap] = useState<Record<number, string>>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagsMap, setTagsMap] = useState<TagsMap>(() => ({
    fallback: "loading...",
  }));

  const [width, ] = useWindowSize();
  const [isMobile, setIsMobile] = useState(width <= 768);

  useEffect(() => {
    if (width <= 1024) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [width])
  

const fetchPinnedPosts = async () => {
  setIsLoading(true);
  try {

    const postsResponse = await fetch(
      `https://www.xlair.be/wp-json/wp/v2/homepage-items/`
    );

    const postsData = await postsResponse.json();

    const filteredPosts = postsData.filter((post:Post) => post.acf.pin_post);

    setPosts(filteredPosts);

    // Fetch images for new posts
    const images: Record<number, string> = {};
    await Promise.all(
      filteredPosts.map(async (post: Post) => {
        if (post.acf.post_image) {
          try {
            const imageResponse = await fetch(
              `https://www.xlair.be/wp-json/wp/v2/media/${post.acf.post_image}`
            );
            const imageData = await imageResponse.json();
            images[post.id] = imageData.source_url;
          } catch (error) {
            console.error(`Error fetching image for post ${post.id}:`, error);
          }
        }
      })
    );


    setImagesMap(images);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setIsLoading(false);
  }
};

 useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsResponse = await fetch("https://www.xlair.be/wp-json/wp/v2/tags");
        const tagsData: Tag[] = await tagsResponse.json();

        const tagMapping: Record<number, string> = {};
        tagsData.forEach((tag: Tag) => {
          tagMapping[tag.id] = tag.name;
        });

        setTagsMap(tagMapping);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);



  useEffect(() => {
    fetchPinnedPosts();
  }, []); 

 return (
   <div className='md:grid md:grid-cols-2 md:gap-4 lg:flex lg:flex-row flex-wrap sm:mx-2 mt-4 lg:mt-8'>
        {/* <div className='grow p-4 overflow-hidden rounded-md bg-[#1c1c1c] border border-zinc-700 text-foreground  bg-gradient-to-br from-neutral-900 via-transparent to-neutral-700 backdrop-blur '>
          <h1 className='font-bold text-3xl'>Post</h1>
        </div> */}
         {isLoading ? (
          <div className="col-span-full flex justify-center items-center">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="col-span-full p-4 flex justify-center items-center">
            No posts found.
          </div>
        ) : (
          posts.map((post: Post) => (
            <Link className='grow' to={`/shows/${post.id}`} key={post.id}>
            <div
              key={post.id}
              className="relative mb-4 lg:mb-6 border flex rounded-md p-4 border-zinc-700 h-full bg-foreground text-foreground hover:bg-neutral-800 border-zinc-700 hover:z-30 transition-all duration-200"
              style={{
                transform: !isMobile ? `rotate(${Math.floor(Math.random() * 40) - 20}deg)` : "rotate(0deg)"
              }}
            >
              <div className='relative flex w-full flex-row justify-between gap-2 h-min'>
                {post.acf.mixcloud_link && post.acf.mixcloud_link.url ? (
                  <iframe
                    className="rounded-lg m-0 max-w-48"
                    width="112px"
                    height="112px"
                    src={`https://player-widget.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(
                      post.acf.mixcloud_link.url
                    )}`}
                    title={post.title.rendered}
                    frameBorder="0"
                  ></iframe>
                ) : post.acf.post_image && imagesMap ? (
                  <div>
                  <img
                    className="rounded-lg absolute blur-xl -left-4  opacity-40 w-full h-32 object-cover" // Adjust height (h-48) as needed
                    src={imagesMap[post.id]}
                    alt="xlair show Image"
                  />
                  <img
                    className="rounded-lg max-w-48 right-0 h-28 object-cover" // Adjust height (h-48) as needed
                    src={imagesMap[post.id]}
                    alt="xlair show Image"
                  />
                  </div>
                ) : post.acf.post_image ? (
                  <p>
                    loading ...
                  </p>
                ) : (
                  <div className="w-full h-full bg-zinc-800"></div> // Dark background
                )}
              <div className="flex w-full max-h-20">

                  <div className='z-10  sm:mt-0 sm:ml-4'>
                    <h1 className="flex md:text-md mb-1 ld:mb-3 font-medium justify-between content-center">
                      {new DOMParser().parseFromString(post.title.rendered, "text/html").documentElement.textContent}{" "}
                    </h1>

                  <div className="flex flex-wrap gap-2 ">
                    {Object.keys(tagsMap).length > 0 ? (
                      post.tags.map((tag) => (
                        <span
                        key={tag}
                        className="text-xs rounded-md p-1 pb-1 border border-zinc-700"
                        >
                          {tagsMap[tag] || `Tag ${tag}`}
                        </span>
                      ))
                    ) : (
                      <>loading ...</>
                    )}
                  </div>
                </div>
                </div>
              </div>

                    <img className="absolute -right-5 -top-5 z-50" src={pin} alt="Red pin" width={60}
                    style={{
                      transform: `rotate(${Math.floor(Math.random() * 45) - 35}deg)`
                    }}/>

            </div>
            </Link>
          )))}
   </div>
 )
}

