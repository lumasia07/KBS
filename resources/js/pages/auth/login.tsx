import { Form, Head, Link } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
    portalType?: 'admin' | 'agent' | 'taxpayer';
}

const portalConfig = {
    admin: {
        title: 'Admin Portal Login',
        description: 'Sign in to access the administrative dashboard',
    },
    agent: {
        title: 'Agent Portal Login',
        description: 'Sign in to access your field agent dashboard',
    },
    taxpayer: {
        title: 'Log in to your account',
        description: 'Enter your email and password below to log in',
    },
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
    portalType = 'taxpayer',
}: LoginProps) {
    const config = portalConfig[portalType] || portalConfig.taxpayer;

    return (
        <AuthLayout
            title={config.title}
            description={config.description}
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            className="text-sm text-[#003366] hover:text-[#002244] font-medium hover:underline"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="w-4 h-4 rounded border-slate-300 text-[#003366] focus:ring-[#003366]"
                                />
                                <label htmlFor="remember" className="text-sm text-slate-600">
                                    Remember me
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-slate-600">
                                Don't have an account?{' '}
                                <Link
                                    href="/taxpayer/register"
                                    tabIndex={5}
                                    className="text-[#003366] font-semibold hover:text-[#002244] hover:underline"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}

