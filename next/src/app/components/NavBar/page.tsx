import Image from 'next/image';
import UserProfile from '../../components/UserProfile/page';
import SearchBar from '../SearchBar/page';

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
      <SearchBar />
      <UserProfile />
    </header>
    );
}