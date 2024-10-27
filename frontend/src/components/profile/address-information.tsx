import React, { useState } from "react";
import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dictionary } from "@/@types/dictionary";
import { COUNTRIES_STATES } from "@/lib/data";
import { editIcon } from "@/assets/edit";

const AddressInfoBox: React.FC = () => {
    const [editState, setEditState] = useState(false);
    const [selectedCountryData, setSelectedCountryData] = useState<Dictionary>({});
    const [details, setDetails] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
    });

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


    // Handler for input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Initialize form with profile details
    const handleEdit = () => {
        const { contact_information } = dummyProfile || {};
        const obj = {
            address: contact_information?.address || "",
            city: contact_information?.city || "",
            state: contact_information?.state || "",
            country: contact_information?.country || "",
        };

        if (contact_information?.country) {
            const countryData = COUNTRIES_STATES.find((f: Dictionary) => f.name === contact_information.country);
            setSelectedCountryData(countryData || {});
        }
        setDetails(obj);
        setEditState(true);
    };

    // Submit form
    const handleSubmit = async () => {
        const formData = new FormData();
        Object.entries(details).forEach(([key, value]) => formData.append(key, value as string));
        formData.append("first_name", dummyProfile?.personal_information?.first_name || "");
        formData.append("last_name", dummyProfile?.personal_information?.last_name || "");


    };

    return (
        <div className="bg-white p-6  shadow-md space-y-6 ">
            {/* Title and action buttons */}
            <div className="flex justify-between items-center border-b pb-4">
                <p className="text-lg font-semibold">Address Information</p>
                {editState ? (
                    <div className="flex space-x-4">
                        <div onClick={() => setEditState(false)} className="flex items-center cursor-pointer text-blue-600">
                            <p className="mr-1">View Mode</p>
                        </div>
                        <Button onClick={handleSubmit} type="button" className="bg-blue-500 text-white px-4 py-2 rounded" loading={false}>
                            Save Changes
                        </Button>
                    </div>
                ) : (
                    <div onClick={handleEdit} className="flex items-center cursor-pointer text-blue-600">
                        <p className="mr-1">Edit</p>
                        <figure>{editIcon}</figure>
                    </div>
                )}
            </div>

            {/* Content display */}
            <div className="space-y-6 w-full">
                {editState ? (
                    <div className="grid gap-4 sm:grid-cols-2 w-full overflow-hidden">
                        <div className="p-2">

                            <CustomSelect
                                label="Country"
                                placeholder="Select country"
                                options={[
                                    { label: "Select country", value: "" },
                                    ...COUNTRIES_STATES.map((item) => ({ label: item.name, value: item.name })),
                                ]}
                                selected={details.country}
                                setSelected={(value) => {
                                    setDetails((prev) => ({ ...prev, country: value, state: "" }));
                                    setSelectedCountryData(COUNTRIES_STATES.find((f: Dictionary) => f.name === value) || {});
                                }}

                            />
                        </div>
                        <div className="p-2">

                            <CustomSelect
                                label="State"
                                placeholder="Select state"
                                options={selectedCountryData?.stateProvinces?.map((item: Dictionary) => ({ label: item.name, value: item.name })) || []}
                                disabled={!details.country}
                                selected={details.state}

                                setSelected={(value) => setDetails((prev) => ({ ...prev, state: value }))}
                            />
                        </div>
                        <div className="p-2">
                            <Input
                                label="City"
                                type="text"
                                placeholder="E.g Lekki"
                                name="city"
                                onChange={handleChange}
                                value={details.city}

                            />

                        </div>
                        <div className="p-2">

                            <Input
                                label="Street Address"
                                type="text"
                                placeholder="E.g Ikoyi"
                                name="address"
                                onChange={handleChange}
                                value={details.address}

                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex justify-between">
                            <p className="font-medium text-gray-700">Country</p>
                            <p className="text-gray-600">{dummyProfile?.contact_information?.country || "---"}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium text-gray-700">State</p>
                            <p className="text-gray-600">{dummyProfile?.contact_information?.state || "---"}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium text-gray-700">City</p>
                            <p className="text-gray-600">{dummyProfile?.contact_information?.city || "---"}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-medium text-gray-700">Street</p>
                            <p className="text-gray-600">{dummyProfile?.contact_information?.address || "---"}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressInfoBox;
