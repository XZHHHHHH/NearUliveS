import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  return (
    <header className = 'flex w-full h-16 bg-slate-50 shadow-2xl flex-row flex-nowrap justify-between align'>
    {/*Logo*/}
    <Image  
      src="/NearUliveS@NUS.jpg"
      alt="NearUliveS Logo"
      width={300}
      height={10}
      className='
      pl-10 py-4 pr-4'
      />
    {/*search bar*/}
    <form>
      <input type='text' 
      value={""} 
      placeholder='Search' 
      className='
      w-100
      bg-gray-100
      rounded-full
      p-4 
      focus:outline-amber-200
      focus:ring-amber-200'
      aria-label='Search query'>
      </input>
      </form>
    {/*user profile*/}
    <Image
      src="/public/globe.svg"
      alt='User avatar'
      className='rounded-full'
      width={10}
      height={10}
      />
      <div className='hidden lg:block text-sm font-medium'>
        Username<br/>
        <span className='opacity-30 text-xs'>@handle</span>
      </div>
    </header>
    );
}