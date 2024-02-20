import NavBar from "@/Componants/NavBar";
import { MyIssuesProps } from "@/types";

export default function ({ CreateIssues, AssignedIssues, Projects, User }: MyIssuesProps) {
    return (
        <div id="my_issue">
            <NavBar projects={Projects} user={User} />
            <div className="content">
                <div>
                    {CreateIssues.map(issue => {
                        return (
                            <div key={issue.id}>
                                <div>N° : {issue.id}</div>
                                <div>Title :{issue.title}</div>
                                <div>Description : {issue.description}</div>
                            </div>
                        );
                    })}
                </div>
                <div>
                    {AssignedIssues.map(issue => {
                        return (
                            <div key={issue.id}>
                                <div>N° : {issue.id}</div>
                                <div>Title : {issue.title}</div>
                                <div>Description : {issue.description}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
