import SideBar from './SideBar';
import CreateUserModal from './CreateUserModal';
import {firestore as db} from './firebase';
import { collection, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ManageInvites(){
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    }

    const handleRowClick = (selectedUserId) => {
      const selectedUser = userData.find((user) => user.id === selectedUserId);
      setSelectedUser(selectedUser);
      setIsModalOpen(true);
    };

    const handleCreate = () => {
      setIsCreateModalOpen(true);
    };
    
    const closeModal = () => {
      setIsModalOpen(false);
    };

    const closeCreateModal = () => {
      setIsCreateModalOpen(false);
    };
    
    const [userData, setUserData] = useState([]);
    const collectionName = 'invites';

    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, collectionName), (querySnapshot) => {
        const userDataArray = [];
  
        querySnapshot.forEach((doc) => {
          userDataArray.push({ id: doc.id, data: doc.data() });
        });
  
        setUserData(userDataArray);
      });
  
      return () => {
        unsubscribe();
      };
    }, []);

    return(
        <div className="flex bg-white dark:bg-gray-950 h-screen overflow-hidden">
           
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

            <div className='flex flex-col flex-1 w-full  overflow-y-scroll'>
                <header className='justify-content =shadow-md dark:bg-gray-950 bg-blue-50'>
                    <h1 className='text-2xl font-bold m-4 '>Manage Invites</h1>
                </header>
                <main className="mx-auto my-5">
                    <div className="mx-auto m-4 rounded-md bg-white shadow-md">
                    <table className="table-auto">
                    <thead className='bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300'>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Company</th>
                        <th className="px-4 py-2">Manager</th>
                        <th className="px-4 py-2">Team</th>
                        <th className="px-4 py-2">Time</th>
                        <th className="px-4 py-2">User</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userData.map((user) => (
                        <tr
                        key={user.id}
                        onClick={() => handleRowClick(user.id)}
                        className="cursor-pointer hover:bg-gray-200" >
                            <td className="border px-2 py-1">{user.id}</td>
                            <td className="border px-2 py-1">{user.data.company}</td>
                            <td className="border px-2 py-1">{user.data.manager}</td>
                            <td className="border px-2 py-1">{user.data.team}</td>
                            <td className="border px-2 py-1">{user.data.time.toDate().toLocaleDateString()}</td>
                            <td className="border px-2 py-1">{user.data.user}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    </div>
                </main>
            </div>
        </div>
    )
}