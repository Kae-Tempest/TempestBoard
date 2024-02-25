import { CustomPriority } from "@/Componants/Icons/Priority";
import { IssueModalProps, Project } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faChevronDown, faCircleExclamation, faMinus, faPause } from "@fortawesome/free-solid-svg-icons";
import { priorityEnum } from "@/enums/global";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { CanceledIssueIcon, CompletedIssueIcon, InProgressIssueIcon, OpenIssueIcon } from "@/Componants/Icons/StateIcon";

export default function ({ projects, showModal, setShowModal, state }: IssueModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: 0,
        title: "",
        description: "",
        priority: "NEUTRAL",
        status: "open",
    });
    const [count, setCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [htmlPriority, setHtmlPriority] = useState<React.ReactNode | null>(null);
    const [htmlState, setHtmlState] = useState<React.ReactNode | null>(null);
    const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
    const handleSetPriority = (priorityValue: string, iconName: IconProp) => {
        const PE = Object.keys(priorityEnum).filter(v => v === priorityValue)[0];
        if (data.priority === priorityValue) {
            setHtmlPriority(null);
            setData("priority", "NEUTRAL");
            setDropdownOpen(false);
            return;
        }
        setHtmlPriority(<CustomPriority label={PE} iconName={iconName} />);
        setData("priority", priorityValue);
        setDropdownOpen(false);
    };
    const handleSetState = (stateValue: string, iconComponant: React.ReactNode) => {
        if (data.status === stateValue && stateDropdownOpen) {
            setHtmlState(null);
            setData("status", "open");
            setStateDropdownOpen(false);
            return;
        }
        setHtmlState(iconComponant);
        setData("status", stateValue);
        setStateDropdownOpen(false);
    };
    const handleCancel = () => {
        reset();
        setHtmlPriority(null);
        setProjectName("");
        setShowModal(false);
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

    const modalRef = useRef<HTMLDivElement>(null);
    const priorityDPRef = useRef<HTMLDivElement>(null);
    const projectDPRef = useRef<HTMLDivElement>(null);
    const stateDPRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        switch (state) {
            case "open":
                handleSetState(
                    "open",
                    <div className="dropdown-icon">
                        Open <OpenIssueIcon />
                    </div>,
                );
                break;
            case "in_progress":
                handleSetState(
                    "in_progress",
                    <div className="dropdown-icon">
                        In Progress <InProgressIssueIcon />
                    </div>,
                );
                break;
            case "completed":
                handleSetState(
                    "completed",
                    <div className="dropdown-icon">
                        Completed <CompletedIssueIcon />
                    </div>,
                );
                break;
            case "canceled":
                handleSetState(
                    "canceled",
                    <div className="dropdown-icon">
                        Canceled <CanceledIssueIcon />
                    </div>,
                );
                break;
            default:
                break;
        }
        const handlerCloseModal = (e: any) => {
            if (!modalRef.current?.contains(e.target)) {
                if (showModal) handleCancel();
            }
            if (!priorityDPRef.current?.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (!projectDPRef.current?.contains(e.target)) {
                setProjectDropdownOpen(false);
            }
            if (!stateDPRef.current?.contains(e.target)) {
                setStateDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handlerCloseModal);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                setShowModal(false);
            }
        });
        if (errors.title || errors.description) setShowModal(true);
        return () => {
            document.addEventListener("mousedown", handlerCloseModal);
            reset();
        };
    }, [errors, showModal]);

    return (
        <div className={showModal ? "modal is-active" : "modal"}>
            <div className="modal-background"></div>
            <div className="modal-card" ref={modalRef}>
                <header className="modal-card-head">
                    <p className="modal-card-title">Create Issue</p>
                    <button className="delete" aria-label="close" onClick={() => setShowModal(false)}></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <div className="control">
                            <input className="input" type="text" placeholder="Issue Title" maxLength={100} minLength={3} value={data.title} onChange={e => setData("title", e.target.value)} />
                            {errors.title && <p className="help is-danger">{errors.title}</p>}
                            <textarea
                                className="textarea has-fixed-size"
                                placeholder="Issue Description"
                                maxLength={500}
                                minLength={3}
                                value={data.description}
                                onInput={e => {
                                    setCount(500 - (e.target as any).value.length);
                                }}
                                onChange={e => setData("description", e.target.value)}></textarea>
                            {errors.description && <p className="help is-danger">{errors.description}</p>}
                            <div className="count">{count != 0 ? count : "500"}/500</div>
                            <div className={dropdownOpen ? "dropdown is-active" : "dropdown"} ref={priorityDPRef}>
                                <div className="dropdown-trigger">
                                    <button className="button" aria-haspopup="true" aria-controls="dropdown-priority" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                                        <div className="dropdown-item" onClick={() => handleSetPriority("URGENT", faCircleExclamation)}>
                                            <CustomPriority label="URGENT" iconName={faCircleExclamation} />
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSetPriority("HIGH", faAnglesUp)}>
                                            <CustomPriority label="HIGH" iconName={faAnglesUp} />
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSetPriority("NEUTRAL", faPause)}>
                                            <CustomPriority label="NEUTRAL" iconName={faPause} rotate={90} />
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSetPriority("LOW", faMinus)}>
                                            <CustomPriority label="LOW" iconName={faMinus} />
                                        </div>
                                        <div className="dropdown-item" onClick={() => handleSetPriority("MINOR", faChevronDown)}>
                                            <CustomPriority label="MINOR" iconName={faChevronDown} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={projectDropdownOpen ? "dropdown is-active" : "dropdown"} ref={projectDPRef}>
                                <div className="dropdown-trigger">
                                    <button className="button" aria-haspopup="true" aria-controls="dropdown-project" onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}>
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
                            <div className={stateDropdownOpen ? "dropdown is-active" : "dropdown"} ref={stateDPRef}>
                                <div className="dropdown-trigger">
                                    <button className="button" aria-haspopup="true" aria-controls="dropdown-state" onClick={() => setStateDropdownOpen(!projectDropdownOpen)}>
                                        {htmlState ? (
                                            htmlState
                                        ) : (
                                            <>
                                                <span>State</span>
                                                <span className="icon">
                                                    <FontAwesomeIcon icon={faChevronDown} />
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="dropdown-menu" id="dropdown-project" role="menu">
                                    <div className="dropdown-content">
                                        <div
                                            className="dropdown-item dropdown-icon"
                                            onClick={() =>
                                                handleSetState(
                                                    "open",
                                                    <div className="dropdown-icon">
                                                        Open <OpenIssueIcon />
                                                    </div>,
                                                )
                                            }>
                                            Open
                                            <OpenIssueIcon />
                                        </div>
                                        <div
                                            className="dropdown-item dropdown-icon"
                                            onClick={() =>
                                                handleSetState(
                                                    "in_progress",
                                                    <div className="dropdown-icon">
                                                        In Progress <InProgressIssueIcon />
                                                    </div>,
                                                )
                                            }>
                                            In Progress
                                            <InProgressIssueIcon />
                                        </div>
                                        <div
                                            className="dropdown-item dropdown-icon"
                                            onClick={() =>
                                                handleSetState(
                                                    "completed",
                                                    <div className="dropdown-icon">
                                                        Completed <CompletedIssueIcon />
                                                    </div>,
                                                )
                                            }>
                                            Completed
                                            <CompletedIssueIcon />
                                        </div>
                                        <div
                                            className="dropdown-item dropdown-icon"
                                            onClick={() =>
                                                handleSetState(
                                                    "canceled",
                                                    <div className="dropdown-icon">
                                                        Canceled <CanceledIssueIcon />
                                                    </div>,
                                                )
                                            }>
                                            Canceled
                                            <CanceledIssueIcon />
                                        </div>
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
                            if (errors.title || errors.description) {
                                setShowModal(true);
                            }
                            post("/issue", {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setShowModal(false);
                                    reset();
                                },
                            });
                        }}
                        disabled={processing}>
                        Create
                    </button>
                    <button className="button btn-error" onClick={() => handleCancel()}>
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    );
}
