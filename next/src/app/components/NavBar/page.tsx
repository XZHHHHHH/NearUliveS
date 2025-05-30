import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {

  const pill = "flex items-center h-8 rounded-full p-6"

  return (
    <header className = 'relative flex w-full h-20 bg-slate-50 shadow-xl p-4 justify-between items-center'>
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
        rounded-full
        focus:outline-amber-200
        focus:ring-amber-200'
        aria-label='Search query'>
        </input>
      </form>
    {/*user profile*/}
      <div className='flex item-center space-x-2'>
        <Image
        src={"/globe.svg"}
        alt="UserAvatar"
        width={40}
        height={20}
        className="rounded-full"
        />
        <div className="hidden lg:block text-sm font-medium">Username<br/>
          <span className="opacity-30 text-xs">@handle</span>
        </div>
      </div>
    </header>
    );
}