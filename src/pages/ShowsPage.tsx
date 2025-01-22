import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"
import { useEffect, useState } from "react";
import { Tag, TagsMap, Post } from "../types";
import { Link } from 'react-router-dom';

export default function Shows() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [tagsMap, setTagsMap] = useState<TagsMap>(() => ({
    fallback: "loading...",
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesMap, setImagesMap] = useState<Record<number, string>>({});
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const POSTS_PER_PAGE = 12;

  const handleTagSelect = (tagId: number) => {
    setSelectedTags(prevSelectedTags => {
      const newSelectedTags = prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter(id => id !== tagId)
        : [...prevSelectedTags, tagId];

      // Reset to first page when tags change
      setCurrentPage(1);
      return newSelectedTags;
    });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * POSTS_PER_PAGE;
      const tagsParam = selectedTags.length > 0
        ? `&tags=${selectedTags.join(',')}`
        : '';

      const postsResponse = await fetch(
        `https://www.xlair.be/wp-json/wp/v2/homepage-items?per_page=${POSTS_PER_PAGE}&offset=${offset}${tagsParam}`
      );

      const totalCount = postsResponse.headers.get('X-WP-Total');
      setTotalPosts(totalCount ? parseInt(totalCount) : 0);

      const postsData = await postsResponse.json();

      // Sort posts by start_time in descending order
      const sortedPosts = postsData.sort((a: Post, b: Post) => {
        const startTimeA = a.acf?.start_time ? new Date(a.acf.start_time) : new Date(0);
        const startTimeB = b.acf?.start_time ? new Date(b.acf.start_time) : new Date(0);
        return startTimeB.getTime() - startTimeA.getTime();
      });

      setPosts(sortedPosts);

      // Fetch images for new posts
      const images: Record<number, string> = {};
      await Promise.all(
        sortedPosts.map(async (post: Post) => {
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

  // Fetch tags only once when component mounts
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

  // Fetch posts when page or tags change
  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedTags]); // Add dependencies here

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <main className="mx-4">
      <div className="md:grid sm:grid-cols-3 xl:grid-cols-4 gap-4 md:flex-row flex-wrap items-stretch flex-col">
        <div className="flex mx-4 mt-6 flex-wrap gap-2 mb-4 sm:col-span-3 xl:col-span-4 items-center justify-center">
          <h3 className="text-sm font-semibold">Tags:</h3>
          {Object.entries(tagsMap).map(([tagId, tagName]) => (
            <button
              key={tagId}
              onClick={() => handleTagSelect(Number(tagId))}
              className={`
                text-xs rounded-lg p-3 pt-1 pb-1 borderborder-zinc-700 
                ${selectedTags.includes(Number(tagId))
                  ? 'bg-zinc-200 text-black'
                  : 'bg-zinc-900 text-foreground'}
              `}
            >
              {tagName}
            </button>
          ))}
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {/* First page always */}
              <PaginationItem>
                <PaginationLink
                  isActive={currentPage === 1}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Ellipsis and additional page numbers */}
              {totalPages > 5 && currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Dynamic page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map(page => (
                  page !== 1 && page !== totalPages && (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))
              }

              {/* Last page always */}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="col-span-full flex justify-center items-center">
            No posts found.
          </div>
        ) : (
          posts.map((post: Post) => (
            <Link to={`/shows/${post.id}`} key={post.id}>
            <Card
              key={post.id}
              className="mb-2 bg-foreground text-foreground hover:bg-neutral-800 border-zinc-700 flex-shrink min-w-64 "
            >
              <CardHeader>
                <CardTitle className="flex text-xxl justify-between content-center">
                  {new DOMParser().parseFromString(post.title.rendered, "text/html").documentElement.textContent}{" "}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {post.acf.mixcloud_link && post.acf.mixcloud_link.url ? (
                  <iframe
                    className="rounded-lg m-0"
                    width="100%"
                    height="100%"
                    src={`https://player-widget.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(
                      post.acf.mixcloud_link.url
                    )}`}
                    title={post.title.rendered}
                    frameBorder="0"
                  ></iframe>
                ) : post.acf.post_image && imagesMap ? (
                  <img
                    className="rounded-lg opacity-70 w-full h-32 object-cover" // Adjust height (h-48) as needed
                    src={imagesMap[post.id]}
                    alt="Post Image"
                  />
                ) : post.acf.post_image ? (
                  <p>
                    loading ...
                  </p>
                ) : (
                  <div className="w-full h-full bg-zinc-800"></div> // Dark background
                )}
              </CardContent>
              <CardFooter>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(tagsMap).length > 0 ? (
                    post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs rounded-lg p-3 pt-1 pb-1 bg-zinc-900"
                      >
                        {tagsMap[tag] || `Tag ${tag}`}
                      </span>
                    ))
                  ) : (
                    <>loading ...</>
                  )}
                </div>
              </CardFooter>
            </Card>
            </Link>
          )))}
      </div>
    </main>
  );
}

