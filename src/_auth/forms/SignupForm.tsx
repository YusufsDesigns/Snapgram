
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"


import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useCreateAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignupForm = () => {
    const { toast } = useToast()

    const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateAccount()
    const { mutateAsync: signInAccount } = useSignInAccount()

    const { checkAuthUser } = useUserContext()

    const navigate = useNavigate()



    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: '',
            email: '',
            username: '',
            password: '',
        },
    })
    
    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        const newUser = await createUserAccount(values)
        
        if(!newUser){
            return toast({
                title: "Sign up failed. Please try again."
            })
        }

        const session = await signInAccount({
            email: values.email,
            password: values.password
        })

        if(!session){
            return toast({
                title: "Sign in failed. Please try again."
            })
        }

        const isLoggedIn = await checkAuthUser()
        
        if(isLoggedIn){
            form.reset()

            navigate('/')
        } else{
            return toast({
                title: "Sign up failed. Please try again."
            })
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="" />
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
                <p className="text-light-3 small-medium md:base-regular">To use Snapgram, please enter your details</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full mt-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input type="text" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" className="shad-input" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />
                    <Button className="shad-button_primary mt-5" type="submit">
                        {isCreatingUser ? (
                            <div className="flex-center gap-2">
                                <Loader />
                                Loading...
                            </div>
                        ): "Sign Up"}
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have an account? 
                        <Link to="/login" className="text-primary-500 text-small-semibold ml-1">Log In</Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignupForm