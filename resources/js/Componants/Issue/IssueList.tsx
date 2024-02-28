import { Issue, Project } from "@/types";
import { IssueListDetails } from "@/Componants/Issue/IssueListDetails";

interface IssueListProps {
    issueArray: Issue[];
    createdIssue: Issue[];
    assignedIssue: Issue[];
    Projects: Project[];
    typeView: string;
}

export const IssueList: React.FC<IssueListProps> = ({ issueArray, Projects, assignedIssue, createdIssue, typeView }) => {
    return (
        <>
            {typeView === "all" ? (
                <>
                    <IssueListDetails issueArray={issueArray} Projects={Projects} />
                </>
            ) : typeView === "created" ? (
                <>
                    <IssueListDetails issueArray={createdIssue} Projects={Projects} />
                </>
            ) : (
                <>
                    <IssueListDetails issueArray={assignedIssue} Projects={Projects} />
                </>
            )}
        </>
    );
};
