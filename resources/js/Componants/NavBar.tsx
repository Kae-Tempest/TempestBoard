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
                <nav className="h-screen flex flex-col text-Tertiary">
                    <div className="flex justify-between items-center mt-4 mb-7 mx-4">
                        <img
                            src="https://placehold.co/30"
                            alt=""
                            className="rounded"
                        />
                        <h1 className="mx-2 font-black">Tempest Board</h1>
                        <img
                            src="https://placehold.co/30"
                            alt="logo"
                            className="rounded-full border border-Quaternary"
                        />
                    </div>
                    <div className="mx-2 flex justify-between gap-2 text-TextColor">
                        <button className="w-full text-left bg-Tertiary flex items-center px-2 rounded-sm">
                            <FontAwesomeIcon icon={faPenToSquare} />
                            New Issue
                        </button>
                        <button className="bg-Tertiary px-2 rounded-sm">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                    <div className="flex flex-col items-center my-5">
                        <Link
                            href="#"
                            className="py-2 px-9 hover:bg-Secondary/50 w-full"
                        >
                            My Issues
                        </Link>
                        {/* Project map*/}
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="py-2 px-9 hover:bg-Secondary/50 w-full text-left">
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
                                    <Disclosure.Panel className="py-2 px-14 hover:bg-Secondary/50 w-full">
                                        test
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                        <Link
                            href="#"
                            className="py-2 px-9 hover:bg-Secondary/50 w-full"
                        >
                            Roadmap
                        </Link>
                        <Link
                            href="#"
                            className="py-2 px-9 hover:bg-Secondary/50 w-full"
                        >
                            Dashboard
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
}
