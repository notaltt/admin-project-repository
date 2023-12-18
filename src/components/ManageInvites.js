import SideBar from './SideBar';
import {firestore as db} from './firebase';
import { collection, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ManageInvites(){
    const [selectedInvite, setSelectedInvite] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tableHeaders = ["ID", "Company", "Manager", "Team", "Time", "User"];

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    }

    const handleRowClick = (selectedInviteId) => {
      const thisSelectedInvite = inviteData.find((invite) => invite.id === selectedInviteId);
      setSelectedInvite(thisSelectedInvite);
      setIsModalOpen(true);
    };
    
    const closeModal = () => {
      setIsModalOpen(false);
    };
    
    const [inviteData, setInviteData] = useState([]);
    const collectionName = 'invites';

    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, collectionName), (querySnapshot) => {
        const inviteDataArray = [];
  
        querySnapshot.forEach((doc) =>
          {inviteDataArray.push({ id: doc.id, data: doc.data() });});
  
        setInviteData(inviteDataArray);
      });
  
      return () => {unsubscribe();};
    }, []);

    useEffect(() => {
        console.log("selected invite:", selectedInvite);
    }, [selectedInvite]);



    function InviteModal({ isOpen, closeModal }) {
      const [selectedDate, setSelectedDate] = useState(selectedInvite?.data.time.toDate() ?? new Date());

      const onSave = async () => {
        const inviteDocRef = doc(db, 'invites', selectedInvite.id);

        try { await updateDoc(inviteDocRef, { time: selectedDate });
          console.log('selectedDate:', selectedDate);
          console.log('id:', selectedInvite.id);
          console.log('inviteDocRef:', inviteDocRef);
          closeModal();
        } catch (error) {
          console.error('Error saving invite data:', error);
        }
      };

      const onDelete = async () => {
        const inviteDocRef = doc(db, 'invites', selectedInvite.id);
        await deleteDoc(inviteDocRef);
        console.log('Invite data deleted:', selectedInvite.id);
        closeModal();
      };
    
      if (!isOpen) return null;
      
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75 bg-gray-800">
          <div className="modal-overlay"></div>

          <div className="modal-container bg-white dark:bg-gray-800 w-auto md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
          <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">Invite Details</p>
            <button
              onClick={closeModal}
              className="modal-close cursor-pointer z-50 text-3xl"
            >
              &times;
            </button>
          </div>
          {!selectedInvite ? (<p>loading...</p>):
          <div>
            <p className="px-2 py-1">id: {selectedInvite.id}</p>
            <p className="px-2 py-1">company: {selectedInvite.data.company}</p>
            <p className="px-2 py-1">manager: {selectedInvite.data.manager}</p>
            <p className="px-2 py-1">team: {selectedInvite.data.team}</p>
            <p className="px-2 py-1">user: {selectedInvite.data.user}</p>
            <p className="px-2 py-1">
              time: <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date) }
                showTimeSelect
                dateFormat="Pp"
                className='bg-slate-100 rounded-md border p-1'/>
            </p>
          </div>}
          <div className="mt-4 flex justify-center">
            <button onClick={() => onSave()} className="bg-slate-600 text-white px-3 py-1 rounded mx-4">
              Save Changes
            </button>
            <button onClick={() => onDelete()} className="bg-red-600 text-white px-3 py-1 rounded">
              Delete
            </button>
          </div>
          </div>
          </div>

        </div>
      );
    }

    return(
        <div className="flex bg-white dark:bg-gray-950 h-screen overflow-hidden">
           
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
            <InviteModal isOpen={isModalOpen} closeModal={closeModal} />

            <div className='flex flex-col flex-1 w-full  overflow-y-scroll'>

                <header className='justify-content =shadow-md dark:bg-gray-950 bg-blue-50'>
                    <h1 className='text-2xl font-bold m-4 '>Manage Invites</h1>
                </header>

                <main className="mx-auto my-5">
                  <div className="mx-auto m-4 rounded-md bg-white shadow-md">
                  <table className="table-auto">
                  <thead className='bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300'><tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index} className="px-4 py-2">{header}</th> ))}
                  </tr></thead>
                  <tbody>
                  {inviteData.length === 0 ? <tr className="m-1 mx-auto"><td>no invite data!</td></tr> : null}
                  {inviteData.map((i) => (
                      <tr
                      key={i.id}
                      onClick={() => handleRowClick(i.id)}
                      className="cursor-pointer hover:bg-gray-200" >
                          <td className="border px-2 py-1">{i.id}</td>
                          <td className="border px-2 py-1">{i.data.company}</td>
                          <td className="border px-2 py-1">{i.data.manager}</td>
                          <td className="border px-2 py-1">{i.data.team}</td>
                          <td className="border px-2 py-1">{i.data.time.toDate().toLocaleDateString()}</td>
                          <td className="border px-2 py-1">{i.data.user}</td>
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