import { useState } from 'react';
import { collection, doc, setDoc, updateDoc, query, getDocs, where, deleteDoc } from 'firebase/firestore';
import storage, { firestore as db } from './firebase';
import { ref, deleteObject, listAll, getMetadata, uploadString } from 'firebase/storage';

export default function ManageTeam() {
  const [showButton, setShowButton] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [inputCompanyValue, setInputCompanyValue] = useState('');
  const [inputTeamValue, setInputTeamValue] = useState('');
  const [teamNumber, setTeamNumber] = useState(0);
  const [companyExistsError, setCompanyExistsError] = useState(false);
  const [teamExistsError, setTeamExistsError] = useState(false);
  const [addCompanyError, setAddCompanyError] = useState(false);
  // const [editCompany, setEditCompany] = useState(false);
  const [deleteCompany, setDeleteCompany] = useState(false);
  const companyStorage = ref(storage, 'company/');

  function nameValidation(name) {
    return name.length >= 6;
  }

  async function checkTeamExists(name) {
    const teamsCollectionRef = collection(db, 'team');
    const queryRef = query(teamsCollectionRef, where('teamName', '==', name));

    const querySnapshot = await getDocs(queryRef);
    return !querySnapshot.empty;
  }

  async function checkCompanyExists(name){
    const teamsCollectionRef = collection(db, 'company');
    const queryRef = query(teamsCollectionRef, where('companyName', '==', name));

    const querySnapshot = await getDocs(queryRef);
    return !querySnapshot.empty;
  }

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
    setCompanyExistsError(false);
  };

  const handleTeamInputChange = (e) => {
    setInputTeamValue(e.target.value);
    setTeamExistsError(false);
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();

    const companyName = inputCompanyValue.trim();

    if (!nameValidation(companyName)) {
      return;
    }

    if(await checkCompanyExists(companyName)){
      setCompanyExistsError(true);
      return;
    }

    const companyData = {
      companyName: inputCompanyValue,
      team0: inputTeamValue,
    };

    const companyRef = doc(db, 'company', companyName);

    try {
      await setDoc(companyRef, companyData);
      setAddCompanyError(false);
      setInputTeamValue('');
      createFolder(companyStorage, companyName);
      setShowTeam(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonTeam = () => {
    const companyName = inputCompanyValue.trim();
    if(!checkCompanyExists(companyName)){
      setShowTeam(true);
    }else{
      setAddCompanyError(true);
    }
  };

  const handleCreateTeam = async () => {
    const companyName = inputCompanyValue.trim();
    const teamNameInput = inputTeamValue.trim();

    if (!nameValidation(teamNameInput)) {
      return;
    }

    if (await checkTeamExists(teamNameInput)) {
      setTeamExistsError(true);
      return;
    }

    const companyRef = doc(db, 'company', companyName);
    const teamRef = doc(db, 'team', teamNameInput);
    const teamName = `team${teamNumber}`;
    const fieldToUpdate = {};
    const teamFolder = ref(storage, `company/${companyName}/`);

    const teamData = {
      fromCompany: companyName,
      teamName: teamNameInput,
      member0: '',
    };

    fieldToUpdate[teamName] = teamNameInput;

    try {
      await updateDoc(companyRef, fieldToUpdate);
      await setDoc(teamRef, teamData);
      setTeamNumber(teamNumber + 1);
      createFolder(teamFolder, teamNameInput);
      setInputTeamValue('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (e) => {
    setDeleteCompany(true);
    // setEditCompany(false);
  };

  // const handleEdit = (e) => {
  //   setEditCompany(true);
  //   setDeleteCompany(false);
  // };

  const handleYesDelete = async (e) => {
    const trimmedInput = inputCompanyValue.trim();
    const companyRef = doc(db, 'company', trimmedInput);

    try{
      const teamsQuery = await getDocs(collection(db, 'team'), where('fromCompany', '==', trimmedInput));

      const deleteTeams = teamsQuery.docs.map(async (teamDoc) =>{
        await deleteDoc(teamDoc.ref);
        console.log(`team ${teamDoc.id} is deleted.`);
      });

      await Promise.all(deleteTeams);

      console.log("All teams are deleted.")

      const companyStorageRef = ref(storage, `company/${trimmedInput}/`);
      await deleteFolderContents(companyStorageRef);

      await deleteDoc(companyRef);
      console.log(`Company ${trimmedInput} is deleted.`);
      setCompanyExistsError(false);
      setDeleteCompany(false);
      setInputCompanyValue('');
    } catch(error){
      console.error(error);
    }
  };

  const deleteFolderContents = async (folderRef) => {
    const folderContents = await listAll(folderRef);
  
    const deleteFilePromises = folderContents.items.map(async (item) => {
      await deleteObject(item);
      console.log(`File ${item.fullPath} is deleted.`);
    });

    await Promise.all(deleteFilePromises);
  
    const deleteFolderPromises = folderContents.prefixes.map(async (subfolderRef) => {
      await deleteFolderContents(subfolderRef);
    });
  
    await Promise.all(deleteFolderPromises);
  };

  const handleNoDelete = (e) => {
    setDeleteCompany(false);
  };

  const goBack = () => {
    window.location.href = '/panel';
 
  };

  return (
    <div>
      <p onClick={goBack} className='cursor-pointer'>back to main dashboard</p>
      <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Guide:</p>
      <p>Input company name first to create a company or to add teams on a specific company</p>
      <p>You can't change your company name, so your created company name is final.</p>
      <input type="text" className="w-1/4 p-2 border rounded shadow-md focus:outline-none focus:ring focus:border-blue-300" placeholder="Company's name"
        value={inputCompanyValue} onChange={handleCompanyInputChange} required/>

      {!nameValidation(inputCompanyValue) && (
        <p className="text-red-600"> Company name must be at least 6 characters long.</p>
      )}

      {companyExistsError && (
        <p className="text-red-600">Company already exists. Do you want to <strong className='cursor-pointer' onClick={handleDelete}>delete</strong> the company?</p>
      )}

      {/* {editCompany && (
        <div>
          test
        </div>
      )} */}

      {deleteCompany && (
        <p className="text-red-600">Are you sure deleting {inputCompanyValue}? <strong className='cursor-pointer' onClick={handleYesDelete}>YES</strong> or <strong className='cursor-pointer' onClick={handleNoDelete}>NO</strong></p>
      )}

      {addCompanyError && (
        <p className="text-red-600">Add the company first.</p>
      )}

      {showButton && (
        <div className="w-1/4 flex flex-row gap-3">
          <button className="flex-grow mt-2 p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600" onClick={handleButtonTeam}>Add Team</button>
          <button className="flex-grow mt-2 p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600" onClick={handleAddCompany}>Add Company</button>
        </div>
      )}

      {showTeam && (
        <div className="w-1/4 flex flex-col">
          <input type="text" className="mt-3 p-2 border rounded shadow-md focus:outline-none focus:ring focus:border-blue-300" placeholder="Team's name"
            value={inputTeamValue}onChange={handleTeamInputChange} required/>
          {!nameValidation(inputTeamValue) && (
            <p className="text-red-600"> Team name must be at least 6 characters long.</p>
          )}
          {teamExistsError && (
            <p className="text-red-600">Team already exists.</p>
          )}
          <button className="mt-2 p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600" onClick={handleCreateTeam}>Create Team</button>
        </div>
      )}
    </div>
    </div>
  );
}
