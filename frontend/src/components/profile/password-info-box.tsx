import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { formSchema, passwordSchema } from '@/lib/profile-schema';
import { z } from "zod"
import { Pencil } from 'lucide-react';
import TogglePassword from "../toggle-password";

const PasswordInfoBox: React.FC = () => {
    const [editState, setEditState] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dummy = {
        current_password: "OldPassword123!",  // Dummy current password
        password: "NewPassword456!",           // Dummy new password
        password_confirmation: "NewPassword456!", // Dummy password confirmation
    };

    // Declare form
    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: dummy,
    })

    // Declare Handle sumbit
    function onSubmit(values: z.infer<typeof passwordSchema>) {
        console.log(values)
    }

    return (
        <div className="bg-white p-6">
            {/* Title and Edit/Save Buttons */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Change Password</p>
                <div className="flex items-center">
                    <button
                        className="text-primary mr-4"
                        onClick={() => setEditState((prev) => !prev)}
                    >
                        {editState ? "View Mode" : <div className="flex items-center cursor-pointer text-primary"> <span className="text-sm font-medium mr-2">Edit</span>
                            <figure><Pencil className='w-[1rem]' /></figure></div>}
                    </button>

                </div>
            </div>

            {/* Password Input Fields */}
            <div className="flex flex-col gap-2 w-full">
                {editState ? (
                    <>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full">
                                <div className="relative p-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={!editState}
                                                        placeholder="Input Password"
                                                        type={showPassword ? "text" : "password"}
                                                        {...field}
                                                    />

                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <TogglePassword
                                        showPassword={showPassword}
                                        setShowPassword={() => setShowPassword(!showPassword)}
                                        className="top-10 p-2"
                                    />
                                </div>
                                <div className="relative p-2">
                                    <FormField
                                        control={form.control}
                                        name="password_confirmation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={!editState}
                                                        placeholder="Confirm Password"
                                                        type={showPassword ? "text" : "password"}
                                                        {...field}
                                                    />

                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <TogglePassword
                                        showPassword={showPassword}
                                        setShowPassword={() => setShowPassword(!showPassword)}
                                        className="top-10 p-2"
                                    />
                                </div>
                                <Button type="submit" className="w-fit">Submit</Button>
                            </form>
                        </Form>
                    </>
                ) : (
                    <>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full">
                                <div className="relative p-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={false}
                                                        placeholder="Input Password"
                                                        type={"password"}
                                                        {...field}
                                                    />

                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <TogglePassword
                                        showPassword={showPassword}
                                        setShowPassword={() => setShowPassword(false)}
                                        className="top-10 p-2"
                                    />
                                </div>
                            </form>
                        </Form>
                    </>
                )}
            </div>
        </div>
    );
};

export default PasswordInfoBox;
