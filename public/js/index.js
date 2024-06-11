"use strict";

const URI = `${window.location.origin}/api/v1`;
// const baseURI = `${document.location.origin}/api/v1`;

const getValueById = (id) => document.getElementById(id).value;
const getElementById = (id) => document.getElementById(id);
const setValueById = (id) => (document.getElementById(id).value = "");

async function login() {
    const loginButton = getElementById("signIn");
    loginButton.disabled = true;
    loginButton.innerText = "signing in";
    try {
        const email = getValueById("email");
        const name = getValueById("name");
        const password = getValueById("password");

        if (!email && !name && !password) throw Error("Credential Required.");

        const response = await fetch(`${URI}/login/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const { data: user } = await response.json();
        delete user.profilePicture;
        sessionStorage.setItem("user", JSON.stringify(user));
        if (response.status === 202) window.location.href = `${window.location.origin}/rooms`;
    } catch (error) {
        console.log(error);
        loginButton.disabled = false;
        loginButton.innerText = "sign in";
    }
}

async function joinWebChat() {
    const signUpButton = getElementById("signUp");
    signUpButton.disabled = true;
    signUpButton.innerText = "signing up";
    try {
        const name = getValueById("name");
        const email = getValueById("email");
        const city = getValueById("city");
        const password = getValueById("password");
        const profilePicture = getElementById("image").files[0];

        if ((!email && !name && !password) || city || profilePicture) throw Error("Required fields can't be empty.");

        const reqPayload = { name, email, city, password };
        console.log(reqPayload);

        const response = await fetch(`${URI}/v1/users`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(reqPayload),
        });
        const { data: user } = await response.json();
        sessionStorage.setItem("user", JSON.stringify(user));
        if (user && profilePicture) {
            const formData = new FormData();
            formData.append("image", profilePicture, profilePicture.name);

            const requestOptions = {
                method: "POST",
                body: formData,
            };

            await fetch(`${URI}/v1/users/${user._id}/upload`, requestOptions);
        }
        if (response.status === 201) window.location.href = `${window.location.origin}/rooms`;
    } catch (error) {
        console.log(error);
        signUpButton.disabled = false;
        signUpButton.innerText = "sign up";
    }
}

async function removePopUp() {
    window.location.reload();
}

async function signUpForm() {
    try {
        getElementById("form").innerHTML = `<div class="card-body" style="padding: 0px;">
          <form class="row g-3">
    <div class="col-12">

        <label for="image">
             
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path fill-rule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>
        </label>
        <input type="file" id="image" name="image" accept="image/*" hidden>
    </div>
    <div class="col-md-6">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" placeholder="john smith" autocomplete="off">
    </div>
    <div class="col-md-6">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" autocomplete="off">
    </div>
    <div class="col-12">
        <label for="address" class="form-label">Address</label>
        <input type="text" class="form-control" id="address" placeholder="1234 Main St" autocomplete="off">
    </div>
    <div class="col-12">
        <label for="city" class="form-label">City</label>
        <input type="text" class="form-control" id="city" autocomplete="off">
    </div>
    <div class="col-12">
      <label for="address" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" placeholder="********" autocomplete="off">
    </div>
    <div class="d-grid gap-3">
            <button
              class="btn btn-sm btn-success"
              type="button"
              id= "signUp"
              onclick="joinWebChat()"
            >
              Join Web Chat
            </button>
            <button
              class="btn btn-sm btn-primary"
              type="button"
              onclick="removePopUp()"
            >
              Cancel
            </button>
          </div>
          </form>
        </div>`;
    } catch (error) {
        console.log(error);
    }
}
