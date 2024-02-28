import { ProjectProps } from "@/types";
import { Head } from "@inertiajs/react";
import NavBar from "@/Componants/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function ({ projects, user }: ProjectProps) {
    return (
        <div id="project">
            <Head title="Projects" />
            <NavBar projects={projects} user={user} />
            <div className="content">
                <div>
                    {projects.map(project => (
                        <div className="card" key={project.id}>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-left">
                                        <img src={project.thumbnail} alt="Placeholder image" />
                                    </div>
                                    <div className="media-content">
                                        <h2>{project.name}</h2>
                                    </div>
                                </div>
                                <div className="content">
                                    <p className="">{project.description}</p>
                                    <div className="content-footer">
                                        <div className="btn-action">
                                            <button className="del">
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </button>
                                            <button className="edit">
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                        </div>
                                        <div className="date">
                                            <time dateTime="2016-1-1">Created : {project.created_at}</time>
                                            <time dateTime="2016-1-1">Updated :{project.updated_at}</time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
