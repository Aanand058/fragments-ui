// src/app.js

import { Auth, getUser } from './auth';

import { getUserFragments } from './api';
const apiUrl = process.env.API_URL;


import { getUserFragments, getUserFragmentList, postUserFragments, getFragmentDataByID, getFragmentInfoByID, deleteFragmentDataByID, updateFragmentByID } from './api';

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

  const deleteBtn = document.querySelector('#deleteBtn');
  const updateBtn = document.querySelector('#updateBtn');
  const uploadFileBtn = document.querySelector('#uploadImageBtn');
  const updateFileBtn = document.querySelector('#updateImageBtn');



  //
  const expandBtn = document.querySelector('#expand');
  const expandBtn2 = document.querySelector('#expand2');


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


  // Display fragments
  expandBtn.onclick = async () => {
    console.log('Requesting user fragments data...');
    try {
      const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {

        headers: user.authorizationHeaders(),
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Got user fragments data', { data });

      document.getElementById("displayFragments").innerHTML = "";
      for (const fragment of data.fragments) {
        try {
          const res = await fetch(`${apiUrl}/v1/fragments/${fragment.id}`, {

            headers: user.authorizationHeaders(),
          });
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }

          if (fragment.type.startsWith("text") || fragment.type.startsWith("application")) {
            const data = await res.text();
            document.getElementById("displayFragments").appendChild(document.createElement("hr"));
            document.getElementById("displayFragments").appendChild(document.createTextNode("Fragment id: " + fragment.id));
            document.getElementById("displayFragments").appendChild(document.createElement("br"));
            document.getElementById("displayFragments").appendChild(document.createTextNode(data));
          } else if (fragment.type.startsWith("image")) {
            const data = await res.arrayBuffer();
            const rawData = Buffer.from(data);
            const imageData = new Blob([rawData], { type: fragment.type, });
            const image = new Image();
            const reader = new FileReader();
            reader.readAsDataURL(imageData);
            reader.addEventListener("load", function () {
              image.src = reader.result;
              image.alt = fragment.id;
            });
            document.getElementById("displayFragments").appendChild(document.createElement("hr"));
            document.getElementById("displayFragments").appendChild(document.createTextNode("Fragment id: " + fragment.id));
            document.getElementById("displayFragments").appendChild(document.createElement("br"));
            document.getElementById("displayFragments").appendChild(image);
          }
        } catch (err) {
          console.error("Unable to call GET /v1/fragments/:id", { err });
        }
      }
    } catch (err) {
      console.error('Unable to call GET /v1/fragment', { err });
    }
  }

  expandBtn2.onclick = async () => {
    console.log('Requesting user fragments data...');
    try {
      const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {

        headers: user.authorizationHeaders(),
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Got user fragments metadata', { data });

      document.getElementById("displayFragments").innerHTML = "";
      for (const fragment of data.fragments) {
        try {
          const res = await fetch(`${apiUrl}/v1/fragments/${fragment.id}/info`, {

            headers: user.authorizationHeaders(),
          });
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }

          const data = await res.text();
          document.getElementById("displayFragments").appendChild(document.createElement("hr"));
          document.getElementById("displayFragments").appendChild(document.createTextNode("Fragment id: " + fragment.id));
          document.getElementById("displayFragments").appendChild(document.createElement("br"));
          document.getElementById("displayFragments").appendChild(document.createTextNode(data));
        } catch (err) {
          console.error("Unable to call GET /v1/fragments/:id", { err });
        }
      }
    } catch (err) {
      console.error('Unable to call GET /v1/fragment', { err });
    }
  }





  uploadFileBtn.onclick = () => {
    let data = document.getElementById("file").files[0];

    if (data != null) {
      alert('File has been uploaded!' + data.type);
    } else {
      alert('File required!');
    }
    postUserFragments(user, data, data.type);
  }

  updateFileBtn.onclick = () => {
    let data = document.getElementById("file").files[0];
    let id = document.querySelector('#id').value;
    updateFragmentByID(user.data, data.type, id);
    console.log('File Updated', data);
  }

  deleteBtn.onclick = () => {
    let id = document.querySelector('#id').value;
    deleteFragmentDataByID(user, id);
  }

  updateBtn.onclick = () => {
    let data = document.querySelector('#data').value;
    let type = document.querySelector('#types').value;
    let id = document.querySelector('#id').value;
    updateFragmentByID(user, data, type, id);
  }



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


