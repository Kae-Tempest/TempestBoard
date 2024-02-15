import { Head, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import CustomCheckbox from "@/Componants/checkbox";
import { FormEventHandler, useEffect } from "react";

export default function () {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
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
                    <label className="font-bold">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="bg-Tertiary border-[0.5px] border-Quaternary rounded-sm h-5 text-TextColor"
                    />
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
                </div>
                <CustomCheckbox
                    label="Remember me"
                    checked={data.remember}
                    onChange={(e) => {
                        data.remember = e.target.checked;
                    }}
                />
                <div className="text-end">
                    <span className="text-Secondary font-bold text-xs mx-2 hover:underline">
                        Forgotten password ?
                    </span>
                    <button
                        type="submit"
                        disabled={processing}
                        className="h-7 w-20 bg-Quaternary text-TextColor rounded mt-2 font-bold text-center leading-5"
                    >
                        Login
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
