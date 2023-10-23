import React, { useState, useEffect } from "react";
import { firestore as db } from "./firebase"; 
import { collection, getDocs } from 'firebase/firestore';

function FilterableSelect({ onTeamChange, selectedTeam }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const optionsCollection = collection(db, 'company'); 
        const querySnapshot = await getDocs(optionsCollection);
        const optionData = [];
        optionData.push("Select Company:")
        querySnapshot.forEach((doc) => {
          optionData.push(doc.data().companyName);
        });

        setOptions(optionData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching options from Firestore:", error);
      }
    };

    fetchOptions();
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      <input
        type="text"
        className="block w-full p-1.5 border rounded-lg"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <select
        className="block w-full p-1.5 border rounded-lg mt-1"
        value={selectedTeam}
        onChange={(e) => {
          console.log("Dropdown value changed:", e.target.value);
          onTeamChange(e.target.value);
        }}
      >
        {filteredOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterableSelect;