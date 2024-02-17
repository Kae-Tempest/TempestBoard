import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faMagnifyingGlass,
    faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@inertiajs/react";
import { Disclosure, Popover } from "@headlessui/react";
import { NavBarProps, Project } from "@/types";

export default function ({ projects, user }: NavBarProps) {
    return (
        <>
            <div className="fixed lg:w-64 lg:min-w-64 w-0 bg-Primary">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mt-4 mb-7 mx-4">
                        <img
                            src="https://placehold.co/30"
                            alt=""
                            className="rounded"
                        />
                        <h1 className="mx-2 font-black text-Tertiary">
                            Tempest Board
                        </h1>
                        <Popover className="relative">
                            <Popover.Button>
                                <img
                                    src={user.thumbnail}
                                    alt="user thumbnail"
                                    className="rounded-full border border-Quaternary w-[1.875rem] h-[1.875rem]"
                                />
                            </Popover.Button>
                            <Popover.Panel className="absolute z-10 bg-Primary border border-Quaternary text-Tertiary rounded">
                                <ul className="flex flex-col">
                                    <li className="py-1 px-6 hover:bg-Secondary/50 w-full">
                                        <Link href="#">Profile</Link>
                                    </li>
                                    <li className="py-1 px-6 hover:bg-Secondary/50 w-full">
                                        <Link href="#">Settings</Link>
                                    </li>
                                    <li className="py-1 px-6 hover:bg-Secondary/50 w-full">
                                        <Link
                                            method="post"
                                            href={route("logout")}
                                            as={"button"}
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </Popover.Panel>
                        </Popover>
                    </div>
                    <div className="mx-2 flex justify-between gap-2 text-TextColor">
                        <button className="w-full text-left bg-Tertiary flex items-center px-2 rounded-sm">
                            <FontAwesomeIcon
                                icon={faPenToSquare}
                                className="px-2 items-center"
                            />
                            New Issue
                        </button>
                        <button className="bg-Tertiary px-2 rounded-sm">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                </div>
                <nav className="h-screen flex flex-col text-Tertiary">
                    <ul className="flex flex-col my-5 w-full">
                        <li className="w-full hover:bg-Secondary/50 py-1 px-9">
                            <Link href="#">My Issues</Link>
                        </li>
                        {/* Project map*/}

                        {projects.map((project: Project) => {
                            return (
                                <li>
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

                        <li className="py-1 px-9 hover:bg-Secondary/50 w-full">
                            <Link href="#">Roadmap</Link>
                        </li>
                        <li className="py-1 px-9 hover:bg-Secondary/50 w-full">
                            <Link href="#">Dashboard</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}
