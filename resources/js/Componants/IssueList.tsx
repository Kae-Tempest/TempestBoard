import { Issue, Project } from "@/types";
import { issueStateEnum, priorityIconEnum } from "@/enums/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CanceledIssueIcon, CompletedIssueIcon, InProgressIssueIcon, OpenIssueIcon } from "@/Componants/StateIcon";
import { CustomPriorityIcon } from "@/Componants/Priority";
import { faAnglesUp, faChevronDown, faCircleExclamation, faMinus, faPause, faPlus } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import IssueModal from "@/Componants/IssueModal";
import { useState } from "react";

interface IssueListProps {
    issueArray: Issue[];
    Projects: Project[];
    state: string;
}

const IssueIcon: React.FC<{ state: string }> = ({ state }) => {
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
const PriorityIcon: React.FC<{ priority: string }> = ({ priority }) => {
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

export const IssueList: React.FC<IssueListProps> = ({ issueArray, Projects, state }) => {
    const indexOfState = Object.values(issueStateEnum).indexOf(state as unknown as issueStateEnum);
    const key = Object.keys(issueStateEnum)[indexOfState];
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <>
            <IssueModal projects={Projects} setShowModal={setShowModal} showModal={showModal} />
            <div className="issue-header">
                <div>
                    <IssueIcon state={state} /> {key}
                </div>
                <FontAwesomeIcon icon={faPlus} onClick={() => setShowModal(true)} className="issue-add" />
            </div>
            {issueArray
                .filter(i => i.status === state)
                .map(issue => {
                    return (
                        <div key={issue.id} className="issue-list">
                            {Projects.map(project => {
                                return (
                                    <div key={project.id} className="issue-info">
                                        <div className="issue-content">
                                            <div className="priority">
                                                <PriorityIcon priority={issue.priority} />
                                            </div>
                                            <div className="tag-number">
                                                {project.name.substring(0, 3)}-{issue.id}
                                            </div>
                                            <div className="title-issue">{issue.title}</div>
                                        </div>
                                        <div className="project-content">
                                            <div className="tag">{project.id == issue.project_id && project.name}</div>
                                            <div>{issue.created_at}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
        </>
    );
};
