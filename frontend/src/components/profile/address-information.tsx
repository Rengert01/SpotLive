import React, { useState } from "react";
import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dictionary } from "@/@types/dictionary";
import { COUNTRIES_STATES } from "@/lib/data";
import { Pencil } from 'lucide-react';
import { Controller } from "react-hook-form";
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
import { addressSchema, formSchema } from '@/lib/profile-schema';
import { z } from "zod"


const AddressInfoBox: React.FC = () => {
    const [editState, setEditState] = useState(false);
    const [selectedCountryData, setSelectedCountryData] = useState<Dictionary>({});


    const dummyProfile = {
        contact_information: {
            address: "123 Main St",
            city: "New York",
            state: "NY",
            country: "USA",
        },
        personal_information: {
            first_name: "John",
            last_name: "Doe",
            profilePicture: "https://via.placeholder.com/150",
        },
    };

    // Declare form
    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: dummyProfile?.contact_information,
    })

    const { defaultValues } = form?.formState

    // Declare Handle sumbit
    function onSubmit(values: z.infer<typeof addressSchema>) {
        console.log(values)
    }

    const handleEdit = () => {
        if (defaultValues?.country) {
            const countryData = COUNTRIES_STATES.find((f: Dictionary) => f.name === defaultValues?.country);
            setSelectedCountryData(countryData || {});
        }
        setEditState(true);
    };


    return (
        <div className="bg-white p-6  shadow-md space-y-6 ">
            {/* Title and action buttons */}
            <div className="flex justify-between items-center border-b pb-4">
                <p className="text-lg font-semibold">Address Information</p>
                {editState ? (
                    <div className="flex space-x-4">
                        <div onClick={() => setEditState(false)} className="flex items-center cursor-pointer text-primary">
                            <p className="mr-1">View Mode</p>
                        </div>

                    </div>
                ) : (
                    <div onClick={handleEdit} className="flex items-center cursor-pointer text-primary">
                        <p className="mr-1">Edit</p>
                        <figure><Pencil className='w-[1rem]' /></figure>
                    </div>
                )}
            </div>

            {/* Content display */}
            <div className="space-y-6 w-full">
                {editState ? (
                    <>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2 w-full overflow-hidden">

                                <Controller
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <CustomSelect
                                            label="Country"
                                            options={selectedCountryData?.stateProvinces?.map((item: Dictionary) => ({ label: item.name, value: item.name })) || []}
                                            selected={field.value}
                                            setSelected={(value) => field.onChange(value)}
                                            placeholder="Select gender"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <CustomSelect
                                            label="State"
                                            options={[
                                                { label: "Select country", value: "" },
                                                ...COUNTRIES_STATES.map((item) => ({ label: item.name, value: item.name })),
                                            ]}
                                            selected={field.value}
                                            setSelected={(value) => field.onChange(value)}
                                            placeholder="Select State"
                                            disabled={!defaultValues?.country}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="City" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <Button type="submit" className="w-fit ">Submit</Button>
                            </form>
                        </Form>
                    </>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex justify-between">
                            <p className="font-medium text-gray-700">Country</p>
                            <p className="text-gray-600">{defaultValues?.country || "---"}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium text-gray-700">State</p>
                            <p className="text-gray-600">{defaultValues?.state || "---"}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium text-gray-700">City</p>
                            <p className="text-gray-600">{defaultValues?.city || "---"}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium text-gray-700">Street</p>
                            <p className="text-gray-600">{defaultValues?.address || "---"}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressInfoBox;
