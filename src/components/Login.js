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
        </div>
      </div>

      <div id="modal" class="fixed top-0 left-0 w-full h-full bg-opacity-75 bg-gray-900 flex hidden justify-center items-center">
          <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-xl font-semibold mb-4">Error</h2>
              <p id="error-message">Credentials are incorrect. Please try again.</p>
              <button id="close-modal" class="mt-4 bg-purple-400 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded">Close</button>
          </div>
      </div>

    </div>
  )
}
  