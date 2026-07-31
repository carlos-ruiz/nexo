export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16 text-zinc-900">
      <section className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Nexo
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Your financial operating system starts here.
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          This repository is now bootstrapped with Next.js App Router,
          TypeScript, Tailwind CSS, and ESLint. Begin implementation in src/app
          and src/modules.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
            Next.js 16
          </span>
          <span className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900">
            TypeScript
          </span>
          <span className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900">
            Tailwind CSS
          </span>
        </div>
      </section>
    </main>
  );
}
