import { useState, useEffect } from 'react';
import { Tag, TagsMap, Post } from "../types";
import { Link } from 'react-router-dom';
import pin from '../assets/red_pin.png';


export default function PinnedPostsComponend() {
  const [imagesMap, setImagesMap] = useState<Record<number, string>>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagsMap, setTagsMap] = useState<TagsMap>(() => ({
    fallback: "loading...",
  }));
  

const fetchPinnedPosts = async () => {
  setIsLoading(true);
  try {

    const postsResponse = await fetch(
      `https://www.xlair.be/wp-json/wp/v2/homepage-items/`
    );

    const postsData = await postsResponse.json();

    let filteredPosts = postsData.filter((post:Post) => post.acf.pin_post);

    setPosts(filteredPosts);

    // Fetch images for new posts
    let images: Record<number, string> = {};
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
   <div className='flex flex-col lg:flex-row flex-wrap grid-cols-3 sm:mx-2 gap-4 mt-8'>
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
              className="mb-6 border flex rounded-md p-4 border-zinc-700 h-full bg-foreground text-foreground hover:bg-neutral-800 border-zinc-700   "
            >
              <div className='relative flex w-full flex-col sm:flex-row'>
                {post.acf.mixcloud_link && post.acf.mixcloud_link.url ? (
                  <iframe
                    className="rounded-lg m-0 max-w-48"
                    width="100%"
                    height="100%"
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
                    className="rounded-lg max-w-48 right-0 h-32 object-cover" // Adjust height (h-48) as needed
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
              <div className="flex space-between w-full">
                <div>
                  <div className='z-10 mt-4 sm:mt-0 sm:ml-4'>
                    <h1 className="flex md:text-xl mb-3 font-bold justify-between content-center">
                      {new DOMParser().parseFromString(post.title.rendered, "text/html").documentElement.textContent}{" "}
                    </h1>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:ml-4 ">
                    {Object.keys(tagsMap).length > 0 ? (
                      post.tags.map((tag) => (
                        <span
                        key={tag}
                        className="text-xs rounded-md p-3 pt-1 pb-1 border border-zinc-700"
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
                <div className='flex-end relative'>
                    <img className="relative -right-8 -top-10" src={pin} alt="Red pin" width={60} />
                </div>
            </div>
            </Link>
          )))}
   </div>
 )
}

