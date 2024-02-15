import React, { useState } from "react";

interface CustomCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (e: { target: { checked: boolean } }) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    label,
    checked,
    onChange,
}) => {
    const [ischecked, setisChecked] = useState(checked);
    return (
        <div className="w-full flex mt-4">
            <input
                type="checkbox"
                name="remember"
                checked={ischecked}
                onChange={onChange}
                onClick={() => setisChecked(!ischecked)}
                className="
                peer relative appearance-none shrink-0 w-4 h-4 bg-Tertiary border-[0.5px] border-Quaternary rounded-[5px] mt-1
                focus:outline-none focus:ring-offset-0 focus:ring-1 focus:ring-blue-100
                checked:bg-blue-500 checked:border-[0.5px] checked:border-Quaternary
            "
            />
            <svg
                className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block stroke-white outline-none mt-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <label className="ml-2">{label}</label>
        </div>
    );
};

export default CustomCheckbox;
