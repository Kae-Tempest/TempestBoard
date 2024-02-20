import { Head, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import CustomCheckbox from "@/Componants/Checkbox";
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
        post("/login");
    };

    return (
        <AuthLayout>
            <Head title="Login" />
            <form onSubmit={handleSubmit} id="login">
                <div>
                    <label>Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    {errors.email && (
                        <div className="error">{errors.email}</div>
                    )}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    {errors.password && (
                        <div className="error">{errors.password}</div>
                    )}
                </div>
                <CustomCheckbox
                    label="Remember me"
                    checked={data.remember}
                    onChange={(e) => {
                        data.remember = e.target.checked;
                    }}
                />
                <div>
                    <span>Forgotten password ?</span>
                    <button type="submit" disabled={processing}>
                        Login
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
