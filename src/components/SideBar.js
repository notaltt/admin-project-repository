import myImage from '../images/logo.png';

const currentPathname = window.location.pathname;

const navigation = [
    {
        title: 'Manage Users',
        icon: 'M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z',
        href: '/users',
        active: currentPathname === '/users',
    },
    {
        title: 'Manage Teams',
        icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
        href: '/manage-team',
        active: currentPathname === '/manage-team',
    },
    {
        title: 'Logout',
        icon: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
        href: '#',
        active: false,
    },
]

const SideBar = ({ isOpen, toggleSidebar }) =>{
    return (
        
        <aside className={`z-50 text-black dark:text-white sm:sticky w-screen h-screen absolute bg-sky-200 sm:w-64 sm:h-auto  dark:bg-gray-900  md:block flex-shrink-0  ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`} >
                
            <div className='py-4 '>
                
            
                <div className='flex'>
                    <a className='ml-4 ' href="dashboard">
                        <img
                        className="mr-2 h-6 "
                        alt='privo admin'
                        src={myImage}/>
                        
                    </a>
                    <a href="dashboard">
                        <h1 className='font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-blue-800'>PRIVO ADMIN</h1>
                    </a>
                    <button className="rounded-xl ml-64 block md:hidden p-1 dark:text-white hover:bg-blue-300 text-black" onClick={toggleSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                
                </div>
                
                
                <ul className=" mt-6">
                    {navigation.map((item) => (
                        <li className="relative px-6 py-3">
                            {item.active && (
                                <span className="absolute inset-y-0 left-0 w-1 bg-purple-950 le-600 rounded-tr-lg rounded-br-lg" aria-hidden="false"></span>
                            )}
                            <a
                                className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                                item.active
                                    ? 'dark:hover:text-blue-200 dark:text-purple-800'
                                    : 'dark:hover:text-red-400'
                                }`}
                                href={item.href}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                <span className="ml-4">{item.title}</span>
                            </a>
                        </li>    
                           
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export default SideBar;