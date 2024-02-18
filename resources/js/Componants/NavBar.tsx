import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faMagnifyingGlass,
    faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@inertiajs/react";
import { Disclosure } from "@headlessui/react";
import { NavBarProps, Project } from "@/types";

export default function ({ projects, user }: NavBarProps) {
    return (
        <>
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
                            <div
                                className="dropdown-menu"
                                id="user-menu"
                                role="menu"
                            >
                                <div className="dropdown-content">
                                    <ul>
                                        <li>
                                            <Link href="#">Profile</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Settings</Link>
                                        </li>
                                        <li>
                                            <Link
                                                method="post"
                                                href={route("logout")}
                                                as={"button"}
                                            >
                                                Logout
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="button-container">
                        <button>
                            <FontAwesomeIcon icon={faPenToSquare} />
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
                                    <Disclosure>
                                        {({ open }) => (
                                            <div className="w-full">
                                                <Disclosure.Button className="py-1 px-9 hover:bg-Secondary/50 w-full text-left">
                                                    <span className="pr-2">
                                                        {project.name}
                                                    </span>
                                                    <FontAwesomeIcon
                                                        icon={faChevronRight}
                                                        className={
                                                            open
                                                                ? "rotate-90 transform"
                                                                : ""
                                                        }
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="py-1 pl-10">
                                                    <ul>
                                                        <li className="py-1 pl-6 w-full">
                                                            <span>Issues</span>
                                                            <ul className="border-l border-dashed border-Tertiary">
                                                                <li className="py-1 px-6 hover:bg-Secondary/50 w-full">
                                                                    <Link href="#">
                                                                        Active
                                                                    </Link>
                                                                </li>
                                                                <li className="py-1 px-6 hover:bg-Secondary/50 w-full">
                                                                    <Link href="#">
                                                                        Backlog
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="py-1 px-6 hover:bg-Secondary/50 w-full">
                                                            <Link href="#">
                                                                Releases
                                                            </Link>
                                                        </li>
                                                        <li className="py-1 px-6 hover:bg-Secondary/50 w-full">
                                                            <span>Repos</span>
                                                            <ul className="border-l border-dashed border-Tertiary">
                                                                <li className="py-1 px-6 hover:bg-Secondary/50 w-full">
                                                                    <Link href="#">
                                                                        Pull
                                                                        Requests
                                                                    </Link>
                                                                </li>
                                                                <li className="py-1 px-6 hover:bg-Secondary/50 w-full">
                                                                    <Link href="#">
                                                                        Issues
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>
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
