import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center text-gray-800">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mt-2 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-gray-500">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/auth"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Go Back Home
      </Link>
    </div>
  );
}
