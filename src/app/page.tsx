import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
    redirect("/recipe");
    return (
        <main className="flex min-h-screen flex-col items-center bg-primary justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <Image
                    className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                    src="/next.svg"
                    alt="Next.js Logo"
                    width={180}
                    height={37}
                    priority
                />
            </div>
        </main>
    );
}
