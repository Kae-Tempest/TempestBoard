import React, { useState } from "react";

interface CustomCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (e: { target: { checked: boolean } }) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, checked, onChange }) => {
    const [isChecked, setIsChecked] = useState(checked);
    return (
        <div id="checkbox">
            <input
                type="checkbox"
                name="remember"
                checked={isChecked}
                onChange={onChange}
                onClick={() => setIsChecked(!isChecked)}
            />
            <svg
                className={isChecked ? "is-active" : ""}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <label className="ml-2">{label}</label>
        </div>
    );
};

export default CustomCheckbox;
