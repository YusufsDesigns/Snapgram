import { useUserContext } from "@/context/AuthContext"
import { formatDate } from "@/lib/utils"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"
import { useDeletePost } from "@/lib/react-query/queriesAndMutations"
import Loader from "./Loader"
import { toast } from "../ui/use-toast"


type PostCardProps = {
    post: Models.Document
}


const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserContext()
    const formattedDate = formatDate(post.$createdAt)

    const { mutate:deletePost, isPending, isSuccess } = useDeletePost()

    const handleDeletePost = () => {
        console.log({postId: post.$id, imageId: post.imageId});
        
        deletePost({postId: post.$id, imageId: post.imageId})
    }

    
    if(!post.creator) return

    if(isSuccess){
        toast({
            variant: isSuccess ? 'default' : 'destructive',
            title: isSuccess ? "Post deleted successfully" : 'Something went wrong'
        })
    }

    return (
        <div className="post-card mb-6 sm:mb-0">
            <div className="flex-between px-5 sm:px-0">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img 
                            src={post?.creator.imageUrl || '/assets/icons/profile-placeholder'} 
                            alt="creator" 
                            className="rounded-full w-12 lg:h-12"
                        />
                    </Link>
                    <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
                        <div className="flex-center gap-2 text-light-3">
                            <p className="subtle-semibold lg:small-regular">{formattedDate}</p>
                            -
                            <p className="subtle-semibold lg:small-regular">{post.location}</p>
                        </div>
                    </div>
                </div>
                    {isPending ?
                        <Loader />
                        :
                        <div onClick={handleDeletePost}>
                            <img 
                            src="/assets/icons/delete.svg" 
                            alt="edit" 
                            width={20}
                            height={20}
                            className={`${user.id !== post.creator.$id ? 'hidden' : 'cursor-pointer'}`}
                            />
                        </div>
                    }
            </div>
            <Link to={`/posts/${post.$id}`}>
                <div className="small-medium lg:base-medium py-5 px-5 sm:px-0">
                    <p>{post.caption}</p>
                    <ul className="flex gap-1 mt-2">
                        {post.tags.map((tag: string) => (
                            <li key={tag} className="text-light-3">
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>
                <img 
                    src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                    alt="" 
                    className="object-contain"
                />
            </Link>

            <PostStats post={post} userId={user.id} />
        </div>
    )
}

export default PostCard