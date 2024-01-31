// src/app.js

import { Auth, getUser } from './auth';

import { getUserFragments } from './api';


import { getUserFragments, getUserFragmentList, postUserFragments, getFragmentDataByID, getFragmentInfoByID } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');

  const postBtn = document.querySelector('#postBtn');
  const getBtn = document.querySelector('#getBtn');
  const getListBtn = document.querySelector('#getListBtn');
  const getByIdBtn = document.querySelector('#getByIdBtn');
  const getInfoByIdBtn = document.querySelector('#getInfoByIdBtn');


  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Do an authenticated request to the fragments API server and log the result
  const userFragments = await getUserFragments(user);

  postBtn.onclick = () => {
    let data = document.querySelector('#data').value;
    let type = document.querySelector('#types').value;
    postUserFragments(user, data, type);
  }


  getBtn.onclick = () => {
    getUserFragments(user);
  }

  getListBtn.onclick = () => {
    getUserFragmentList(user);
  }


 

  getInfoByIdBtn.onclick = () => {
    let id = document.querySelector('#id').value;
    getFragmentInfoByID(user, id);
  }


  getUserFragmentList(user);

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);