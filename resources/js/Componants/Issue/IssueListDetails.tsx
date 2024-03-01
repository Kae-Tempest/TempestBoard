import { Issue, IssueDetailsTemplateProps, IssueListDetailsProps, IssueListDraggableProps } from "@/types";
import { IssueIcon, PriorityIcon } from "@/Componants/Icons/IssueIcon";
import { ReactSortable, SortableEvent } from "react-sortablejs";
import React, { forwardRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "@inertiajs/react";
import IssueModal from "@/Componants/Modals/IssueModal";

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
                                    {project.name.substring(0, 3).toUpperCase()}-{issue.ticket_id}
                                </div>
                                <div className="title-issue">{issue.title}</div>
                            </div>
                            <div className="project-content">
                                <div className="tag">{project.name}</div>
                                <div>{issue.created_at}</div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

const IssueListDraggable: React.FC<IssueListDraggableProps> = ({ issueArray, Projects, status, handleOnAdd, setData }) => {
    const [list, setlist] = useState<Issue[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    useEffect(() => {
        setlist(issueArray);
    }, [issueArray]);

    return (
        <React.Fragment>
            <IssueModal projects={Projects} setShowModal={setShowModal} showModal={showModal} state={status} />
            <div className="issue-header">
                <div>
                    <IssueIcon state={status} /> {status.toUpperCase()}
                </div>
                <FontAwesomeIcon icon={faPlus} onClick={() => setShowModal(true)} className="issue-add" />
            </div>
            <ReactSortable list={list} setList={setlist} group="group-issue" tag={CustomComponent} onAdd={e => handleOnAdd(e, status)} onChange={() => setData("status", status)}>
                {list.map((issue, index) => {
                    return (
                        <div key={index}>
                            <IssueDetailsTemplate issue={issue} projects={Projects} />
                        </div>
                    );
                })}
            </ReactSortable>
        </React.Fragment>
    );
};

export const IssueListDetails: React.FC<IssueListDetailsProps> = ({ issueArray, Projects }) => {
    const { setData, patch, reset } = useForm<{ status: string }>({
        status: "",
    });
    const stateArray = ["open", "in_progress", "completed", "canceled"];
    const handleOnAdd = (e: SortableEvent, state: string) => {
        const issueID = e.item.dataset.id;
        let issue = issueArray.find(i => i.id == Number(issueID));
        if (!issue) return;
        issue.status = state;
        patch(`/issue/${issueID}`, {
            onSuccess: () => reset(),
        });
    };

    return stateArray.map((status, index) => {
        return <IssueListDraggable issueArray={issueArray.filter(i => i.status === status)} Projects={Projects} status={status} setData={setData} handleOnAdd={handleOnAdd} key={index} />;
    });
};
