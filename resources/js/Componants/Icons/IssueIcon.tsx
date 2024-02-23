import { issueStateEnum, priorityIconEnum } from "@/enums/global";
import { CanceledIssueIcon, CompletedIssueIcon, InProgressIssueIcon, OpenIssueIcon } from "@/Componants/Icons/StateIcon";
import { CustomPriorityIcon } from "@/Componants/Icons/Priority";
import { faAnglesUp, faChevronDown, faCircleExclamation, faMinus, faPause } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const IssueIcon: React.FC<{ state: string }> = ({ state }) => {
    if (state === issueStateEnum.OPEN) {
        return (
            <>
                <OpenIssueIcon />
            </>
        );
    }
    if (state === issueStateEnum["IN PROGRESS"]) {
        return (
            <>
                <InProgressIssueIcon />
            </>
        );
    }
    if (state === issueStateEnum.COMPLETED) {
        return (
            <>
                <CompletedIssueIcon />
            </>
        );
    }
    if (state === issueStateEnum.CANCELED) {
        return (
            <>
                <CanceledIssueIcon />
            </>
        );
    }
};
export const PriorityIcon: React.FC<{ priority: string }> = ({ priority }) => {
    const ListIcon: IconDefinition[] = [faChevronDown, faMinus, faPause, faAnglesUp, faCircleExclamation];
    const indexOfState = Object.values(priorityIconEnum).indexOf(priority as unknown as priorityIconEnum);
    const key = Object.keys(priorityIconEnum)[indexOfState];
    let props = 0;
    if (Number(key) == 2) {
        props = 90;
    }
    return (
        <div className="tooltip">
            <CustomPriorityIcon iconName={ListIcon[Number(key)]} rotate={props} />
            <span className="tooltip-text">{priority.toLowerCase()}</span>
        </div>
    );
};
