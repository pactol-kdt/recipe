import { signOut } from '~/auth';

export default async function UserPage() {
  return (
    <main>
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/auth' });
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </main>
  );
}
