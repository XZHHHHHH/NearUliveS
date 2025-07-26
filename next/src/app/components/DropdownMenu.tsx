'use client';
import { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
}

export default function DropdownMenu({ children, trigger, className = '' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({ 
  children, 
  onClick, 
  className = '',
  danger = false 
}: { 
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
      } ${className}`}
    >
      {children}
    </button>
  );
}
