import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "../ui/use-toast"
import { useNavigate } from "react-router"
import Loader from "../shared/Loader"




const PostForm = () => {
    
    const { user } = useUserContext()
    const navigate = useNavigate()
    const { mutateAsync: createPost, isPending } = useCreatePost()

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: "",
            file: [],
            location: "",
            tags: "",
        },
    });

    
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PostValidation>) {
        const newPost = await createPost({
            ...values,
            userId: user.id
        })

        if(!newPost){
            toast({
                title: 'Please try again'
            })
            return
        }

        navigate('/')
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Caption</FormLabel>
                        <FormControl>
                            <Textarea className="shad-textarea custom-scrollbar" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Add Photos</FormLabel>
                        <FormControl>
                            <FileUploader fieldChange={field.onChange}  />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Add Location</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" placeholder="Art, Expression, Learn" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button type="button" className="shad-button_dark_4">Cancel</Button>
                    <Button className="shad-button_primary whitespace-nowrap" type="submit">
                        {isPending ? (
                            <div className="flex-center gap-2">
                                <Loader />
                            </div>
                        ): "Submit"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm