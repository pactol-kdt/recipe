export default function HeartLoader() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <div className="loader animate-beat relative h-[5em] w-[7em]">
        <div className="before"></div>
        <div className="after"></div>
      </div>
      <h1 className="animate-beat text-2xl">Loading</h1>
    </div>
  );
}
