import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp, faChevronDown, faChevronUp, faMinus } from "@fortawesome/free-solid-svg-icons";

export const UrgentPriority: React.FC = () => {
    return (
        <div className="priority">
            <span>Urgent</span>
            <span className="icon">
                <FontAwesomeIcon icon={faAnglesUp} />
            </span>
        </div>
    );
};
export const HighPriority: React.FC = () => {
    return (
        <div className="priority">
            <span>High</span>
            <span className="icon">
                <FontAwesomeIcon icon={faChevronUp} />
            </span>
        </div>
    );
};

export const NeutralPriority: React.FC = () => {
    return (
        <div className="priority">
            <span>Neutral</span>
            <span className="icon">
                <FontAwesomeIcon icon={faMinus} />
            </span>
        </div>
    );
};
export const LowPriority: React.FC = () => {
    return (
        <div className="priority">
            <span>Low</span>
            <span className="icon">
                <FontAwesomeIcon icon={faChevronDown} />
            </span>
        </div>
    );
};
export const MinorPriority: React.FC = () => {
    return (
        <div className="priority">
            <span>Minor</span>
            <span className="icon">
                <FontAwesomeIcon icon={faAnglesDown} />
            </span>
        </div>
    );
};
