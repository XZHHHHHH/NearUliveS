'use client';
import Image from 'next/image';

    {/*user profile*/}
    export default function UserProfile() {
        return (
        <div className='flex item-center space-x-6'>
        <Image
        src={"/globe.svg"}
        alt="UserAvatar"
        width={60}
        height={20}
        className="rounded-full"
        />
        <div className="lg:block text-2xl font-medium">Username<br/>
          <span className="opacity-30 text-xm">@Handle</span>
        </div>
      </div>
        );
    }