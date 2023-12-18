import SideBar from './SideBar';
import CreateUserModal from './CreateUserModal';
import {firestore as db} from './firebase';
import { collection, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from 'react';

function UserModal({ isOpen, closeModal, user }) {
  
  const [editedUser, setEditedUser] = useState(user);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(editedUser);
    setEditedUser((prevEditedUser) => ({
      ...prevEditedUser,
      data: {
        ...prevEditedUser.data,
        [name]: value,
      },
    }));
  };
  
  const onSave = async (editedUser) => {
    try {

      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        avatar: editedUser.data.avatar || '',
        company: editedUser.data.company,
        email: editedUser.data.email,
        name: editedUser.data.name,
        phone: editedUser.data.phone,
        role: editedUser.data.role,
        username: editedUser.data.username,
      });
      console.log('User data saved:', editedUser);
      closeModal();
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
      
  const onDelete = async (userToDelete) => {
    await deleteDoc(doc(db, 'users', user.id));
    console.log('User data deleted:', userToDelete);
    closeModal();
  };

  useEffect(() => {
    setEditedUser(user);
  }, [user]);
      
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75 bg-gray-800">
      <div className="modal-overlay"></div>
      <div className="modal-container bg-white dark:bg-gray-800 w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">User Details</p>
            <button
              onClick={closeModal}
              className="modal-close cursor-pointer z-50 text-3xl"
            >
              &times;
            </button>
          </div>
          <div>
              <p>ID: {user.id}</p>
              <div className='flex pt-1'>
              Avatar:
              <input
                  type="text"
                  name="avatar"
                  value={editedUser?.data?.avatar || ''}
                  onChange={handleInputChange}
                  className="border p-1 ms-2 flex-grow"
              />
              </div>
              <div className='flex pt-1'>
              Company:
              <input
                  type="text"
                  name="company"
                  value={editedUser?.data?.company || ''} 
                  onChange={handleInputChange}
                  className="border p-1 ms-2 flex-grow"
              />
              </div>
              <div className='flex pt-1'>
              Email:
              <input
                  type="text"
                  name="email"
                  value={editedUser?.data?.email || ''} 
                  onChange={handleInputChange}
                  className="border p-1 ms-2 flex-grow"
              />
              </div>
              <div className='flex pt-1'>
              Name:
              <input
                  type="text"
                  name="name"
                  value={editedUser?.data?.name || ''} 
                  onChange={handleInputChange}
                  className="border p-1 ms-2 flex-grow"
              />
              </div>
              <div className='flex pt-1'>
              Phone:
              <input
                  type="text"
                  name="phone"
                  value={editedUser?.data?.phone || ''} 
                  onChange={handleInputChange}
                  className="border p-1 ms-2 flex-grow"
              />
              </div>
              <div className='flex pt-1'>
                Role:
                <select
                  name="role"
                  value={editedUser?.data?.role || ''}
                  onChange={handleInputChange}
                  className="border p-1 ms-2 flex-grow"
                >
                  <option value="manager">manager</option>
                  <option value="member">member</option>
                </select>
              </div>
              <div className='flex pt-1'>
              Username:
              <input
                  type="text"
                  name="username"
                  value={editedUser?.data?.username || ''} 
                  onChange={handleInputChange}
                  className="border p-1 ms-2 flex-grow"
              />
              </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={() => onSave(editedUser)} className=" bg-slate-500 text-white px-3 py-2 mr-2 rounded">
              Save
            </button>
            <button onClick={() => onDelete(editedUser)} className="bg-red-500 text-white px-3 py-2 rounded">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Files(){
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
    const collectionName = 'users';

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
                  <h1 className='text-2xl font-bold m-4 '>Manage Users</h1>
              </header>

              <main className="mx-auto my-5">
                  <div className="mx-auto m-4 rounded-md bg-white shadow-md">
                  <table className="table-auto">
                    <thead className='bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300'>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Avatar</th>
                      <th className="px-4 py-2">Company</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Username</th>
                    </thead>
                    <tbody>
                    {userData.map((user) => (
                        <tr
                        key={user.id}
                        onClick={() => handleRowClick(user.id)}
                        className="cursor-pointer hover:bg-gray-200" >
                            <td className="border px-2 py-1">{user.id}</td>
                            <td className="border px-2 py-1">{user.data.avatar}</td>
                            <td className="border px-2 py-1">{user.data.company}</td>
                            <td className="border px-2 py-1">{user.data.email}</td>
                            <td className="border px-2 py-1">{user.data.name}</td>
                            <td className="border px-2 py-1">{user.data.phone}</td>
                            <td className="border px-2 py-1">{user.data.role}</td>
                            <td className="border px-2 py-1">{user.data.username}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                  </div>
              
                  <div className='flex justify-center items-center p-3'>
                      <span className='mx-2 font-bold'>Add User</span>
                      <button
                      onClick={() => handleCreate()}
                      className="bg-blue-300 hover:bg-blue-200 active:bg-blue-400 text-white p-2 rounded-full shadow-md flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                      </button>
                  </div>
              </main>
            </div>

            <UserModal isOpen={isModalOpen} closeModal={closeModal} user={selectedUser} />
            <CreateUserModal isOpen={isCreateModalOpen} closeModal={closeCreateModal}/>
        </div>
    )
}