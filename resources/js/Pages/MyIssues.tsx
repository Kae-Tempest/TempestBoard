import NavBar from "@/Componants/NavBar";
import { Issue, MyIssuesProps } from "@/types";
import { issueStateEnum } from "@/enums/global";
import { IssueList } from "@/Componants/IssueList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGripVertical } from "@fortawesome/free-solid-svg-icons";
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
                                <div aria-current="page">All</div>
                            </li>
                        </ul>
                    </nav>
                    <div className="tabs is-toggle is-small">
                        <ul>
                            <li className="is-active">
                                <a>
                                    <FontAwesomeIcon icon={faBars} />
                                </a>
                            </li>
                            <li>
                                <a>
                                    <FontAwesomeIcon icon={faGripVertical} />
                                </a>
                            </li>
                            <li>
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
                <div className="issues">
                    {Object.values(issueStateEnum).map(state => {
                        return (
                            <div key={self.crypto.randomUUID()}>
                                <IssueList issueArray={issueArray} Projects={Projects} state={state} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
