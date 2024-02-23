import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, RotateProp } from "@fortawesome/fontawesome-svg-core";

export const CustomPriority: React.FC<{ iconName: IconProp; label: string; rotate?: number }> = ({ iconName, label, rotate }) => {
    let rotation = 0;
    if (rotate) rotation = 90;
    return (
        <div className="priority">
            <span>{label}</span>
            <span className="icon">
                <FontAwesomeIcon icon={iconName} rotation={rotation as RotateProp} />
            </span>
        </div>
    );
};

export const CustomPriorityIcon: React.FC<{ iconName: IconProp; rotate: number }> = ({ iconName, rotate }) => {
    return (
        <>
            <FontAwesomeIcon icon={iconName} rotation={rotate as RotateProp} />
        </>
    );
};
