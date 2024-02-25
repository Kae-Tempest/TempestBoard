import { Issue, Project } from "@/types";
import { issueStateEnum } from "@/enums/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import IssueModal from "@/Componants/Issue/IssueModal";
import { useState } from "react";
import { IssueIcon } from "@/Componants/Icons/IssueIcon";
import { IssueListDetails } from "@/Componants/Issue/IssueListDetails";

interface IssueListProps {
    issueArray: Issue[];
    createdIssue: Issue[];
    assignedIssue: Issue[];
    Projects: Project[];
    state: string;
    typeView: string;
}

export const IssueList: React.FC<IssueListProps> = ({ issueArray, Projects, state, assignedIssue, createdIssue, typeView }) => {
    const indexOfState = Object.values(issueStateEnum).indexOf(state as unknown as issueStateEnum);
    const key = Object.keys(issueStateEnum)[indexOfState];
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <>
            <IssueModal projects={Projects} setShowModal={setShowModal} showModal={showModal} state={state} />

            {typeView === "all" ? (
                <>
                    <IssueListDetails issueArray={issueArray} Projects={Projects} state={state} setShowModal={setShowModal} enumKey={key} />
                </>
            ) : typeView === "created" ? (
                <>
                    <IssueListDetails issueArray={createdIssue} Projects={Projects} state={state} setShowModal={setShowModal} enumKey={key} />
                </>
            ) : (
                <>
                    <IssueListDetails issueArray={assignedIssue} Projects={Projects} state={state} setShowModal={setShowModal} enumKey={key} />
                </>
            )}
        </>
    );
};
