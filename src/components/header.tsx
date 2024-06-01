// src/components/Header.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Header() {
  return (
    <header className='bg-gray-800 p-4'>
      <div className='container mx-auto flex items-center justify-between'>
        <div>
          <Link href='/'>
            <Image 
              src='/image.png' // Corrected path to your logo image
              alt='image'
              width={100} // Set the width of the logo
              height={50} // Set the height of the logo
            />
          </Link>
        </div>
        <nav className='flex-grow flex items-end justify-center'>
          <Link href='/' className='mx-8 text-white'>
            Home
          </Link>
          <Link href='/profile' className='mx-8 text-white'>
            Profile
          </Link>
          <Link href='/desc' className='mx-8 text-white'>
            Description
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
