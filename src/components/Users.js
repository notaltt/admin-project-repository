import SideBar from './SideBar';
import {firestore as db} from './firebase';
import { collection, query, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';

// function CreateUserModal({ isOpen, closeModal }) {
//     if (!isOpen) return null;

//     class User {
//         constructor (name, avatar, company, email, phone, role, username ) {
//             this.name = name;
//             this.avatar = avatar;
//             this.company = company;
//             this.email = email;
//             this.phone = phone;
//             this.role = role;
//             this.username = username;
//         }
//         toString() {
//             return this.name + ', ' + this.state + ', ' + this.country;
//         }
//     }

//     data = new User('', '', '', '', '', '', '');

//     const userConverter = {
//         toFirestore: (user) => {
//             return {
//                 name: user.name,
//                 name: user.avatar,
//                 name: user.company,
//                 name: user.email,
//                 name: user.phone,
//                 name: user.role,
//                 name: user.username
//                 };
//         },
//         fromFirestore: (snapshot, options) => {
//             const data = snapshot.data(options);
//             return new User(data.name, data.avatar, data.company, data.email, data.phone, data.role);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         data = ((data) => ({
//           ...data,
//           [name]: value,
//         }));
//       };

//     const onCreate = (User) => {
//         setDoc(doc(db, "cities", "new-city-id"), data);
//         console.log('User data saved:', User);
//         closeModal();
//     };
  
//     return (
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75 bg-gray-800">
//         <div className="modal-overlay"></div>
//         <div className="modal-container bg-white dark:bg-gray-800 w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
//           <div className="modal-content py-4 text-left px-6">
//             <div className="flex justify-between items-center pb-3">
//               <p className="text-2xl font-bold">User Details</p>
//               <button
//                 onClick={closeModal}
//                 className="modal-close cursor-pointer z-50 text-3xl"
//               >
//                 &times;
//               </button>
//             </div>
//             <div>
//                 <p>ID: {User.id}</p>
//                 <div className='flex pt-1'>
//                 Name:
//                 <input
//                     type="text"
//                     name="name"
//                     value={User.data.name}
//                     onChange={handleInputChange}
//                     className="border p-1 ms-2 flex-grow"
//                 />
//                 </div>
//                 <div className='flex pt-1'>
//                 Avatar:
//                 <input
//                     type="text"
//                     name="avatar"
//                     value={User.data.avatar}
//                     onChange={handleInputChange}
//                     className="border p-1 ms-2 flex-grow"
//                 />
//                 </div>
//                 <div className='flex pt-1'>
//                 Company:
//                 <input
//                     type="text"
//                     name="company"
//                     value={User.data.company}
//                     onChange={handleInputChange}
//                     className="border p-1 ms-2 flex-grow"
//                 />
//                 </div>
//                 <div className='flex pt-1'>
//                 Email:
//                 <input
//                     type="text"
//                     name="email"
//                     value={User.data.email}
//                     onChange={handleInputChange}
//                     className="border p-1 ms-2 flex-grow"
//                 />
//                 </div>
//                 <div className='flex pt-1'>
//                 Phone:
//                 <input
//                     type="text"
//                     name="phone"
//                     value={User.data.phone}
//                     onChange={handleInputChange}
//                     className="border p-1 ms-2 flex-grow"
//                 />
//                 </div>
//                 <div className='flex pt-1'>
//                 Role:
//                 <input
//                     type="text"
//                     name="role"
//                     value={User.data.role}
//                     onChange={handleInputChange}
//                     className="border p-1 ms-2 flex-grow"
//                 />
//                 </div>
//                 <div className='flex pt-1'>
//                 Username:
//                 <input
//                     type="text"
//                     name="username"
//                     value={User.data.username}
//                     onChange={handleInputChange}
//                     className="border p-1 ms-2 flex-grow"
//                 />
//                 </div>
//             </div>
//             <div className="mt-4 flex justify-end">
//               <button onClick={() => onCreate(User)} className=" bg-slate-500 text-white px-3 py-2 mr-2 rounded">
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
// }

function UserModal({ isOpen, closeModal, user }) {
    if (!isOpen) return null;

    const editedUser = user;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
      };

    const onSave = (editedUser) => {
        // You can implement the actual save logic here, e.g., update data in your database
        console.log('User data saved:', editedUser);
        closeModal();
    };

    const onDelete = async (userToDelete) => {
        await deleteDoc(doc(db, 'users', user.id));
        console.log('User data deleted:', userToDelete);
        closeModal();
    };
  
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
                <p>ID: {editedUser.id}</p>
                <div className='flex pt-1'>
                Name:
                <input
                    type="text"
                    name="name"
                    value={editedUser.data.name}
                    onChange={handleInputChange}
                    className="border p-1 ms-2 flex-grow"
                />
                </div>
                <div className='flex pt-1'>
                Avatar:
                <input
                    type="text"
                    name="avatar"
                    value={editedUser.data.avatar}
                    onChange={handleInputChange}
                    className="border p-1 ms-2 flex-grow"
                />
                </div>
                <div className='flex pt-1'>
                Company:
                <input
                    type="text"
                    name="company"
                    value={editedUser.data.company}
                    onChange={handleInputChange}
                    className="border p-1 ms-2 flex-grow"
                />
                </div>
                <div className='flex pt-1'>
                Email:
                <input
                    type="text"
                    name="email"
                    value={editedUser.data.email}
                    onChange={handleInputChange}
                    className="border p-1 ms-2 flex-grow"
                />
                </div>
                <div className='flex pt-1'>
                Phone:
                <input
                    type="text"
                    name="phone"
                    value={editedUser.data.phone}
                    onChange={handleInputChange}
                    className="border p-1 ms-2 flex-grow"
                />
                </div>
                <div className='flex pt-1'>
                Role:
                <input
                    type="text"
                    name="role"
                    value={editedUser.data.role}
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

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    }

    const handleRowClick = (selectedUserId) => {
        const selectedUser = userData.find((user) => user.id === selectedUserId);
        setSelectedUser(selectedUser);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    const [userData, setUserData] = useState([]);
    const collectionName = 'users';

    useEffect(() => {
        const fetchData = async () => {
          const q = query(collection(db, collectionName));
    
          try {
            const querySnapshot = await getDocs(q);
            const userDataArray = [];
    
            querySnapshot.forEach((doc) => {
              userDataArray.push({ id: doc.id, data: doc.data() });
            });
    
            setUserData(userDataArray);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
    
        fetchData();
      }, []);

    return(
        <div className="flex bg-white dark:bg-gray-950 h-screen overflow-hidden': isSideMenuOpen }">  
           
           <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

            <div className='class="flex flex-col flex-1 w-full"'>
                <header className='justify-content z-10 bg-white shadow-md dark:bg-gray-950'>
                </header>
                <main>
                    <table className="table-auto">
                        <thead className='bg-slate-200'>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Avatar</th>
                            <th className="px-4 py-2">Company</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Username</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userData.map((user) => (
                            <tr
                            key={user.id}
                            onClick={() => handleRowClick(user.id)}
                            className="cursor-pointer hover:bg-gray-200" >
                                <td className="border px-4 py-2">{user.id}</td>
                                <td className="border px-4 py-2">{user.data.avatar}</td>
                                <td className="border px-4 py-2">{user.data.company}</td>
                                <td className="border px-4 py-2">{user.data.email}</td>
                                <td className="border px-4 py-2">{user.data.name}</td>
                                <td className="border px-4 py-2">{user.data.phone}</td>
                                <td className="border px-4 py-2">{user.data.role}</td>
                                <td className="border px-4 py-2">{user.data.username}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </main>
            </div>

            <UserModal isOpen={isModalOpen} closeModal={closeModal} user={selectedUser} />
        </div>
    )
}