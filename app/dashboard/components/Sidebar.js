"use client";

import Link from "next/link";

const navItems = [
  { label: "Overview" },
  { label: "Research Assistant" },
  { label: "Research Reports" },
  { label: "API Playground", href: "/playground" },
  { label: "Invoices" },
  { label: "Documentation" },
];

export default function Sidebar({ isOpen }) {
  return (
    <>
      {isOpen ? (
        <aside className="hidden w-64 flex-shrink-0 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:flex lg:flex-col">
          <div className="text-lg font-semibold text-zinc-900">Carlos AI</div>
          <nav className="mt-6 flex flex-col gap-3 text-sm text-zinc-600">
            {navItems.map((item) =>
              item.href ? (
                <Link
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-zinc-100"
                  href={item.href}
                  key={item.label}
                >
                  <span className="h-2 w-2 rounded-full bg-zinc-300" />
                  {item.label}
                </Link>
              ) : (
                <button
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-zinc-100"
                  key={item.label}
                  type="button"
                >
                  <span className="h-2 w-2 rounded-full bg-zinc-300" />
                  {item.label}
                </button>
              )
            )}
          </nav>
          <div className="mt-auto rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500">
            Workspace settings
          </div>
        </aside>
      ) : null}
    </>
  );
}
