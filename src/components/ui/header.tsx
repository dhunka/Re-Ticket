import Link from 'next/link';
import {auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';

export default async function Header()  {
    const {userId} =  await auth();
    console.log(userId);

    return(
        <div className=' bg-black text-neutral-50'>
            <div className=' container mx-auto flex items-center justify-between py-4'>
                <Link href='/'>Home</Link>
                <div>
                    <div className='flex gap-4 items-center'>
                        {!userId && (
                          <>
                            <Link href='/register'>Registro</Link>
                            <Link href='/login'>Login</Link>
                          </>  
                        )}
                        {userId && (
                            <Link href= 'perfil' className='text-gray-300 hover:text-white mr-4' >
                                Perfil
                            </Link>
                        )}
                        <div className='ml-auto'>                       
                            <UserButton afterSignOutUrl='/' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
