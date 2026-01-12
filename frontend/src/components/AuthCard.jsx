import React from "react";
import { Link } from "react-router-dom";

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-indigo-50 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:block md:w-1/2 bg-linear-to-br  from-indigo-500 to-indigo-500 text-white p-10">
          <div className="h-full flex flex-col justify-center gap-6">
            <div className="text-3xl font-bold">Taskify</div>
            <p className="opacity-90">Manage your tasks simply and efficiently. Fast, responsive, and designed for teams.</p>
            <div className="mt-4">
              <svg className="w-full h-48 opacity-90" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="600" height="400" rx="20" fill="rgba(255,255,255,0.06)" />
                <path d="M60 300C140 220 260 220 340 140C420 60 520 60 560 100" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-sm opacity-80">Already have an account? <Link to="/login" className="underline">Sign in</Link></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 shadow-md flex items-center justify-center text-white font-extrabold text-lg">
                <span className="uppercase">T</span>
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-gray-800 leading-tight">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">Welcome back 👋</span>
                </div>
              </div>
            </div>

            <div>{children}</div>

            {footer && <div className="mt-6 text-sm text-center text-gray-500">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
