'use client'

{/*Search Bar*/}
export default function SearchBar() {
  const pill = "flex items-center h-8 rounded-full p-6"
  return (
    <form className={`${pill} bg-gray-100 w-1/3 mx-6`}>
      <input 
      type='text' 
      value={""} 
      placeholder='Search' 
      className='
      w-full
      rounded-full'
      aria-label='Search'>
      </input>
    </form>
  );
}