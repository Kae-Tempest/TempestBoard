import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { faChevronDown, faChevronRight, faMagnifyingGlass, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { NavBarProps, Project } from "@/types";
import { HighPriority, LowPriority, MinorPriority, NeutralPriority, UrgentPriority } from "./Priority";
import { priorityEnum } from "@/enums/global";

export default function ({ projects, user }: NavBarProps) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: 0,
        title: "",
        description: "",
        priority: "NEUTRAL",
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [count, setCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [htmlPriority, setHtmlPriority] = useState<React.ReactNode | null>(null);
    const [priority, setPriority] = useState<number | undefined>(undefined);
    const handleSetProject = (projectId: number, projectNameParams: string) => {
        if (projectName == projectNameParams && projectId == data.project_id) {
            setProjectName("");
            setData("project_id", 0);
            setProjectDropdownOpen(false);
            return;
        }
        setProjectName(projectNameParams);
        setData("project_id", projectId);
        setProjectDropdownOpen(false);
    };
    const handleSetPriority = (priorityValue: number) => {
        const PE = Object.keys(priorityEnum).filter(v => isNaN(Number(v)));
        if (priority === priorityValue) {
            setHtmlPriority(null);
            setPriority(undefined);
            setDropdownOpen(false);
            return;
        }
        PE.forEach(key => {
            switch (key) {
                case "MINOR":
                    if (priorityValue === 0) {
                        setHtmlPriority(<MinorPriority />);
                        setPriority(priorityValue);
                        setData("priority", "MINOR");
                    }
                    break;
                case "LOW":
                    if (priorityValue === 1) {
                        setHtmlPriority(<LowPriority />);
                        setPriority(priorityValue);
                        setData("priority", "LOW");
                    }
                    break;
                case "NEUTRAL":
                    if (priorityValue === 2) {
                        setHtmlPriority(<NeutralPriority />);
                        setPriority(priorityValue);
                        setData("priority", "NEUTRAL");
                    }
                    break;
                case "HIGH":
                    if (priorityValue === 3) {
                        setHtmlPriority(<HighPriority />);
                        setPriority(priorityValue);
                        setData("priority", "HIGH");
                    }
                    break;
                case "URGENT":
                    if (priorityValue === 4) {
                        setHtmlPriority(<UrgentPriority />);
                        setPriority(priorityValue);
                        setData("priority", "URGENT");
                    }
                    break;
            }
        });
        setDropdownOpen(false);
    };

    return (
        <>
            <div className={showModal ? "modal is-active" : "modal"}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Create Issue</p>
                        <button className="delete" aria-label="close" onClick={() => setShowModal(false)}></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="field">
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Issue Title"
                                    maxLength={100}
                                    minLength={3}
                                    onChange={e => setData("title", e.target.value)}
                                />
                                <textarea
                                    className="textarea has-fixed-size"
                                    placeholder="Issue Description"
                                    maxLength={500}
                                    minLength={3}
                                    onInput={e => {
                                        setCount(500 - (e.target as any).value.length);
                                    }}
                                    onChange={e => setData("description", e.target.value)}></textarea>
                                <div className="count">{count != 0 ? count : "500"}/500</div>
                                <div className={dropdownOpen ? "dropdown is-active" : "dropdown"}>
                                    <div className="dropdown-trigger">
                                        <button
                                            className="button"
                                            aria-haspopup="true"
                                            aria-controls="dropdown-priority"
                                            onClick={() => setDropdownOpen(!dropdownOpen)}>
                                            {htmlPriority ? (
                                                htmlPriority
                                            ) : (
                                                <div>
                                                    <span>Priority</span>
                                                    <span className="icon">
                                                        <FontAwesomeIcon icon={faChevronDown} />
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-priority" role="menu">
                                        <div className="dropdown-content">
                                            <div className="dropdown-item" onClick={() => handleSetPriority(4)}>
                                                <UrgentPriority />
                                            </div>
                                            <div className="dropdown-item" onClick={() => handleSetPriority(3)}>
                                                <HighPriority />
                                            </div>
                                            <div className="dropdown-item" onClick={() => handleSetPriority(2)}>
                                                <NeutralPriority />
                                            </div>
                                            <div className="dropdown-item" onClick={() => handleSetPriority(1)}>
                                                <LowPriority />
                                            </div>
                                            <div className="dropdown-item" onClick={() => handleSetPriority(0)}>
                                                <MinorPriority />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={projectDropdownOpen ? "dropdown is-active" : "dropdown"}>
                                    <div className="dropdown-trigger">
                                        <button
                                            className="button"
                                            aria-haspopup="true"
                                            aria-controls="dropdown-project"
                                            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}>
                                            {projectName ? (
                                                <div>
                                                    <span>{projectName}</span>
                                                    <span className="icon">
                                                        <FontAwesomeIcon icon={faChevronDown} />
                                                    </span>
                                                </div>
                                            ) : (
                                                <div>
                                                    <span>Project</span>
                                                    <span className="icon">
                                                        <FontAwesomeIcon icon={faChevronDown} />
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-project" role="menu">
                                        <div className="dropdown-content">
                                            {projects.map((project: Project) => {
                                                return (
                                                    <div
                                                        className="dropdown-item"
                                                        key={project.id}
                                                        onClick={() => {
                                                            handleSetProject(project.id, project.name);
                                                        }}>
                                                        {project.name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button
                            className="button btn-success"
                            onClick={() => {
                                post("/issue");
                                setShowModal(false);
                            }}
                            disabled={processing}>
                            Create
                        </button>
                        <button className="button btn-error" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                    </footer>
                </div>
            </div>
            <div id="navbar">
                <div>
                    <div>
                        <img src="https://placehold.co/30" alt="" />
                        <h1>Tempest Board</h1>
                        <div className="dropdown is-hoverable is-right">
                            <div className="dopdown-trigger">
                                <img
                                    src={user.thumbnail}
                                    alt="user thumbnail"
                                    aria-haspopup="true"
                                    aria-controls="user-menu"
                                />
                            </div>
                            <div className="dropdown-menu" id="user-menu" role="menu">
                                <div className="dropdown-content">
                                    <ul>
                                        <li>
                                            <Link href="#">Profile</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Settings</Link>
                                        </li>
                                        <li>
                                            <Link method="post" href={route("logout")} as={"button"}>
                                                Logout
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="button-container">
                        <button onClick={() => setShowModal(true)}>
                            <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                            New Issue
                        </button>
                        <button>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                </div>

                <nav>
                    <ul>
                        <li>
                            <Link href="#">My Issues</Link>
                        </li>
                        {projects.map((project: Project) => {
                            return (
                                <li key={project.id}>
                                    <div className="menu is-menu">
                                        <div className="menu-list">
                                            <div className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                                <span className="">{project.name}</span>
                                                <FontAwesomeIcon
                                                    icon={faChevronRight}
                                                    className={isMenuOpen ? "is-menu-open" : ""}
                                                />
                                            </div>
                                            <div className={isMenuOpen ? "is-menu-list" : "is-menu-list is-menu-close"}>
                                                <ul className="menu-list">
                                                    <li>
                                                        <span>Issues</span>
                                                        <ul>
                                                            <li>
                                                                <Link href="#">Active</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Backlog</Link>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <Link href="#">Releases</Link>
                                                    </li>
                                                    <li>
                                                        <span>Repos</span>
                                                        <ul>
                                                            <li>
                                                                <Link href="#">Pull Requests</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Issues</Link>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}

                        <li>
                            <Link href="#">Roadmap</Link>
                        </li>
                        <li>
                            <Link href="#">Dashboard</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}
