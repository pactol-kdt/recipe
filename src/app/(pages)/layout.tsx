import NavigationBar from '~/components/NavigationBar';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white">
      {children}
      <NavigationBar />
    </main>
  );
}
