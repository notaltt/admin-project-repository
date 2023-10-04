import { useState } from 'react';
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import storage, { firestore as db } from "./firebase";
import { ref, uploadString } from "firebase/storage";

export default function ManageTeam(){
    const [showButton, setShowButton] = useState(false);
    const [showTeam, setShowTeam] = useState(false);
    const [inputCompanyValue, setInputCompanyValue] = useState(''); 
    const [inputTeamValue, setInputTeamValue] = useState(''); 
    const [teamNumber, setTeamNumber] = useState(0);
    const companyStorage = ref(storage, 'company/');


    async function createFolder(currentRef, folderName) {
      const newDir = ref(currentRef, folderName);
    
      try {
        const readmeFile = ref(newDir, 'readme.txt');
        await uploadString(readmeFile, 'samplefile');
        
        console.log(`Folder '${folderName}' created.`);
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    }
  
    const handleCompanyInputChange = (e) => {
      setInputCompanyValue(e.target.value);
      setShowTeam(false);
      setShowButton(e.target.value !== ''); 
    };

    const handleTeamInputChange = (e) => {
      setInputTeamValue(e.target.value)
    }
  
    const handleAddCompany = async (e) => {
      e.preventDefault();
    
      const companyData = {
        team0: inputTeamValue,
      };
    
      try {
        const companyName = inputCompanyValue.trim();
        const companyRef = doc(db, "company", companyName);
        await setDoc(companyRef, companyData);
    
        setInputTeamValue("");
        createFolder(companyStorage, companyName)
        setShowTeam(true); 
      } catch (error) {
        console.error(error);
      }
    };

    const handleButtonTeam = () => {
      setShowTeam(true);
    };

    const handleCreateTeam = async () => {
      try {
        const companyName = inputCompanyValue.trim();
        const companyRef = doc(db, "company", companyName);
        const teamName = `team${teamNumber}`;
        const fieldToUpdate = {};
        const teamFolder = ref(storage, `company/${companyName}/`);
    
        fieldToUpdate[teamName] = inputTeamValue; 
    
        await updateDoc(companyRef, fieldToUpdate);
    
        setTeamNumber(teamNumber + 1);
        createFolder(teamFolder, inputTeamValue);
        setInputTeamValue(""); // Clear the team name input
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <input type="text" className="p-2 border rounded shadow-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Company's name" value={inputCompanyValue} onChange={handleCompanyInputChange}/>

        {showButton && (
            <div className='flex flex-row gap-1'>
                <button className="mt-2 p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600" onClick={handleButtonTeam}>Add Team</button>
                <button className="mt-2 p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600" onClick={handleAddCompany}>Add Company</button>
            </div>
        )}

        {showTeam && (
            <div className='flex flex-col'>
                <input type="text" className="mt-3 p-2 border rounded shadow-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Team's name" value={inputTeamValue} onChange={handleTeamInputChange}/>
                <button className="mt-2 p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600" onClick={handleCreateTeam}>Create Team</button>
            </div>
        )}
      </div>
    );
}
