import NavBar from "@/Componants/NavBar";
import { Issue, MyIssuesProps } from "@/types";
import { issueStateEnum } from "@/enums/global";
import { IssueList } from "@/Componants/Issue/IssueList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Head } from "@inertiajs/react";

function mergeIssuesWithoutDuplicates(arr1: Issue[], arr2: Issue[]): Issue[] {
    const mergedArray = arr1.concat(arr2);
    const uniqueMap = new Map<number, Issue>();
    mergedArray.forEach(issue => {
        uniqueMap.set(issue.id, issue);
    });
    return Array.from(uniqueMap.values()).sort((a, b) => a.id - b.id);
}

export default function ({ CreateIssues, AssignedIssues, Projects, User }: MyIssuesProps) {
    const issueArray = mergeIssuesWithoutDuplicates(CreateIssues, AssignedIssues);
    const [viewMode, setViewMode] = useState<string>("list");
    const [typeView, setTypeView] = useState<string>("all");
    const viewTitle = typeView.charAt(0).toUpperCase() + typeView.slice(1);
    return (
        <div id="my_issue">
            <Head title="My Issues" />
            <NavBar projects={Projects} user={User} />
            <div className="content">
                <div className="header">
                    <nav className="breadcrumb is-medium" aria-label="breadcrumbs">
                        <ul>
                            <li>
                                <div>My Issue</div>
                            </li>
                            <li className="is-active">
                                <div aria-current="page">{viewTitle}</div>
                            </li>
                        </ul>
                    </nav>
                    <div className="tabs is-toggle is-small">
                        <ul>
                            <li className={viewMode === "list" ? "is-active" : ""} onClick={() => setViewMode("list")}>
                                <a>
                                    <FontAwesomeIcon icon={faBars} />
                                </a>
                            </li>
                            <li className={viewMode === "kaban" ? "is-active" : ""} onClick={() => setViewMode("kaban")}>
                                <a>
                                    <FontAwesomeIcon icon={faGripVertical} />
                                </a>
                            </li>
                            <li className={viewMode === "details" ? "is-active" : ""} onClick={() => setViewMode("details")}>
                                <a>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="#457b9d" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="2.5" cy="4.5" r="1.5" />
                                        <circle cx="2.5" cy="8.5" r="1.5" />
                                        <circle cx="2.5" cy="12.5" r="1.5" />
                                        <rect x="6" y="3" width="11" height="11" rx="1" />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="typeview-tabs">
                    <div className="tabs is-toggle">
                        <ul>
                            <li className={typeView === "all" ? "is-active" : ""} onClick={() => setTypeView("all")}>
                                <a>All</a>
                            </li>
                            <li className={typeView === "created" ? "is-active" : ""} onClick={() => setTypeView("created")}>
                                <a>Created</a>
                            </li>
                            <li className={typeView === "assigned" ? "is-active" : ""} onClick={() => setTypeView("assigned")}>
                                <a>Assigned</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="issues">
                    {Object.values(issueStateEnum).map(state => {
                        return (
                            <div key={self.crypto.randomUUID()}>
                                <IssueList issueArray={issueArray} Projects={Projects} state={state} assignedIssue={AssignedIssues} createdIssue={CreateIssues} typeView={typeView} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
