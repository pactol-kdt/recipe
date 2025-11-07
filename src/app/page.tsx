import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from '../auth';
import { paths } from '~/meta';

export default async function SignIn() {
  const session = await auth();
  if (!session?.user) {
    redirect(paths.DASHBOARD);
  } else {
    redirect(paths.AUTH);
  }
  return (
    <main>
      {!session?.user && (
        <form
          action={async () => {
            'use server';
            await signIn('github');
          }}
        >
          <button type="submit">Signin with GitHub</button>
        </form>
      )}

      {session?.user && (
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/auth' });
          }}
        >
          <button type="submit">Sign Out</button>
        </form>
      )}
    </main>
  );
}
