import SideBar from './SideBar';
import DarkMode from './DarkMode';
import { useState } from 'react';
import ManageTeam from './ManageTeam';

export default function Files(){
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    }
  
    return(
        <div className="flex bg-white dark:bg-gray-950 h-screen overflow-hidden': isSideMenuOpen }">  
           
           <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

            <div className='class="flex flex-col flex-1 w-full"'>
            <header className='justify-content z-10 mt-5 bg-white shadow-md dark:bg-gray-950'>
                
                <div className="flex md:justify-center flex-1 lg:mr-32">
                    <div>
                        <button className="mr-10 ml-3 rounded-lg bg-blue-200 md:hidden block dark:bg-gray-900 dark:text-white text-black p-2" onClick={toggleSidebar}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                    {/* <div className='flex justify-end items-end p-10'>
                        <DarkMode/>
                        <h1>MANAGE COMPANY & TEAMS</h1>
                    </div>  */}
                </div> 
            </header>
                <main>
                    <ManageTeam/>
                </main>
            </div>
        </div>
       
    )
}