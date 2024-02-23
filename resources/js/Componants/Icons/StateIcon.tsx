import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCirlceOutline } from "@fortawesome/free-regular-svg-icons";

export const OpenIssueIcon: React.FC = () => {
    return (
        <div className="open-issue-icon">
            <FontAwesomeIcon icon={faCirlceOutline} />
        </div>
    );
};

export const InProgressIssueIcon: React.FC = () => {
    return (
        <div className="inprogress-issue-icon">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="6.5" stroke="#003b73" />
                <path
                    d="M13 7C13 7.78793 12.8448 8.56815 12.5433 9.2961C12.2417 10.0241 11.7998 10.6855 11.2426 11.2426C10.6855 11.7998 10.0241 12.2417 9.2961 12.5433C8.56815 12.8448 7.78793 13 7 13C6.21207 13 5.43185 12.8448 4.7039 12.5433C3.97595 12.2417 3.31451 11.7998 2.75736 11.2426C2.20021 10.6855 1.75825 10.0241 1.45672 9.2961C1.15519 8.56815 1 7.78793 1 7L7 7H13Z"
                    fill="#003b73"
                />
            </svg>
        </div>
    );
};

export const CompletedIssueIcon: React.FC = () => {
    return (
        <div className="completed-issue-icon">
            <FontAwesomeIcon icon={faCircle} />
        </div>
    );
};

export const CanceledIssueIcon: React.FC = () => {
    return (
        <div className="canceled-issue-icon">
            <FontAwesomeIcon icon={faCircleXmark} />
        </div>
    );
};
