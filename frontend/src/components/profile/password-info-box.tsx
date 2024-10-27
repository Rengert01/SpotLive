import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    validatePasswordLength,
    validatePasswordLowercase,
    validatePasswordNumber,
    validatePasswordSpecialCharacter,
    validatePasswordUpperCase,
} from "@/lib";
import { passwordValidations, passwordValidation as pv } from "@/lib/auth/schema";
import TogglePassword from "../toggle-password";
import PasswordChecker from "../password-checker";
import { editIcon } from "@/assets/edit";

const PasswordInfoBox: React.FC = () => {
    const [editState, setEditState] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Dummy initial state for password details
    const [details, setDetails] = useState({
        current_password: "OldPassword123!",  // Dummy current password
        password: "NewPassword456!",           // Dummy new password
        password_confirmation: "NewPassword456!", // Dummy password confirmation
    });

    const [passwordError, setPasswordError] = useState("");

    // Input change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails((prev) => ({ ...prev, [name]: value }));
        if (passwordError) {
            setPasswordError("");
        }
    };

    // Submit handler
    const handleSubmit = () => {
        if (details.password !== details.password_confirmation) {
            setPasswordError("Passwords do not match");
            return;
        }

        // Here, you would typically handle the password change logic
        console.log("Password updated successfully:", details);
        setEditState(false);
        setDetails({ current_password: "", password: "", password_confirmation: "" });
    };

    // Validation check
    const isPasswordValid = () => {
        return (
            validatePasswordLength(details.password) &&
            validatePasswordLowercase(details.password) &&
            validatePasswordUpperCase(details.password) &&
            validatePasswordSpecialCharacter(details.password) &&
            validatePasswordNumber(details.password)
        );
    };

    return (
        <div className="bg-white shadow-md rounded-b-lg p-6">
            {/* Title and Edit/Save Buttons */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Change Password</p>
                <div className="flex items-center">
                    <button
                        className="text-blue-500 underline mr-4"
                        onClick={() => setEditState((prev) => !prev)}
                    >
                        {editState ? "View Mode" : <div className="flex items-center cursor-pointer text-blue-600"> <span className="text-sm font-medium mr-2">Edit</span>
                            <figure>{editIcon}</figure></div>}
                    </button>
                    {editState && (
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white"
                            disabled={
                                !details.current_password ||
                                !details.password ||
                                !details.password_confirmation ||
                                !isPasswordValid()
                            }
                        >
                            Save Changes
                        </Button>
                    )}
                </div>
            </div>

            {/* Password Input Fields */}
            <div className="flex flex-col gap-2 w-full">
                {editState ? (
                    <>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="relative p-2">
                                <Input
                                    label="Current Password"
                                    id="password cur"
                                    name="current_password"
                                    disabled={!editState}
                                    value={details?.current_password}
                                    onChange={handleChange}
                                    placeholder="Input Password"
                                    type={showPassword ? "text" : "password"}
                                />
                                <TogglePassword
                                    showPassword={showPassword}
                                    setShowPassword={() => setShowPassword(!showPassword)}
                                    className="top-9 p-2"
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-full ">
                                <div className="relative p-2">

                                    <Input
                                        label="New Password"
                                        id="password new"
                                        name="password"
                                        disabled={!editState}
                                        value={details?.password}
                                        onChange={handleChange}
                                        placeholder="Input Password"
                                        type={showPassword ? "text" : "password"}
                                        error={passwordError}
                                        touched={passwordError ? true : false}
                                    />
                                    <TogglePassword
                                        showPassword={showPassword}
                                        setShowPassword={() => setShowPassword(!showPassword)}
                                        className="top-9 p-2"
                                    />
                                </div>

                            </div>
                            <div className="relative p-2">
                                <Input
                                    label="Confirm New Password"
                                    id="password cur new"
                                    name="password_confirmation"
                                    disabled={!editState}
                                    value={details?.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Input Password"
                                    type={showPassword ? "text" : "password"}
                                    error={passwordError}
                                    touched={passwordError ? true : false}
                                />
                                <TogglePassword
                                    showPassword={showPassword}
                                    setShowPassword={() => setShowPassword(!showPassword)}
                                    className="top-9 p-2"
                                />
                                <div

                                    className="mt-6 flex flex-col gap-2"
                                >
                                    {passwordValidations?.map((validation, idx) => (
                                        <PasswordChecker
                                            key={idx}
                                            isValid={pv(details?.password, validation)}
                                            title={validation}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="grid gap-4 sm:grid-cols-2"
                        >
                            <div className="relative">
                                <Input
                                    label="Current Password"
                                    id="password cur"
                                    name="current_password"
                                    disabled={!editState}
                                    value={details?.current_password}
                                    onChange={handleChange}
                                    placeholder="Input Password"
                                    type={showPassword ? "text" : "password"}
                                />
                                <TogglePassword
                                    showPassword={showPassword}
                                    setShowPassword={() => setShowPassword(!showPassword)}
                                    className="top-9"
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    label="New Password"
                                    id="password new"
                                    name="password"
                                    disabled={!editState}
                                    value={details?.password}
                                    onChange={handleChange}
                                    placeholder="Input Password"
                                    type={showPassword ? "text" : "password"}
                                />
                                <TogglePassword
                                    showPassword={showPassword}
                                    setShowPassword={() => setShowPassword(!showPassword)}
                                    className="top-9"
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    label="Confirm New Password"
                                    id="password cur new"
                                    name="password_confirmation"
                                    disabled={!editState}
                                    value={details?.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Input Password"
                                    type={showPassword ? "text" : "password"}
                                />
                                <TogglePassword
                                    showPassword={showPassword}
                                    setShowPassword={() => setShowPassword(!showPassword)}
                                    className="top-9"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PasswordInfoBox;
