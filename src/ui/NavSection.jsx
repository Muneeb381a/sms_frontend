import { useState } from 'react';

export default function NavSection({ title, icon, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span className="font-medium text-gray-700">{title}</span>
        </div>
      </button>
      <div className={`pl-7 mt-1 space-y-1 ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
}