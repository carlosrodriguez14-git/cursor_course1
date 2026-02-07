"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Overview" },
  { label: "API Playground", href: "/playground" },
  { label: "Invoices" },
  { label: "Documentation" },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={onClose}
          />
          <aside className="fixed left-4 right-4 top-20 z-50 flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-lg lg:hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="text-lg font-semibold text-zinc-900">Carlos AI</div>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-semibold text-white transition hover:bg-purple-600"
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                title="Close menu"
              >
                X
              </button>
            </div>
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
            <div className="mt-auto flex flex-col gap-3">
              <div className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500">
                Workspace settings
              </div>
              <button
                className="rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-zinc-100"
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Log out
              </button>
            </div>
          </aside>
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
            <div className="mt-auto flex flex-col gap-3">
              <div className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500">
                Workspace settings
              </div>
              <button
                className="rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-zinc-100"
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Log out
              </button>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
