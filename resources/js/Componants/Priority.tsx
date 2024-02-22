import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export const CustomPriority: React.FC<{ iconName: IconProp; label: string }> = ({ iconName, label }) => {
    return (
        <div className="priority">
            <span>{label}</span>
            <span className="icon">
                <FontAwesomeIcon icon={iconName} />
            </span>
        </div>
    );
};

export const CustomPriorityIcon: React.FC<{ iconName: IconProp }> = ({ iconName }) => {
    return (
        <>
            <FontAwesomeIcon icon={iconName} />
        </>
    );
};
