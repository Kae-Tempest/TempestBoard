import { Issue, IssueDetailsTemplateProps, IssueListDetailsProps } from "@/types";
import { IssueIcon, PriorityIcon } from "@/Componants/Icons/IssueIcon";
import { ReactSortable, SortableEvent } from "react-sortablejs";
import React, { forwardRef, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "@inertiajs/react";

const CustomComponent = forwardRef<HTMLDivElement, any>((props, ref) => {
    return <div ref={ref}>{props.children}</div>;
});

const IssueDetailsTemplate: React.FC<IssueDetailsTemplateProps> = ({ issue, projects }) => {
    return (
        <div className="issue-list">
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
    );
};

export const IssueListDetails: React.FC<IssueListDetailsProps> = ({ issueArray, Projects, state, setShowModal, enumKey }) => {
    const { setData, patch, reset } = useForm<{ status: string }>({
        status: "",
    });
    const { openArray, inProgressArray, completedArray, canceledArray } = useMemo(() => {
        return issueArray.reduce(
            (acc, issue) => {
                if (state === "open") acc.openArray.push(issue);
                if (state === "in_progress") acc.inProgressArray.push(issue);
                if (state === "completed") acc.completedArray.push(issue);
                if (state === "canceled") acc.canceledArray.push(issue);
                return acc;
            },
            {
                openArray: [] as Issue[],
                inProgressArray: [] as Issue[],
                completedArray: [] as Issue[],
                canceledArray: [] as Issue[],
            },
        );
    }, [issueArray]);

    const [listStateOpen, setListStateOpen] = useState<Issue[]>(openArray);
    const [listStateInProgress, setListStateInProgress] = useState<Issue[]>(inProgressArray);
    const [listStateCompleted, setListStateCompleted] = useState<Issue[]>(completedArray);
    const [listStateCanceled, setListStateCanceled] = useState<Issue[]>(canceledArray);

    const handleOnAdd = (e: SortableEvent, state: string) => {
        const issueID = e.item.dataset.id;
        let issue = issueArray.find(i => i.id == Number(issueID));
        if (!issue) return;
        if (state === "open") issue.status = "open";
        if (state === "in_progress") issue.status = "in_progress";
        if (state === "completed") issue.status = "completed";
        if (state === "canceled") issue.status = "canceled";
        patch(`/issue/${issueID}`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <div className="issue-header">
                <div>
                    <IssueIcon state={state} /> {enumKey}
                </div>
                <FontAwesomeIcon icon={faPlus} onClick={() => setShowModal(true)} className="issue-add" />
            </div>
            <ReactSortable list={listStateOpen} setList={setListStateOpen} group="group-issue" tag={CustomComponent} onAdd={e => handleOnAdd(e, "open")} onChange={() => setData("status", "open")}>
                {listStateOpen
                    .filter(i => i.status === state)
                    .map(issue => {
                        return (
                            <div key={issue.id}>
                                <IssueDetailsTemplate issue={issue} projects={Projects} state={state} setShowModal={setShowModal} enumKey={enumKey} />
                            </div>
                        );
                    })}
            </ReactSortable>
            <ReactSortable list={listStateInProgress} setList={setListStateInProgress} group="group-issue" onAdd={e => handleOnAdd(e, "in_progress")} onChange={() => setData("status", "in_progress")}>
                {listStateInProgress
                    .filter(i => i.status === state)
                    .map(issue => {
                        return (
                            <div key={issue.id}>
                                <IssueDetailsTemplate issue={issue} projects={Projects} state={state} setShowModal={setShowModal} enumKey={enumKey} />
                            </div>
                        );
                    })}
            </ReactSortable>
            <ReactSortable list={listStateCompleted} setList={setListStateCompleted} group="group-issue" onAdd={e => handleOnAdd(e, "completed")} onChange={() => setData("status", "completed")}>
                {listStateCompleted
                    .filter(i => i.status === state)
                    .map(issue => {
                        return (
                            <div key={issue.id}>
                                <IssueDetailsTemplate issue={issue} projects={Projects} state={state} setShowModal={setShowModal} enumKey={enumKey} />
                            </div>
                        );
                    })}
            </ReactSortable>
            <ReactSortable list={listStateCanceled} setList={setListStateCanceled} group="group-issue" onAdd={e => handleOnAdd(e, "canceled")} onChange={() => setData("status", "canceled")}>
                {listStateCanceled
                    .filter(i => i.status === state)
                    .map(issue => {
                        return (
                            <div key={issue.id}>
                                <IssueDetailsTemplate issue={issue} projects={Projects} state={state} setShowModal={setShowModal} enumKey={enumKey} />
                            </div>
                        );
                    })}
            </ReactSortable>
        </>
    );
};
