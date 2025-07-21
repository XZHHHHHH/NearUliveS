'use client'
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IoSearch } from "react-icons/io5";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBar({ className = '', placeholder = 'Search...' }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  }, [searchValue, router]);

  return (
    <form 
      onSubmit={handleSearch}
      className={`
        relative
        flex
        items-center
        h-10
        w-full
        max-w-md
        rounded-full
        bg-gray-100
        hover:bg-gray-200
        transition-colors
        px-4
        ${className}
      `}
    >
      <input 
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          bg-transparent
          outline-none
          text-gray-800
          placeholder-gray-500
          text-sm
        "
        aria-label="Search"
      />
      <button
        type="submit"
        className="
          flex
          items-center
          justify-center
          ml-2
          text-gray-500
          hover:text-gray-700
          focus:outline-none
        "
        aria-label="Submit search"
      >
        <IoSearch size={18} />
      </button>
    </form>
  );
}