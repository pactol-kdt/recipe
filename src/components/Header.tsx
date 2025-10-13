'use client';

import { ArrowLeft, EllipsisVertical, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type HeaderProps = {
  title: string;
  backButton: boolean;
  menuButton: boolean;
};

const Header = ({ title, backButton, menuButton }: HeaderProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative flex h-[74px] items-center justify-between p-4">
      {backButton ? (
        <button
          type="button"
          className="border-border-base active:bg-bg-muted w-fit rounded-full border p-2 active:scale-95"
          onClick={() => router.back()}
        >
          <ArrowLeft width={24} height={24} />
        </button>
      ) : (
        <div className="w-[40px]" />
      )}

      <h1 className="text-xl">{title}</h1>

      {menuButton ? (
        <div className="">
          <button
            type="button"
            className="border-border-base active:bg-bg-muted w-fit rounded-full border p-2 active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
          >
            <EllipsisVertical width={24} height={24} />
          </button>

          {isOpen && (
            <button
              className="border-border-base active:bg-bg-muted absolute right-4 flex w-fit gap-2 rounded-sm border bg-white p-2"
              onClick={() => router.push('/recipe/add')}
            >
              <Plus /> <div>Add new recipe</div>
            </button>
          )}
        </div>
      ) : (
        <div className="w-[40px]" />
      )}
    </header>
  );
};

export default Header;
