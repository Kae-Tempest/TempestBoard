import { Project } from "@/types";
import React, { useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

export const DeleteProjectModal = ({ open, setOpen, project }: { open: boolean; setOpen: Function; project: Project }) => {
    const { delete: destroy } = useForm();
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleCloseModal = (e: any) => {
            if (!modalRef.current?.contains(e.target)) {
                if (open) setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleCloseModal);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        });
        return () => {
            document.addEventListener("mousedown", handleCloseModal);
        };
    }, [open]);

    return (
        <>
            <div className={open ? "modal is-active" : "modal"}>
                <div className="modal-background"></div>
                <div className="modal-content" ref={modalRef}>
                    <div className="box del-box">
                        <h3>Are you sure you want to delete {project.name}?</h3>
                        <div className="btn-action">
                            <button className="cancel" onClick={() => setOpen(false)}>
                                Cancel
                            </button>
                            <button
                                className="del"
                                onClick={() =>
                                    destroy(`/project/${project.id}`, {
                                        onSuccess: () => {
                                            setOpen(false);
                                        },
                                    })
                                }>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const EditProjectModal = ({ open, setOpen, project }: { open: boolean; setOpen: Function; project: Project }) => {
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: "",
        description: "",
        thumbnail: null,
    });

    const handleSetThumb = (e: any) => {
        if (e.target.files) {
            setData("thumbnail", e.target.files[0]);
        } else setData("thumbnail", null);
    };

    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleCloseModal = (e: any) => {
            if (!modalRef.current?.contains(e.target)) {
                if (open) setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleCloseModal);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        });
        return () => {
            document.addEventListener("mousedown", handleCloseModal);
        };
    }, [open]);
    return (
        <div className={open ? "modal is-active" : "modal"}>
            <div className="modal-background"></div>
            <div className="modal-content" ref={modalRef}>
                <div className="box">
                    <h3>Update Project</h3>
                    <form action="/project" method="post">
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input className="input" type="text" name="name" value={data.name} onChange={e => setData("name", e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Description</label>
                            <div className="control">
                                <textarea className="textarea" name="description" value={data.description} onChange={e => setData("description", e.target.value)}></textarea>
                            </div>
                        </div>
                        <div className="field">
                            <div className="file is-small">
                                <label className="file-label">
                                    <input className="file-input" type="file" name="resume" onChange={e => handleSetThumb(e)} />
                                    <span className="file-cta">
                                        <span className="file-icon">
                                            <FontAwesomeIcon icon={faUpload} />
                                        </span>
                                        <span className="file-label">Thumbnail..</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="field field-btn">
                            <div className="control">
                                <button className="button btn-danger" onClick={() => reset()}>
                                    Cancel
                                </button>
                                <button
                                    className="button btn-create"
                                    onClick={() =>
                                        patch(`/project/${project.id}`, {
                                            onSuccess: () => {
                                                reset();
                                                setOpen(false);
                                            },
                                            onError: err => console.log(err),
                                        })
                                    }
                                    disabled={processing}>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const CreateProjectModal = ({ open, setOpen }: { open: boolean; setOpen: Function }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        thumbnail: null,
    });

    const handleSetThumb = (e: any) => {
        if (e.target.files) {
            setData("thumbnail", e.target.files[0]);
        } else setData("thumbnail", null);
    };

    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleCloseModal = (e: any) => {
            if (!modalRef.current?.contains(e.target)) {
                if (open) setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleCloseModal);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        });
        return () => {
            document.addEventListener("mousedown", handleCloseModal);
        };
    }, [open]);
    return (
        <div className={open ? "modal is-active" : "modal"}>
            <div className="modal-background"></div>
            <div className="modal-content" ref={modalRef}>
                <div className="box">
                    <h3>Create Project</h3>
                    <form action="/project" method="post">
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input className="input" type="text" name="name" value={data.name} onChange={e => setData("name", e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Description</label>
                            <div className="control">
                                <textarea className="textarea" name="description" value={data.description} onChange={e => setData("description", e.target.value)}></textarea>
                            </div>
                        </div>
                        <div className="field">
                            <div className="file is-small">
                                <label className="file-label">
                                    <input className="file-input" type="file" name="resume" onChange={e => handleSetThumb(e)} />
                                    <span className="file-cta">
                                        <span className="file-icon">
                                            <FontAwesomeIcon icon={faUpload} />
                                        </span>
                                        <span className="file-label">Thumbnail..</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="field field-btn">
                            <div className="control">
                                <button className="button btn-danger" onClick={() => reset()}>
                                    Cancel
                                </button>
                                <button
                                    className="button btn-create"
                                    onClick={() =>
                                        post("/project", {
                                            onSuccess: () => {
                                                reset();
                                                setOpen(false);
                                            },
                                            onError: err => console.log(err),
                                        })
                                    }
                                    disabled={processing}>
                                    Create
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
