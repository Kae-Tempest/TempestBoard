import { HighPriority, LowPriority, MinorPriority, NeutralPriority, UrgentPriority } from "@/Componants/Priority";
import { IssueModalProps, Project } from "@/types";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { priorityEnum } from "@/enums/global";

export default function ({ projects, showModal, setShowModal }: IssueModalProps) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: 0,
        title: "",
        description: "",
        priority: "NEUTRAL",
    });
    const [count, setCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [htmlPriority, setHtmlPriority] = useState<React.ReactNode | null>(null);
    const [priority, setPriority] = useState<string>("");
    const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const handleSetPriority = (priorityValue: string) => {
        const PE = Object.keys(priorityEnum).filter(v => v === priorityValue)[0];
        if (priority === priorityValue) {
            setHtmlPriority(null);
            setPriority("");
            setDropdownOpen(false);
            return;
        }

        if (PE === priorityEnum.MINOR) setHtmlPriority(<MinorPriority />);
        if (PE === priorityEnum.LOW) setHtmlPriority(<LowPriority />);
        if (PE === priorityEnum.NEUTRAL) setHtmlPriority(<NeutralPriority />);
        if (PE === priorityEnum.HIGH) setHtmlPriority(<HighPriority />);
        if (PE === priorityEnum.URGENT) setHtmlPriority(<UrgentPriority />);

        setPriority(priorityValue);
        setDropdownOpen(false);
    };

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

    return (
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
                            {errors.title && <p className="help is-danger">{errors.title}</p>}
                            <textarea
                                className="textarea has-fixed-size"
                                placeholder="Issue Description"
                                maxLength={500}
                                minLength={3}
                                onInput={e => {
                                    setCount(500 - (e.target as any).value.length);
                                }}
                                onChange={e => setData("description", e.target.value)}></textarea>
                            {errors.description && <p className="help is-danger">{errors.description}</p>}
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
                                        <div className="dropdown-item" onClick={() => handleSetPriority("URGENT")}>
                                            <UrgentPriority />
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSetPriority("HIGH")}>
                                            <HighPriority />
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSetPriority("NEUTRAL")}>
                                            <NeutralPriority />
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSetPriority("LOW")}>
                                            <LowPriority />
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSetPriority("MINOR")}>
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
                                        {errors.project_id ? (
                                            <div>
                                                <span>{errors.project_id}</span>
                                            </div>
                                        ) : (
                                            <>
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
                                            </>
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
                            if (!errors.title && !errors.description && !errors.project_id) setShowModal(false);
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
    );
}
