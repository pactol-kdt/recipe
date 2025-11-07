import { redirect } from 'next/navigation';
import { auth, signIn } from '~/auth';
import { paths } from '~/meta';

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) redirect(paths.DASHBOARD);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">Sign in with GitHub</h1>
      <form
        action={async () => {
          'use server';
          await signIn('github', { redirectTo: paths.DASHBOARD });
        }}
      >
        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
        >
          Sign in with GitHub
        </button>
      </form>
    </div>
  );
}
