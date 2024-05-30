"use strict";

const baseURI = `${document.location.origin}/api/v1`;
// const URI = "http://localhost:3000/api/v1/users";
let sessionUser = JSON.parse(sessionStorage.getItem("user"));
let token = sessionUser.tokens[0].token;

const getValueById = (id) => document.getElementById(id).value;
const setValueById = (id) => (document.getElementById(id).value = "");
const getElementById = (id) => document.getElementById(id);

function edit(id) {
    sessionStorage.setItem("id", id);
    getElementById("show-image").style.display = "none";
    getElementById("edit-image").style.display = "block";
    getElementById("name-div").style.display = "block";

    getElementById("name").focus();
    getElementById("email").readOnly = false;
    getElementById("name").readOnly = false;
    getElementById("password").readOnly = false;
    getElementById("city").readOnly = false;
    getElementById("edit").innerHTML =
        `<button class="btn btn-sm btn-success" id="save" type="button" onclick="saveDetails()">
                    save
                  </button>
                  <button class="btn btn-sm btn-danger" type="button" onclick="cancel()">Cancel</button>`;
}

function cancel() {
    window.location.reload();
}

async function getToken() {
    try {
        const email = sessionUser.email;
        const response = await fetch(`${baseURI}/users/email/${email}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        });
        const { user } = await response.json();
        delete user.profilePicture;
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionUser = JSON.parse(sessionStorage.getItem("user"));
        token = sessionUser.tokens[0].token;
        // window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

async function saveDetails() {
    try {
        getElementById("save").innerText = "saving...";
        getElementById("save").disabled = true;
        const id = sessionStorage.getItem("id");
        const myHeaders = new Headers();
        myHeaders.append("file", "");

        const imageInput = document.querySelector("input[type=file]");
        const path = imageInput.value;
        if (path) {
            var formdata = new FormData();
            formdata.append("image", imageInput.files[0], path);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
            };

            await fetch(`${baseURI}/users/${id}/upload`, requestOptions);
        }

        const name = getValueById("name");
        const email = getValueById("email");
        const password = getValueById("password");
        const city = getValueById("city");
        console.log("save called");
        const response = await fetch(`${baseURI}/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${sessionUser.tokens[0].token}`,
            },
            body: JSON.stringify({ name, email, city, password }),
        });
        if (response.status === 202) window.location.reload();
        alert("updated");
    } catch (error) {
        console.log(error);
    }
}

async function join(id) {
    try {
        const uri = `${baseURI}/rooms/${id}/user`;
        const response = await fetch(uri, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${sessionUser.tokens[0].token}`,
            },
        });
        if (response.status === 401) {
            getToken();
            return join(id);
        }
        if (response.status !== 202) throw Error("something went wrong");
        document.location.href = `${document.location.href}/${id}`;
    } catch (error) {
        console.log(error);
    }
}

// take the buffer of image and show the image.
function showImage(data) {
    try {
        const base64Image = btoa(String.fromCharCode.apply(null, data.data));
        const dataUrl = `data:image/${data.type};base64,${base64Image}`;

        const img = new Image();
        img.src = dataUrl;

        // append the image to the DOM
        getElementById("image").src = img.src;
        getElementById("image").style.height = "100";
        getElementById("image").style.width = "100";
    } catch (error) {
        console.log(error);
    }
}
(async () => {
    try {
        const userId = getValueById("_id");
        const response = await fetch(`${baseURI}/users/${userId}/image`);
        const { data } = await response.json();
        showImage(data);
    } catch (error) {
        console.log(error);
    }
})();

async function showImagePreview() {
    try {
        const userId = getValueById("_id");
        const response = await fetch(`${baseURI}/users/${userId}/image`);
        const { data } = await response.json();

        const base64Image = btoa(String.fromCharCode.apply(null, data.data));
        const dataUrl = `data:image/${data.type};base64,${base64Image}`;

        const img = new Image();
        img.src = dataUrl;
        getElementById("user-input-form").style.display = "none";
        getElementById("image-preview-class").style.display = "block";
        // append the image to the DOM
        getElementById("image-preview").src = img.src;
        getElementById("image-preview").style.height = "200";
        getElementById("image-preview").style.width = "200";
    } catch (error) {
        console.log(error);
    }
}

function closeImagePopUp() {
    getElementById("image-preview-class").style.display = "none";
    getElementById("user-input-form").style.display = "block";
}
