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
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data);
    };

    return (
        <AuthLayout>
            <Head title="Login" />
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label className="font-bold">Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        className="bg-Tertiary border-[0.5px] border-Quaternary rounded-sm h-5 text-TextColor"
                    />
                    {errors.username && <div>{errors.username}</div>}
                </div>
                <div className="flex flex-col mt-4">
                    <label className="font-bold">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="bg-Tertiary border-[0.5px] border-Quaternary rounded-sm h-5 text-TextColor"
                    />
                    {errors.email && <div>{errors.email}</div>}
                </div>
                <div className="flex flex-col mt-4">
                    <label className="font-bold">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="bg-Tertiary border-[0.5px] border-Quaternary rounded-sm h-5 text-TextColor"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    {errors.password && <div>{errors.password}</div>}
                </div>
                <div className="flex flex-col mt-4">
                    <label className="font-bold">Confirm Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="confirm_password"
                        value={data.password_confirmation}
                        className="bg-Tertiary border-[0.5px] border-Quaternary rounded-sm h-5 text-TextColor"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                    {errors.password_confirmation && (
                        <div>{errors.password_confirmation}</div>
                    )}
                </div>
                <div className="text-end mt-4">
                    <Link
                        className="text-Secondary font-bold text-xs mx-2 hover:underline"
                        href={route("login")}
                    >
                        Already registered ?
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="h-7 w-20 bg-Quaternary text-TextColor rounded mt-2 font-bold text-center leading-5"
                    >
                        Register
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
