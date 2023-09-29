import myImage from '../images/logo.png';
import DarkMode from './DarkMode';
import { initializeApp } from "firebase/app";
import { auth, signInWithEmailAndPassword } from "./firebase";
import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    
    const spinner = document.getElementById('spinner');
    spinner.classList.remove('hidden');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.location.href = '/panel';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // Check if the error code indicates incorrect credentials
        if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
          // Display the modal with the error message
          const modal = document.getElementById('modal');
          const errorMessageElement = document.getElementById('error-message');
          errorMessageElement.textContent = 'Credentials are incorrect. Please try again.';
          modal.classList.remove('hidden');

          // Add a click event listener to close the modal
          const closeModalButton = document.getElementById('close-modal');
          closeModalButton.addEventListener('click', () => {
            modal.classList.add('hidden');
          });
        }
      });
  };

  return (
    <div className="flex relative flex-1 h-screen dark:bg-gray-900 bg-white flex-col px-6 py-12 lg:px-8">
      <div className='absolute right-5 top-5'>
        <DarkMode/> 
        </div>
                  
        <div className='mt-20 sm:mt-28'>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src={myImage}
            alt="Privo Logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white text-gray-900">
            Welcome to Privo, admin!
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto dark:bg-gray-900 sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label htmlFor="email" className="flex text-sm font-medium leading-6 dark:text-white text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>

            <div >
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md dark:bg-purple-500 bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <div role="status" id="spinner" className="flex justify-center items-center m-3 sm:m-5 hidden">
            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>

        </div>
      </div>

      <div id="modal" className="fixed top-0 left-0 w-full h-full bg-opacity-75 bg-gray-900 flex hidden justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-xl font-semibold mb-4">Error</h2>
              <p id="error-message">Credentials are incorrect. Please try again.</p>
              <button id="close-modal" className="mt-4 bg-purple-400 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded">Close</button>
          </div>
      </div>

    </div>
  )
}
  