import Link from 'next/link';
import Image from 'next/image';
import UserProfile from '../../(home-components)/userprofile/page';

export default function NavBar() {
  const pill = "flex items-center h-8 rounded-full p-6"
  return (
    <header className = 'relative flex w-full h-30 bg-slate-50 shadow-xl p-4 justify-between items-center'>
      {/*logo*/}
      <div className={`${pill} flex-shrink-0 bg-yellow-100`}>
        <Image 
        src ='/app_logo.svg'
        alt ='AppLogo'
        width={200}
        height={100}
        />
      </div>
      {/*search bar*/}
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
      <UserProfile />
    </header>
    );
}