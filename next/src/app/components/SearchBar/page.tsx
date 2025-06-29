'use client'

import { useState } from 'react';

{/*Search Bar*/}
export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const pill = "flex items-center h-8 rounded-full p-6"
  
  return (
    <form className={`${pill} bg-gray-100 w-1/3 mx-6`}>
      <input 
        type='text' 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder='Search' 
        className='
        w-full
        rounded-full
        bg-transparent
        outline-none'
        aria-label='Search'>
      </input>
    </form>
  );
}