import { editIcon } from "@/assets/edit";
import CustomDateInput from "@/components/custom-date-input";
import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

interface PersonalInfo {
  first_name: string;
  last_name: string;
  maiden_name: string;
  middle_name: string;
  date_of_birth: string;
  work_email: string;
  gender: string;
  phone_number: string;
}

const PersonalInfoBox: React.FC = () => {
  const [editState, setEditState] = useState<boolean>(false);

  const dummyData: PersonalInfo = {
    first_name: "Joe",
    last_name: "Doe",
    maiden_name: "---",
    middle_name: "---",
    date_of_birth: "1990-01-01",
    work_email: "joeDoe@mailinator.com",
    gender: "Male",
    phone_number: "1234567890",
  };

  const [details, setDetails] = useState<PersonalInfo>({
    first_name: "",
    last_name: "",
    maiden_name: "",
    middle_name: "",
    date_of_birth: "",
    work_email: "",
    gender: "",
    phone_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("Submitting data:", details);
  };

  const handleEdit = () => {
    setDetails(dummyData);
    setEditState(true);
  };

  useEffect(() => {
    setDetails(dummyData);
  },)

  const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "others" },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-t-lg w-full mx-auto mt-8">
      {/* Title and Edit Button */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold text-gray-800">Personal Information</p>
        {editState ? (
          <div className="flex space-x-4">
            <button
              onClick={() => setEditState(false)}
              className="text-blue-600 text-sm font-medium"
            >
              View Mode
            </button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </Button>
          </div>
        ) : (
          <button onClick={handleEdit} className="flex items-center text-blue-600">
            <span className="text-sm font-medium mr-2">Edit</span>
            <figure>{editIcon}</figure>
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        {editState ? (
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="First Name"
              type="text"
              placeholder="E.g Hassan"
              name="first_name"
              onChange={handleChange}
              value={details.first_name}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <Input
              label="Last Name"
              type="text"
              placeholder="E.g Lamidi"
              name="last_name"
              onChange={handleChange}
              value={details.last_name}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <Input
              label="Maiden Name"
              type="text"
              placeholder="E.g Maiden Name"
              name="maiden_name"
              onChange={handleChange}
              value={details.maiden_name}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <Input
              label="Middle Name"
              type="text"
              placeholder="E.g Middle Name"
              name="middle_name"
              onChange={handleChange}
              value={details.middle_name}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <CustomDateInput
              label="Date of Birth"
              id="date_of_birth"
              name="date_of_birth"
              handleChange={(date) =>
                setDetails((prev) => ({ ...prev, date_of_birth: date }))
              }
              selected={new Date(details?.date_of_birth)}
              placeholder="YYYY/MM/DD"
              className="w-full p-2"
            />
            <CustomSelect
              label="Gender"
              options={genderList}
              selected={details.gender}
              setSelected={(value) =>
                setDetails((prev) => ({ ...prev, gender: value }))
              }
              placeholder="Select gender"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <Input
              label="Work Email"
              type="email"
              placeholder="E.g JoeDoe@mailinator.com"
              name="work_email"
              onChange={handleChange}
              value={details.work_email}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="E.g 0816263...."
              name="phone_number"
              onChange={handleChange}
              value={details.phone_number}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ) : (
          <div className="space-y-4 text-gray-600">
            <div className="flex justify-between">
              <p>First Name</p>
              <p>{details.first_name || "---"}</p>
            </div>
            <div className="flex justify-between">
              <p>Last Name</p>
              <p>{details.last_name || "---"}</p>
            </div>
            <div className="flex justify-between">
              <p>Maiden Name</p>
              <p>{details.maiden_name || "---"}</p>
            </div>
            <div className="flex justify-between">
              <p>Middle Name</p>
              <p>{details.middle_name || "---"}</p>
            </div>
            <div className="flex justify-between">
              <p>Gender</p>
              <p>{details.gender || "---"}</p>
            </div>
            <div className="flex justify-between">
              <p>DOB</p>
              <p>{details.date_of_birth || "---"}</p>
            </div>
            <div className="flex justify-between">
              <p>Email</p>
              <p>{details.work_email || "---"}</p>
            </div>
            <div className="flex justify-between">
              <p>Phone Number</p>
              <p>{details.phone_number || "---"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoBox;
