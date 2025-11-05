import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <h2 className="mt-2 text-2xl font-semibold">Denied Access</h2>
      <p className="mt-2 text-gray-600">You are not authorized to sign in.</p>

      <Link
        href="/auth"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Go Back Home
      </Link>
    </div>
  );
}
