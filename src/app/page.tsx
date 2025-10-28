import { auth, signIn, signOut } from '../auth';

export default async function SignIn() {
  const session = await auth();

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
