import Loader from "@/components/shared/Loader"
import PostCard from "@/components/shared/PostCard"
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"


const Home = () => {
  const { data:posts, isLoading } = useGetRecentPosts()
  

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full px-5 sm:px-0">Home Feed</h2>
          {isLoading && !posts ? (
            <Loader />
          ): (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard key={post.caption} post={post} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home