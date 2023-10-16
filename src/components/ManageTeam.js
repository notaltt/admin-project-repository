import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, updateDoc, query, getDocs, where, deleteDoc } from 'firebase/firestore';
import storage, { firestore as db } from './firebase';
import { ref, deleteObject, listAll, getMetadata, uploadString } from 'firebase/storage';

export default function ManageTeam() {
  const [showTeam, setShowTeam] = useState(false);
  const [inputCompanyValue, setInputCompanyValue] = useState('');
  const [inputTeamValue, setInputTeamValue] = useState('');
  const [teamNumber, setTeamNumber] = useState(0);
  const [companyExistsError, setCompanyExistsError] = useState(false);
  const [teamExistsError, setTeamExistsError] = useState(false);
  const [addCompanyError, setAddCompanyError] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [validationTeamError, setValidationTeamError] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [teamExists, setTeamExists] = useState(0);
  const [deleteTeam, setDeleteTeam] = useState(false);
  // const [editCompany, setEditCompany] = useState(false);
  const [deleteCompany, setDeleteCompany] = useState(false);
  const companyStorage = ref(storage, 'company/');

  function nameValidation(name) {
    if(name.length >= 6){
      setValidationError(false);
      return true;
    }else{
      setValidationError(true);
      return false;
    }
  }

  function teamNameValidation(name){
    if(name.length >= 6){
      setValidationTeamError(false);
      return true;
    }else{
      setValidationTeamError(true);
      return false;
    }
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

  useEffect(() => {
    const fetchCompanyData = async () => {
      const collectionRef = collection(db, 'company');
      const queryRef = query(collectionRef, where('companyName', '>=', ''));
  
      try {
        const querySnapshot = await getDocs(queryRef);
        const data = [];
  
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
  
        setCompanyData(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
  
    fetchCompanyData();
  }, []);

  // useEffect(() =>{
  //   const fetchTeamData = async () => {
  //     const collectionRef = collection(db, 'team');
  //     const queryRef = query(collectionRef, where('fromCompany', '==', ));
  
  //     try {
  //       const querySnapshot = await getDocs(queryRef);
  //       const data = [];
  
  //       querySnapshot.forEach((doc) => {
  //         data.push({ id: doc.id, ...doc.data() });
  //       });
  
  //       setTeamData(data);
  //     } catch (error) {
  //       console.error('Error fetching company data:', error);
  //     }
  //   };
  
  //   fetchTeamData();
  // }, [])

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

  const updateCompanyInputChange = async (value) => {
    setInputCompanyValue(value);
    setCompanyExistsError(false);
    setValidationTeamError(false);
  
    if (value !== '') {
      const exists = await checkCompanyExists(value);
      setShowTeam(exists);
    } else {
      setShowTeam(false);
    }
  };

  const handleCompanyInputChange = async (e) => {
    const companyName = e.target.value;
    updateCompanyInputChange(companyName);
  };

  const updateTeamInputChange = async (value) => {
    setInputTeamValue(value);

    if (value.trim() !== '') {
      const exists = await checkTeamExists(value);
      setTeamExists(exists ? 1 : 0);
    } else {
      setTeamExists(0); 
    }
  }
  

  const handleTeamInputChange = (e) => {
    setInputTeamValue(e.target.value);
    setTeamExistsError(false);
    updateTeamInputChange(e.target.value);
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();

    const companyName = inputCompanyValue.trim();
    nameValidation(companyName);

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

  function handleClickTeam(teamName){
    const teamExists = checkTeamExists(teamName);
    setTeamExists(teamExists ? 1 : 0);
    setInputTeamValue(teamName);
  }

  async function handleClickCompany(companyName){
    setInputCompanyValue(companyName);
    updateCompanyInputChange(companyName);

    const collectionRef = collection(db, 'team');
    const queryRef = query(collectionRef, where('fromCompany', '==', companyName));

    try {
      const querySnapshot = await getDocs(queryRef);
      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setTeamData(data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  }

  const handleCreateTeam = async () => {
    const companyName = inputCompanyValue.trim();
    const teamNameInput = inputTeamValue.trim();

    teamNameValidation(teamNameInput);

    if (!teamNameValidation(teamNameInput)) {
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
      const teamQuery = query(collection(db, 'team'), where('fromCompany', '==', trimmedInput));
      const teamSnapshot = await getDocs(teamQuery);
      const deleteTeamPromises = [];
  
      teamSnapshot.forEach((teamDoc) => {
        deleteTeamPromises.push(deleteDoc(teamDoc.ref));
      });

      await Promise.all(deleteTeamPromises);

      console.log("All teams are deleted.")

      const companyStorageRef = ref(storage, `company/${trimmedInput}/`);
      await deleteFolderContents(companyStorageRef);

      await deleteDoc(companyRef);
      console.log(`Company ${trimmedInput} is deleted.`);
      setCompanyExistsError(false);
      setDeleteCompany(false);
      setInputCompanyValue('');

      window.location.reload();
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

  const handleDeleteTeam = (e) => {
    setDeleteTeam(true);
  };

  const handleYesDeleteTeam = async (e) =>{
    const companyName = inputCompanyValue.trim();
    const teamName = inputTeamValue.trim();
    const teamRef = doc(db, 'team', teamName);

    try{
      const teamStorageRef = ref(storage, `company/${companyName}/${teamName}`)
      await deleteFolderContents(teamStorageRef);

      await deleteDoc(teamRef);
      console.log(`${teamName} is deleted.`)
      setDeleteTeam(false);
      setTeamExists(0);
      setInputTeamValue('');

      window.location.reload();
    }catch(error){
      console.error(error);
    }
  };

  const handleNoDeleteTeam = (e) => {
    setDeleteTeam(false);
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
      <p>Click or input the company name or team name to delete.</p>

      <div className='w-full flex flex-row items-center justify-center'>
        <div className='w-1/2'>
          <input type="text" className="w-full p-2 border rounded shadow-md focus:outline-none focus:ring focus:border-blue-300" placeholder="Company's name"
            value={inputCompanyValue} onChange={handleCompanyInputChange} required/>
          {validationError && (
              <p className="text-red-600"> Company name must be at least 6 characters long.</p>
            )}

            {companyExistsError && (
              <p className="text-red-600">Company already exists. Do you want to <strong className='cursor-pointer' onClick={handleDelete}>delete</strong> the company?</p>
            )}

            {deleteCompany && (
              <p className="text-red-600">Are you sure deleting {inputCompanyValue}? <strong className='cursor-pointer' onClick={handleYesDelete}>YES</strong> or <strong className='cursor-pointer' onClick={handleNoDelete}>NO</strong></p>
            )}

            {addCompanyError && (
              <p className="text-red-600">Add the company first.</p>
          )}
        </div>
        <div className="flex flex-row gap-3 ml-3">
          <button className="flex-grow p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600" onClick={handleAddCompany}>Add Company</button>
          <button className="flex-grow p-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600" onClick={handleDelete}>Delete Company</button>
        </div>
      </div>

      <div id='list' className='bg-blue-50 w-1/2 h-full flex rounded mt-2'>
        <div id='company' className='w-1/2'>
          <h2>COMPANY</h2>
          <ul>
            {companyData.length === 0 ? (
              <p>No data available.</p>
            ) : (
              <ul>
                {companyData.map((doc) => (
                  <li key={doc.id}>
                    <p className='hover:bg-blue-100 cursor-pointer' onClick={() => handleClickCompany(doc.companyName)}>{doc.companyName}</p>
                  </li>
                ))}
              </ul>
            )}
          </ul>
        </div>
        <div id='team' className='w-1/2'>
          <h2>TEAM</h2>
          <ul>
            {inputCompanyValue.length === 0 ? (
              <p>No Company Selected.</p>
            ) : (
              <div>
                {teamData.length === 0? (
                  <p>No Teams available.</p>
                ) : (
                  <ul>
                    {teamData.map((doc) => (
                      <li key={doc.id}>
                        <p className='hover:bg-blue-100 cursor-pointer' onClick={() => handleClickTeam(doc.teamName)}>{doc.teamName}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </ul>
        </div>
      </div>

      {showTeam && (
        <div className="w-1/2 flex flex-col">
          <input type="text" className="mt-3 p-2 border rounded shadow-md focus:outline-none focus:ring focus:border-blue-300" placeholder="Team's name"
            value={inputTeamValue} onChange={handleTeamInputChange} required/>
          {validationTeamError && (
            <p className="text-red-600"> Team name must be at least 6 characters long.</p>
          )}
          {teamExistsError && (
            <p className="text-red-600">Team already exists.</p>
          )}
          {teamExists === 1 ? (
            <button className="mt-2 p-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600" onClick={handleDeleteTeam}>Delete Team</button>
          ): (
            <button className="mt-2 p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600" onClick={handleCreateTeam}>Create Team</button>
          )}
          {deleteTeam && (
            <p className="text-red-600">Are you sure deleting team {inputTeamValue}? <strong className='cursor-pointer' onClick={handleYesDeleteTeam}>YES</strong> or <strong className='cursor-pointer' onClick={handleNoDeleteTeam}>NO</strong></p>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
