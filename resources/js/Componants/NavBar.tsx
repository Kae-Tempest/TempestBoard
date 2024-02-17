import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faMagnifyingGlass,
    faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@inertiajs/react";
import { Disclosure } from "@headlessui/react";

export default function () {
    return (
        <>
            <div className="fixed lg:w-[max(0px,16rem)] lg:min-w-[16rem] w-0 bg-Primary">
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
                        <img
                            src="https://placehold.co/30"
                            alt="logo"
                            className="rounded-full border border-Quaternary"
                        />
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
                        <li>
                            <Disclosure>
                                {({ open }) => (
                                    <div className="w-full">
                                        <Disclosure.Button className="py-1 px-9 hover:bg-Secondary/50 w-full text-left">
                                            <span className="pr-2">
                                                Project Name
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
                                                                Pull Requests
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
