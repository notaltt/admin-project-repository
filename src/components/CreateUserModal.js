import { useState } from 'react';
import { firestore as db } from "./firebase";
import FilterableSelect from "./FilterableSelect";
import { collection, doc, getDocs, setDoc, where, query } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function CreateUserModal({ isOpen, closeModal }) {
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleCompanyChange = (selectedCompany) => {
    console.log(selectedCompany)
    setCompany(selectedCompany);
  };
  
  const inputHandler = (e) => {
    const { name, value } = e.target;

    switch(name) {
        case "email":
            setEmail(value);
            break;
        case "name":
            setName(value);
            break;
        case "password":
            setPassword(value);
            break;
        case "phoneNumber":
            setPhone(value);
            break;
        case "username":
            setUsername(value);
            break;
        default:
            break;
    }
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
    
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasDigits && hasSpecialChar;
  };

  
  const checkEmailExists = async (email) => {
    const usersRef = collection(db, 'users'); 
    const emailQuery = query(usersRef, where('email', '==', email));
    const emailSnapshot = await getDocs(emailQuery);
    return !emailSnapshot.empty;
  };
  

  const checkUsernameExists = async (username) => {
    const usersRef = collection(db, 'users');
    const usernameQuery = query(usersRef, where('username', '==', username));
    const usernameSnapshot = await getDocs(usernameQuery);
    return !usernameSnapshot.empty;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters long, contain an uppercase and lowercase letter, a number, and a special character.");
      return;
    }

    const emailExists = await checkEmailExists(email);
    const usernameExists = await checkUsernameExists(username);

    if (emailExists) {
      setEmailError("Email already exists.");
    } else {
      setEmailError("");
    }
  
    if (usernameExists) {
      setUsernameError("Username already exists.");
    } else {
      setUsernameError("");
    }
  
    if (emailExists || usernameExists) {
      setIsSubmitting(false);
      return;
    }

    if(company === "" || company === "Select Company:"){
      console.log("Select Company First");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // User registration was successful
      const user = userCredential.user;
      console.log("User registered:", user);
  
      // Now, you can store additional user data in Firestore if needed
      const userData = {
        uid: user.uid,
        avatar: "null",
        email: email,
        name: name,
        phone: phone,
        role: "member",
        company: company,
        username: username,
      };
  
      const addUser = doc(db, 'users', user.uid);
      await setDoc(addUser, userData);

      setEmail("");
      setName("");
      setPassword("");
      setPhone("");
      setUsername("");
      setCompany("");
      setIsSubmitting(false);
      closeModal();
    } catch (error) {
      console.error("Error registering user:", error.message);   
      if (error.code === "auth/email-already-in-use") {
        setEmailError("Email already exists.");
      } else if (error.code === "auth/username-already-in-use") {
        setUsernameError("Username already exists.");
      }
      setIsSubmitting(false);
    }
  };
  
  const onCreate = () => {
    submitHandler();
  };
  
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
            <form className="space-y-2" onSubmit={submitHandler}>
              <div>
                <label htmlFor="email" className="flex text-sm font-medium leading-6 dark:text-white text-gray-900">
                  Email address
                </label>
                <div>
                  <input
                    placeholder="Email@something.com"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={inputHandler}
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {emailError && <p className="text-red-500">{emailError}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
                    Name
                  </label>
                </div>
                <div>
                  <input
                    placeholder="firstName lastName"
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={inputHandler}
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div >
                <div className="flex items-center justify-between">
                  <label htmlFor="username" className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
                    Username
                  </label>
                </div>
                <div>
                  <input
                    placeholder="Username"
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={inputHandler}
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {usernameError && <p className="text-red-500">{usernameError}</p>}
              </div>
              <div >
                <div className="flex items-center justify-between">
                  <label htmlFor="phonenumber" className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
                    Phone Number
                  </label>
                </div>
                <div>
                  <input
                    placeholder="Phone number"
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    pattern="[0-9]{11}"
                    value={phone}
                    onChange={inputHandler}
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div >
                <div className="flex items-center justify-between">
                    <label htmlFor="Company" className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
                        Company
                    </label>
                </div>
                <div>              
                    <FilterableSelect onTeamChange={handleCompanyChange} />
                </div>
              </div>
              <div className="flex mt-2">
                <div className="flex-1 mr-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
                      Password
                    </label>
                  </div>
                  <div>
                    <input
                      placeholder="Password"
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={inputHandler}
                      required
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md dark:bg-purple-500 bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}