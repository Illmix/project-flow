import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations/authMutations';
import { LoginInput, AuthPayload } from '../types/graphql';
import {FormEvent, useState} from "react";
import Spinner from "../components/ui/Spinner.tsx";
import {useAuth} from "../hooks/useAuth.ts";

const LoginPage = () => {
    const { login: authLogin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginMutation, { loading, error }] = useMutation<{ login: AuthPayload }, { input: LoginInput }>(
        LOGIN_MUTATION,
        {
        onCompleted: (data) => {
            authLogin(data.login.token);
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginMutation({ variables: { input: { Email: email, Password: password } } });
    };

    return (
        <div className="flex items-center justify-center p-4">

            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-xl shadow-lg p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome
                        </h1>
                        <p className="text-gray-400">
                            Sign in to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 w-100">
                        {/* UI for Error Message */}
                        {error && (
                            <div className="bg-red-900/30 border border-red-600 text-red-300 px-4 py-3 rounded-md" role="alert">
                                <span className="block sm:inline">{error.message}</span>
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-left text-sm font-medium text-gray-300 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-300"
                                >
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-sm hover:underline  text-blue-400"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-400 mt-8">
                        Don't have an account?{' '}
                        <a href="/signup" className="font-medium hover:underline  text-blue-400">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;