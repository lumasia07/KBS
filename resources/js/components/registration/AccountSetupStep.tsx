import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface AccountSetupStepProps {
    data: {
        email: string;
        password: string;
        password_confirmation: string;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

export default function AccountSetupStep({ data, setData, errors }: AccountSetupStepProps) {
    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-black mb-4">Account Setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-600">Account Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="account@company.com"
                    />
                    <InputError message={errors.email} />
                </div>
                <div>
                    <Label htmlFor="password" className="text-sm font-medium text-slate-600">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Create a strong password"
                    />
                    <InputError message={errors.password} />
                </div>
                <div>
                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-600">Confirm Password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Confirm your password"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>
            </div>
        </div>
    );
}