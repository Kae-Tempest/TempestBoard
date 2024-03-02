import { Project, ProjectProps } from "@/types";
import { Head } from "@inertiajs/react";
import NavBar from "@/Componants/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { CreateProjectModal, DeleteProjectModal, EditProjectModal } from "@/Componants/Modals/ProjectModal";

export default function ({ projects, user }: ProjectProps) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [OpenCreateModal, setOpenCreateModal] = useState(false);
    const [modalProject, setModalProject] = useState({} as Project);
    const [editProject, setEditProject] = useState({} as Project);

    const handleOpenDeleteModal = (project: Project) => {
        setModalProject(project);
        setOpenDeleteModal(true);
    };

    const handleOpenEditModal = (project: Project) => {
        setEditProject(project);
        setOpenEditModal(true);
    };

    return (
        <div id="project">
            <Head title="Projects" />
            <NavBar projects={projects} user={user} />
            <header>
                <nav className="breadcrumb is-medium" aria-label="breadcrumbs">
                    <ul>
                        <li>Projects</li>
                    </ul>
                </nav>
                <button className="add-project" onClick={() => setOpenCreateModal(true)}>
                    New Project
                </button>
            </header>
            <div className="content">
                <div>
                    <DeleteProjectModal open={openDeleteModal} setOpen={setOpenDeleteModal} project={modalProject} />
                    <CreateProjectModal open={OpenCreateModal} setOpen={setOpenCreateModal} />
                    <EditProjectModal open={openEditModal} setOpen={setOpenEditModal} project={editProject} />
                    {projects.map(project => (
                        <React.Fragment key={project.id}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="media">
                                        <div className="media-left">{project.thumbnail && <img src={project.thumbnail} alt="Placeholder image" />}</div>
                                        <div className="media-content">
                                            <h2>{project.name}</h2>
                                        </div>
                                    </div>
                                    <div className="content">
                                        <p className="">{project.description}</p>
                                        <div className="content-footer">
                                            <div className="btn-action">
                                                <button className="del" onClick={() => handleOpenDeleteModal(project)}>
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </button>
                                                <button className="edit" onClick={() => handleOpenEditModal(project)}>
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>
                                            </div>
                                            <div className="date">
                                                <time dateTime="2016-1-1">Created: {project.created_at}</time>
                                                <time dateTime="2016-1-1">Updated: {project.updated_at}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
