// src/api.js


const apiUrl = process.env.API_URL ;

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully got user fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}


export async function postUserFragments(user, data, type) {
  console.log('Posting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        'Content-type': type,
      },
      body: data
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    console.log('Posted user fragments data: ', data);
    console.log(res);
  } catch (err) {
    console.error('Unable to  POST /v1/fragments', { err });
  }
}


export async function getUserFragmentList(user) {
  console.log('Requesting all user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Received user fragments list', { data });
  } catch (err) {
    console.log('Unable to call GET /v1/fragments/?expand=1', { err });
  }
}


export async function getFragmentDataByID(user, id) {
  try {
    if (id != "") {
      console.log(`Requesting user fragment data by ID...`);
      console.log(`Fetching ${apiUrl}/v1/fragments/${id}`);
      const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
        headers: user.authorizationHeaders(),
      });


      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      const type = res.headers.get("Content-Type");
      if (type.includes("text")) {
        const data = await res.text();
        console.log(`Received user fragment by ID: ${id}`, { data });
        document.getElementById("returnedData").innerHTML = data;
      }
    } else {
      document.getElementById("returnedData").textContent = "Error: ID required";
      console.log("Error: ID required");
    }
  } catch (err) {
    console.log(`Unable to call GET /v1/fragments/${id}`, { err });
  }
}


export async function getFragmentInfoByID(user, id) {
  try {
    if (id != "") {
      console.log(`Requesting user fragment info by ID...`);
      console.log(`Fetching ${apiUrl}/v1/fragments/${id}/info`);
      const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
        headers: user.authorizationHeaders(),
      });

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log(`Received user fragment info by ID: ${id}`, { data });
    } else {
      document.getElementById("returnedData").textContent = "Error: ID required";
      console.log("Error: ID required");
    }
  } catch (err) {
    console.log(`Unable to call GET /v1/fragments/${id}/info`, { err });
  }
}

