import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthCardLayout from '@/layouts/auth/auth-card-layout';
import Footer from '@/components/footer';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-blue-100">
            <AuthCardLayout title="Welcome Back" description="Log in to your account to continue">
                <Head title="Log in" />

                <form className="flex flex-col gap-6 bg-blue-200/30 backdrop-blur-md shadow-xl border border-white/40 p-4 rounded-lg" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 rounded-lg"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="ml-auto text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200" tabIndex={5}>
                                        Forgot Password?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="♦♦♦♦♦♦♦♦♦"
                                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 rounded-lg"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="text-blue-600"
                            />
                            <Label htmlFor="remember" className="text-gray-700">Remember Me</Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Log In
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <TextLink href={route('register')} tabIndex={5} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            Sign Up
                        </TextLink>
                    </div>
                </form>

                {status && <div className="mb-4 text-center text-sm font-medium text-green-600 bg-white/80 p-2 rounded-lg mt-4">{status}</div>}
            </AuthCardLayout>
            <Footer />
        </div>
    );
}
