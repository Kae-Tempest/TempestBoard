import { Head, Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { FormEventHandler, useEffect } from "react";

export default function () {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);
    const handleSubmit: FormEventHandler = e => {
        e.preventDefault();
        post("/register");
    };

    return (
        <AuthLayout>
            <Head title="Login" />
            <form onSubmit={handleSubmit} id="register">
                <div className="flex flex-col">
                    <label>Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        onChange={e => setData("username", e.target.value)}
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
                </div>
                <div>
                    <label>Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={e => setData("email", e.target.value)}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={e => setData("password", e.target.value)}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="confirm_password"
                        value={data.password_confirmation}
                        onChange={e => setData("password_confirmation", e.target.value)}
                    />
                    {errors.password_confirmation && <div className="error">{errors.password_confirmation}</div>}
                </div>
                <div>
                    <Link href={route("login")}>Already registered ?</Link>
                    <button type="submit" disabled={processing}>
                        Register
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
