'use client';

import { ArrowLeft, EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type HeaderProps = {
  title: string;
  backButton: boolean;
  menuButtons: { icon: React.ReactElement; label: string; fn: () => void }[] | null;
};

const Header = ({ title, backButton, menuButtons }: HeaderProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-border-base relative flex h-[74px] w-full items-center justify-between border-b bg-white p-4">
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

      {menuButtons?.length ? (
        <div className="">
          <button
            type="button"
            className="border-border-base active:bg-bg-muted w-fit rounded-full border p-2 active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
          >
            <EllipsisVertical width={24} height={24} />
          </button>

          {isOpen && (
            <div className="border-border-base absolute right-4 flex flex-col rounded-sm border bg-white">
              {menuButtons.map((btn, idx) => (
                <button
                  key={idx}
                  className={`active:bg-bg-muted flex w-full items-center gap-2 bg-white p-2 ${idx < menuButtons.length - 1 ? 'border-border-base border-b' : ''} `}
                  onClick={btn.fn}
                >
                  {btn.icon} <div>{btn.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-[40px]" />
      )}
    </header>
  );
};

export default Header;
