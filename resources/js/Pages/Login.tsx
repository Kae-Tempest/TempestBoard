import { Head } from '@inertiajs/react';
import AuthLayout from "@/Layouts/AuthLayout";
export default function() {
    return (
        <AuthLayout>
            <Head title="Login" />
            <form>
                <div className="flex flex-col">
                    <label className="font-bold">Email</label>
                    <input type="email" name="email" className="bg-Tertiary border-[0.5px] border-Quaternary rounded-sm"/>
                </div>
                <div className="flex flex-col">
                    <label className="font-bold">Password</label>
                    <input type="password" name="password" className="bg-Tertiary border-[0.5px] border-Quaternary rounded-sm"/>
                </div>
                <div>
                    <input type="checkbox" name="remember" className="bg-Tertiary border-[0.5px] border-Quaternary rounded-[5px]"/>
                    <label className="ml-2">Remember me</label>
                </div>
                <button type="submit" className="">Login</button>
            </form>
        </AuthLayout>
    )
}