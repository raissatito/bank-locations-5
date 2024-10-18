"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, UserIcon } from "lucide-react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result.error) {
            alert("Invalid email or password");
            setError("Invalid email or password");
        } else {
            router.push("/admin/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Logo and Bank Image */}
            <div className="bg-[#c8102e] text-white p-8 flex flex-col justify-between md:w-1/2">
                <div className="mb-8">
                    <img
                        src="https://www.cimbniaga.co.id/content/dam/cimb/logo/Logo%20CIMB%20white.svg"
                        alt="CIMB Logo"
                        className="w-32 h-auto"
                    />
                </div>
                <div className="hidden md:block">
                    <h1 className="text-4xl font-bold mb-4">
                        Welcome Admin Sicabang!
                    </h1>
                    <p className="text-xl">
                        Secure, convenient, and always at your service.
                    </p>
                </div>
                <div className="mt-auto text-sm">
                    © 2024 Kelompok 5 CIPTA IT 2024. All rights reserved.
                </div>
            </div>
            {/* Right side - Login Form */}
            <div className="bg-white p-8 flex items-center justify-center md:w-1/2">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-[#c8102e] mb-6 text-center">
                        Login to Your Account
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-700">
                                Email
                            </Label>
                            <div className="relative">
                                <UserIcon
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="Enter your email"
                                    className="pl-10 text-black"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <LockIcon
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="pl-10 text-black"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#c8102e] hover:bg-[#a00d24] text-white"
                        >
                            Log In
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <a
                            href="#"
                            className="text-[#c8102e] hover:underline text-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Please contact your administrator");
                            }}
                        >
                            Forgot your password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
