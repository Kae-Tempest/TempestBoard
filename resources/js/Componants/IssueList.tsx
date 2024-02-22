import { Issue, Project } from "@/types";
import { issueStateEnum } from "@/enums/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import { CanceledIssueIcon, CompletedIssueIcon, InProgressIssueIcon, OpenIssueIcon } from "@/Componants/StateIcon";

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

export const IssueList: React.FC<IssueListProps> = ({ issueArray, Projects, state }) => {
    const indexOfState = Object.values(issueStateEnum).indexOf(state as unknown as issueStateEnum);
    const key = Object.keys(issueStateEnum)[indexOfState];
    return (
        <>
            <div className="issue-header">
                <div>
                    <IssueIcon state={state} /> {key}
                </div>
                <FontAwesomeIcon icon={faPlus} />
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
                                                <FontAwesomeIcon icon={faAnglesUp} />
                                            </div>
                                            <div className="tag-number">
                                                {project.name.substring(0, 3)}-{issue.id}
                                            </div>
                                            <div className="state">
                                                <IssueIcon state={state} />
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
