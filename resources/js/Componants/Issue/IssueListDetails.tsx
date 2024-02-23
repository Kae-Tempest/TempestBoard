import { Issue, Project } from "@/types";
import { PriorityIcon } from "@/Componants/Icons/IssueIcon";

interface IssueListDetailsProps {
    issueArray: Issue[];
    Projects: Project[];
    state: string;
}

export const IssueListDetails: React.FC<IssueListDetailsProps> = ({ issueArray, Projects, state }) => {
    return (
        <>
            {issueArray
                .sort((a, b) => a.id - b.id)
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
