import SideBar from './SideBar';
import DarkMode from './DarkMode';
import FileList from './FileList';
import { useState } from 'react';

export default function Files(){
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [fileUploadActive, setFileUploadActive] = useState(false);

    const toggleFileUpload = () => {
        setFileUploadActive(!fileUploadActive);
    };

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
                    <div className=" relative w-40 md:w-full max-w-xl mr-6 focus-within:text-purple-500">
                        <div className="absolute mb-6 inset-y-0 flex items-center pl-2">
                        <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                        </svg>
                        </div>
                        <input className="w-full pl-8 pr-2 text-large dark:text-black    text-black placeholder-blue-600 bg-gray-200 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-blue dark:focus:placeholder-gray-600 dark:bg-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-red-300 focus:outline-none focus:shadow-outline-purple focus:text-blue-500 form-input" type="text" placeholder="Search" aria-label="Search"></input>
                    </div> 
                    <div className='mt-1'>
                        <DarkMode/>
                    </div> 
                </div> 
            </header>
                <main>
                    <FileList />
                </main>
            </div>
        </div>
       
    )
}