import { Issue, Project } from "@/types";
import IssueModal from "@/Componants/Issue/IssueModal";
import { useState } from "react";
import { IssueListDetails } from "@/Componants/Issue/IssueListDetails";

interface IssueListProps {
    issueArray: Issue[];
    createdIssue: Issue[];
    assignedIssue: Issue[];
    Projects: Project[];
    typeView: string;
}

export const IssueList: React.FC<IssueListProps> = ({ issueArray, Projects, assignedIssue, createdIssue, typeView }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <>
            <IssueModal projects={Projects} setShowModal={setShowModal} showModal={showModal} />

            {typeView === "all" ? (
                <>
                    <IssueListDetails issueArray={issueArray} Projects={Projects} setShowModal={setShowModal} />
                </>
            ) : typeView === "created" ? (
                <>
                    <IssueListDetails issueArray={createdIssue} Projects={Projects} setShowModal={setShowModal} />
                </>
            ) : (
                <>
                    <IssueListDetails issueArray={assignedIssue} Projects={Projects} setShowModal={setShowModal} />
                </>
            )}
        </>
    );
};
