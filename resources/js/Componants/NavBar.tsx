import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { faChevronRight, faMagnifyingGlass, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { NavBarProps, Project } from "@/types";
import IssueModal from "@/Componants/Issue/IssueModal";

export default function ({ projects, user }: NavBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handlerCloseDropDown = (e: any) => {
            if (!dropDownRef.current?.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handlerCloseDropDown);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                setIsDropdownOpen(false);
                setShowModal(false);
            }
        });

        return () => {
            document.addEventListener("mousedown", handlerCloseDropDown);
        };
    }, []);

    return (
        <>
            <IssueModal projects={projects} showModal={showModal} setShowModal={setShowModal} />
            <div id="navbar">
                <div>
                    <div>
                        <img src="https://placehold.co/30" alt="" />
                        <h1>Tempest Board</h1>
                        <div className={isDropdownOpen ? "dropdown is-active is-right" : "dropdown is-right"} ref={dropDownRef}>
                            <div className="dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <img src={user.thumbnail} alt="user thumbnail" aria-haspopup="true" aria-controls="user-menu" className="dropdown-thumbnail" />
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
                        <li className="is-active">
                            <Link href="#">My Issues</Link>
                        </li>
                        {projects.map((project: Project) => {
                            return (
                                <li key={project.id}>
                                    <div className="menu is-menu">
                                        <div className="menu-list">
                                            <div className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                                <span className="">{project.name}</span>
                                                <FontAwesomeIcon icon={faChevronRight} className={isMenuOpen ? "is-menu-open" : ""} />
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
