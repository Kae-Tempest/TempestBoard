import NavBar from "@/Componants/NavBar";
import { MyIssuesProps } from "@/types";

export default function ({
    CreateIssues,
    AssignedIssues,
    Projects,
    User,
}: MyIssuesProps) {
    return (
        <div className="w-full">
            <NavBar projects={Projects} user={User} />
            <div className="lg:pl-64">
                <div className="bg-blue-300">
                    {CreateIssues.map((issue) => {
                        return (
                            <div>
                                <div>N° : {issue.id}</div>
                                <div>Title :{issue.title}</div>
                                <div>Description : {issue.description}</div>
                            </div>
                        );
                    })}
                </div>
                <div className="bg-red-300">
                    {AssignedIssues.map((issue) => {
                        return (
                            <div>
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
