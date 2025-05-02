import Link from 'next/link';
import { FaHome, FaCode, FaBook, FaCog, FaCreditCard, FaUserCircle, FaExternalLinkAlt, FaListUl, FaGlobe, FaBars, FaTimes, FaCube } from 'react-icons/fa';
import React from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function Sidebar({ open, onClose, onOpen }: SidebarProps) {
  return (
    <>
      {/* Hamburger menu for opening sidebar */}
      {!open && (
        <button
          className="fixed top-4 left-4 z-50 bg-white border rounded-full p-2 shadow hover:bg-gray-100 transition"
          onClick={onOpen}
          aria-label="Open sidebar"
        >
          <FaBars size={22} />
        </button>
      )}
      {/* Sidebar */}
      <aside
        className={`h-screen w-64 bg-white border-r flex flex-col justify-between fixed left-0 top-0 z-40 shadow-sm transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!open}
      >
        <div>
          {/* Logo and close button */}
          <div className="flex items-center gap-3 px-6 py-6 relative">
            <FaCube className="text-blue-500 text-2xl flex-shrink-0" />
            <span className="font-bold text-xl text-gray-800 whitespace-nowrap">Cursor Web App</span>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <FaTimes size={20} />
            </button>
          </div>
          {/* Workspace/account dropdown */}
          <div className="px-6 mb-6">
            <button className="flex items-center gap-2 w-full bg-gray-100 rounded-lg px-3 py-2 text-gray-700 font-medium">
              <span className="bg-green-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">J</span>
              <span>Personal</span>
              <svg className="ml-auto h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-2">
            <SidebarLink href="/dashboard" icon={<FaHome />} label="Overview" />
            <SidebarLink href="#" icon={<FaCode />} label="API Playground" />
            <SidebarLink href="#" icon={<FaListUl />} label="Use Cases" />
            <SidebarLink href="#" icon={<FaCreditCard />} label="Billing" />
            <SidebarLink href="#" icon={<FaCog />} label="Settings" />
            <SidebarLink href="#" icon={<FaBook />} label="Documentation" external />
            <SidebarLink href="#" icon={<FaGlobe />} label="Tavily MCP" external />
          </nav>
        </div>
        {/* User profile */}
        <div className="px-6 py-4 border-t flex items-center gap-3">
          <span className="bg-green-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">J</span>
          <div className="flex-1">
            <div className="font-medium text-gray-800">John Reese</div>
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-600">
            <FaUserCircle size={22} />
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ href, icon, label, external }: { href: string; icon: React.ReactNode; label: string; external?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-base">
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
      {external && <FaExternalLinkAlt className="ml-auto text-xs text-gray-400" />}
    </Link>
  );
} 