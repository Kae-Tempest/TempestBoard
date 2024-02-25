import { Issue, Project } from "@/types";
import { IssueIcon, PriorityIcon } from "@/Componants/Icons/IssueIcon";
import { ReactSortable } from "react-sortablejs";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface IssueListDetailsProps {
    issueArray: Issue[];
    Projects: Project[];
    state: string;
    enumKey: string;
    setShowModal: (showModal: boolean) => void;
}

interface IssueDetailsTemplateProps {
    issue: Issue;
    projects: Project[];
    state: string;
    enumKey: string;
    setShowModal: (showModal: boolean) => void;
}

const IssueDetailsTemplate: React.FC<IssueDetailsTemplateProps> = ({ issue, projects, state, setShowModal, enumKey }) => {
    return (
        <div>
            <div className="issue-header">
                <div>
                    <IssueIcon state={state} /> {enumKey}
                </div>
                <FontAwesomeIcon icon={faPlus} onClick={() => setShowModal(true)} className="issue-add" />
            </div>
            <div key={issue.id} className="issue-list">
                {projects
                    .filter(p => p.id === issue.project_id)
                    .map(project => {
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
        </div>
    );
};

export const IssueListDetails: React.FC<IssueListDetailsProps> = ({ issueArray, Projects, state, setShowModal, enumKey }) => {
    const openArray: Issue[] = [];
    const inProgressArray: Issue[] = [];
    const completedArray: Issue[] = [];
    const canceledArray: Issue[] = [];
    issueArray.forEach(issue => {
        if (issue.status === "open") openArray.push(issue);
        if (issue.status === "in_progress") inProgressArray.push(issue);
        if (issue.status === "completed") completedArray.push(issue);
        if (issue.status === "canceled") canceledArray.push(issue);
    });

    const [listStateOpen, setListStateOpen] = useState<Issue[]>(openArray);
    const [listStateInProgress, setListStateInProgress] = useState<Issue[]>(inProgressArray);
    const [listStateCompleted, setListStateCompleted] = useState<Issue[]>(completedArray);
    const [listStateCanceled, setListStateCanceled] = useState<Issue[]>(canceledArray);

    console.log(listStateCanceled, listStateCompleted, listStateInProgress, listStateOpen);

    return (
        <>
            <ReactSortable list={listStateOpen} setList={setListStateOpen} group="shared-group-name">
                {listStateOpen.map(issue => {
                    return <IssueDetailsTemplate issue={issue} projects={Projects} state={state} setShowModal={setShowModal} enumKey={enumKey} />;
                })}
            </ReactSortable>
            <ReactSortable list={listStateInProgress} setList={setListStateInProgress} group="shared-group-name">
                {listStateInProgress.map(issue => {
                    return <IssueDetailsTemplate issue={issue} projects={Projects} state={state} setShowModal={setShowModal} enumKey={enumKey} />;
                })}
            </ReactSortable>
            <ReactSortable list={listStateCompleted} setList={setListStateCompleted} group="shared-group-name">
                {listStateCompleted.map(issue => {
                    return <IssueDetailsTemplate issue={issue} projects={Projects} state={state} setShowModal={setShowModal} enumKey={enumKey} />;
                })}
            </ReactSortable>
            <ReactSortable list={listStateCanceled} setList={setListStateCanceled} group="shared-group-name">
                {listStateCanceled.map(issue => {
                    return <IssueDetailsTemplate issue={issue} projects={Projects} state={state} setShowModal={setShowModal} enumKey={enumKey} />;
                })}
            </ReactSortable>
        </>
    );
};
