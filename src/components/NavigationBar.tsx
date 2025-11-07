'use client';

import { Cookie, History, LayoutDashboard, Notebook, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { paths } from '~/meta';

const NavigationBar = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <nav className="border-border-base fixed bottom-0 z-900 flex h-14 w-full justify-between border-t bg-white p-2">
      <Link
        href={paths.DASHBOARD}
        className={`${pathname.includes(paths.DASHBOARD) ? 'bg-accent text-white' : ''} hover:bg-accent rounded-md p-2 hover:text-white`}
      >
        <LayoutDashboard width={24} height={24} />
      </Link>
      <Link
        href={paths.INGREDIENT}
        className={`${pathname.includes(paths.INGREDIENT) ? 'bg-accent text-white' : ''} hover:bg-accent rounded-md p-2 hover:text-white`}
      >
        <Notebook width={24} height={24} />
      </Link>
      <Link
        href={paths.RECIPE}
        className={`${pathname.includes(paths.RECIPE) ? 'bg-accent text-white' : ''} hover:bg-accent rounded-md p-2 hover:text-white`}
      >
        <Cookie width={24} height={24} />
      </Link>
      <Link
        href={paths.LOG}
        className={`${pathname.includes(paths.LOG) ? 'bg-accent text-white' : ''} hover:bg-accent rounded-md p-2 hover:text-white`}
      >
        <History width={24} height={24} />
      </Link>
      <Link
        href={paths.USER}
        className={`${pathname.includes(paths.USER) ? 'bg-accent text-white' : ''} hover:bg-accent rounded-md p-2 hover:text-white`}
      >
        <UserRound width={24} height={24} />
      </Link>
    </nav>
  );
};

export default NavigationBar;
