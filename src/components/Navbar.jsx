import {React, useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-800 text-white fixed top-0 left-0 z-50 shadow">
      <div className="max-w-full flex justify-between items-center px-6 h-16">
        {/* Logo */}
        <div className="text-xl font-bold">Crop Forecasting</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/" className="hover:text-gray-300">
            Dashboard
          </a>
          <a href="/cropRecord" className="hover:text-gray-300">
            Table
          </a>
          <a href="#records" className="hover:text-gray-300">
            Records
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-700">
          <a
            href="/"
            className="block px-4 py-2 hover:bg-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </a>
          <a
            href="/cropRecord"
            className="block px-4 py-2 hover:bg-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Table
          </a>
          <a
            href="#records"
            className="block px-4 py-2 hover:bg-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Records
          </a>
        </div>
      )}
    </nav>
  );
}