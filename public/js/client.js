"use strict";

const socket = io();
const URI = "http://localhost:3000/api/v1";
let scroll = 0;
const getGroupIdFromSession = sessionStorage.getItem("groupId");
let imageIdCount = 1;

const getValueById = (id) => document.getElementById(id).value;
const getElementById = (id) => document.getElementById(id);
const setValueById = (id) => (document.getElementById(id).value = "");

let sessionUser = JSON.parse(sessionStorage.getItem("user"));
let token = sessionUser.tokens[0].token;

async function getToken() {
    try {
        const email = sessionUser.email;

        const response = await fetch(`${URI}/users/email/${email}`, {
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

async function messageHandler() {
    try {
        socket.on("message", async ({ message, userId, groupId }) => {
            const response = await fetch(`${URI}/users/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) getToken();

            const { user } = await response.json();

            const currentGroupId = getValueById("groupId");

            if (currentGroupId === groupId) {
                let backgroundColor = "rgb(0, 100, 67)";
                let textColor = "white";
                const sessionUser = JSON.parse(sessionStorage.getItem("user"));
                if (sessionUser.email == user.email) {
                    backgroundColor = "white";
                    textColor = "black";
                }

                const image = user.profilePicture.data;

                const base64Image = btoa(String.fromCharCode.apply(null, image.data));
                const dataUrl = `data:image/${image.type};base64,${base64Image}`;
                const img = new Image();
                img.src = dataUrl;

                const width = 25 + (message.length * 50) / 100;
                const displayMessage = `
        <tr>
          <td style=" padding-left: 20px; padding-top: 10px; padding-bottom: 10px; margin: 5px; font-size: 18px; background-color: ${backgroundColor}; border-radius: 20px; display: table-caption; padding-right: 21px; color:${textColor};width: ${width}vh">
            <div class="section" style="display: flex;flex-direction: row;">
            <div class="image" style="padding-right: 20px;">
              <img
                class="image"
                id="${user._id}-${imageIdCount}"
                height="30"
                width="30"
                style="border-radius: 60px;"
              />
            </div>
            <div class="text">${user.email}</div>
            </div>
            <div style="padding-top: 5px;padding-left: 15px;">${message}</div>
          </td>
        </tr>`;

                getElementById("chatMessage").innerHTML += displayMessage;
                getElementById("chat-history").scrollTop = getElementById("chat-history").scrollHeight;
                getElementById(`${user._id}-${imageIdCount}`).src = img.src;
                getElementById(`${user._id}-${imageIdCount}`).style.height = "100";
                getElementById(`${user._id}-${imageIdCount}`).style.width = "100";
                imageIdCount++;
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function locationHandler() {
    socket.on("location", async ({ id, location }) => {
        const response = await fetch(`${URI}/users/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) getToken();

        const { user } = await response.json();
        console.log(user);

        let backgroundColor = "rgb(0, 100, 67)";
        let textColor = "white";
        const sessionUser = JSON.parse(sessionStorage.getItem("user"));
        if (sessionUser.email == user.email) {
            backgroundColor = "white";
            textColor = "black";
        }

        const image = user.profilePicture.data;

        const base64Image = btoa(String.fromCharCode.apply(null, image.data));
        const dataUrl = `data:image/${image.type};base64,${base64Image}`;
        const img = new Image();
        img.src = dataUrl;

        const displayMessage = `
    <tr>
      <td style=" padding-left: 20px; padding-top: 10px; padding-bottom: 10px; margin: 5px; font-size: 18px; background-color: ${backgroundColor}; border-radius: 20px; display: table-caption; padding-right: 21px; color:${textColor};width: 25vh">
        <div class="section" style="display: flex;flex-direction: row;">
        <div class="image" style="padding-right: 20px;">
          <img
            class="image"
            id="${user._id}-${imageIdCount}"
            height="30"
            width="30"
            style="border-radius: 60px;"
          />
        </div>
        <div class="text">${user.email}</div>
        </div>
          <div style="padding-top: 5px;padding-left: 15px;"><a href="${location}" target="_blank"">my location</a>
        </div>
    </td>
  </tr>`;
        getElementById("chatMessage").innerHTML += displayMessage;
        getElementById("chat-history").scrollTop = getElementById("chat-history").scrollHeight;
        getElementById(`${user._id}-${imageIdCount}`).src = img.src;
        getElementById(`${user._id}-${imageIdCount}`).style.height = "100";
        getElementById(`${user._id}-${imageIdCount}`).style.width = "100";
        imageIdCount++;
    });
}

async function messageSend() {
    try {
        const message = getValueById("message");
        // if (!message) throw new Error("Message can't be empty");
        const userId = getValueById("_id");
        const groupId = getValueById("groupId");
        console.log(message);
        const dataToSend = { message, userId, groupId };

        // store value of image upload by input file tag in variable
        const response = await fetch(`${URI}/message`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend),
        });

        if (response.status === 401) {
            getToken();
            return messageSend();
        }

        const { savedMessage } = await response.json();
        socket.emit("message", savedMessage);
        setValueById("message");
        getElementById("message").focus();
    } catch (error) {
        setValueById("message");
        getElementById("message").focus();
        console.log(error);
    }
}

async function sendLocation() {
    try {
        if (!navigator.geolocation) return alert("Not allowed");
        const id = getValueById("_id");
        navigator.geolocation.getCurrentPosition(async (position) => {
            const location = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;

            const userId = getValueById("_id");
            const groupId = getValueById("groupId");
            const dataToSend = { message: location, userId, groupId };

            const response = await fetch(`${URI}/message`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.status === 401) {
                getToken();
                return sendLocation();
            }

            const { savedMessage } = await response.json();
            socket.emit("location", {
                id,
                location,
            });
        });
    } catch (error) {
        setValueById("message");
        getElementById("message").focus();
        console.log(error);
    }
}

(async () => {
    await messageHandler();
    await locationHandler();
})();

async function setDefault() {
    const getGroupIdFromSession = sessionStorage.getItem("groupId");
    const groupIdArray = getGroupIdFromSession.split(",");
    for (const groupId of groupIdArray) {
        getElementById(groupId).style.backgroundColor = "whitesmoke";
        getElementById(groupId).style.color = "black";
    }
}

async function change(id) {
    getElementById(id).style.backgroundColor = "rgb(0, 100, 67)";
    getElementById(id).style.color = "white";
}

async function previousMessage(status, messages, user) {
    if (status === 200) {
        for (const message of messages) {
            let messageText = message.message;
            let backgroundColor = "white";
            let textColor = "black";
            if (sessionUser.email !== message.messagedBy.email) {
                backgroundColor = "rgb(0, 100, 67)";
                textColor = "white";
            }
            let width = 25 + (messageText.length * 80) / 100;
            if (message.message.includes("https")) {
                messageText = `<a href='${message.message}' target="_blank" >location</a>`;
                width = 30;
            }

            const image = message.messagedBy.profilePicture.data;

            const base64Image = btoa(String.fromCharCode.apply(null, image.data));
            const dataUrl = `data:image/${image.type};base64,${base64Image}`;
            const img = new Image();
            img.src = dataUrl;
            const displayMessage = `
              <tr><td style=" padding-left: 20px; padding-top: 10px; padding-bottom: 10px; margin: 5px; font-size: 18px; background-color: ${backgroundColor}; border-radius: 20px; display: table-caption; padding-right: 21px; color:${textColor};width: ${width}vh">
                <div class="section" style="display: flex;flex-direction: row;">
                  <div class="image" style="padding-right: 20px;">
                    <img class="image" id="${message.messagedBy._id}-${imageIdCount}" height="30" width="30" style="border-radius: 60px;"/>
                  </div>
                  <div class="text">
                  ${message.messagedBy.email}
                  </div>
                </div>  
                <div style="padding-top: 5px;padding-left: 15px;">
                ${messageText} 
                </div>           
              </td></tr>`;
            getElementById("chatMessage").innerHTML += displayMessage;
            getElementById(`${message.messagedBy._id}-${imageIdCount}`).src = img.src;
            getElementById(`${message.messagedBy._id}-${imageIdCount}`).style.height = "100";
            getElementById(`${message.messagedBy._id}-${imageIdCount}`).style.width = "100";
            imageIdCount++;
        }
    } else {
        const displayMessage = `<tr><td style=" padding-left: 20px; padding-top: 10px; padding-bottom: 10px; margin: 5px; font-size: 18px; background-color: ${backgroundColor}; border-radius: 20px; display: table-caption; padding-right: 21px; color:${textColor};width: 40vh">
                    ${user.email}
                    <br />
                     Start converstation
                    </td></tr>`;
        getElementById("chatMessage").innerHTML += displayMessage;
    }
    getElementById("chat-history").scrollTop = getElementById("chat-history").scrollHeight;
}

function setHistory(id, groupName) {
    const history = `<div
              class="name"
              id="name"
            >
            <input
        type="text"
        class="form-control form-control-sm visually-hidden"
        id="groupId"
        value="${id}"
      />
            </div>
            <div
              id="chat"
            >
              <div
                id="welcome"
                style="padding-left: 30px; align-self: self-end"
              ></div>
              <table class="table">
                <thead style="top: 0; position: sticky;">
                  <tr>
                    <th scope="col" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size:23px;";><b> ${groupName}</b></th>
                  </tr>
                </thead>
                <tbody id='chatMessage'>
                </tbody>
              </table>
            </div>`;

    getElementById("chat-history").innerHTML = history;
}

function setActions() {
    const actions = `<div
            class="action"
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-around;
              align-items: center;
              border: solid;
              border-width: 1px;
              border-color: rgb(0, 100, 67);
              border-radius: 70px;
            "
          >
            <div
              id="sendImage"
              class="col-sm-1"
              style="display: flex; flex-direction: row; align-items: center; justify-content: space-around"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                id="location"
                fill="currentColor"
                class="bi bi-geo-alt"
                viewBox="0 0 16 16"
                onclick="show('location', sendLocation)"
              >
                <path
                  d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"
                />
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              <input type="file" id="upload" hidden />
              <label for="upload" style="padding-left: 10px">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  id="image"
                  height="28"
                  fill="currentColor"
                  class="bi bi-image"
                  viewBox="0 0 16 16"
                  onclick="show('image')"
                >
                  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  <path
                    d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"
                  />
                </svg>
              </label>
            </div>
            <div class="col-sm-9" style="padding-left: 15px">
              <input
                type="text"
                class="form-control"
                id="message"
                placeholder="Enter your message..."
                autocomplete="off"
                style="outline: none; box-shadow: none; border: none; height: 50px; font: 18px sans-serif"
              />
            </div>
            <div class="col-sm-1" style="display: flex; flex-direction: row; justify-content: space-around">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="send"
                width="28"
                height="28"
                fill="currentColor"
                class="bi bi-arrow-right-square"
                viewBox="0 0 16 16"
                onclick="show('send', messageSend)"
              >
                <path
                  fill-rule="evenodd"
                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                />
              </svg>
            </div>
          </div>`;
    getElementById("chat-action").innerHTML = actions;
}

async function getMessages(id, groupName) {
    try {
        await setDefault();
        await change(id);
        getElementById("chat-history").style = "display: flex; justify-content: none;";
        getElementById("chat-history").innerHTML = "";
        getElementById("chat-action").innerHTML = "";

        const user = JSON.parse(sessionStorage.getItem("user"));
        const response = await fetch(`${URI}/message/group/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const status = response.status;
        if (status === 200) var { savedMessage } = await response.json();
        if (status === 401) {
            await getToken();
            return getMessages(id, groupName);
        }

        setHistory(id, groupName);
        setActions();
        await previousMessage(status, savedMessage, user);
    } catch (error) {
        console.log(error);
        getElementById("chatMessage").innerHTML +=
            `<tr><td style=" padding-left: 20px; padding-top: 10px; padding-bottom: 10px; margin: 5px; font-size: 18px; background-color: rgb(0, 100, 67); border-radius: 20px; display: table-caption; padding-right: 21px; color:white;width: 25vh">
                    ${groupName}
                    <br />
                    Start the Conversation
                    </td></tr>`;
    }
}

async function createGroup() {
    try {
        getElementById("createGroupPopUp").disabled = true;
        getElementById("createGroupPopUp").innerText = "Creating group...";
        const groupName = getValueById("name");
        const description = getValueById("description");
        const room = document.location.href.split("rooms/")[1];

        if (!groupName) throw Error("group name required");

        const response = await fetch(`${URI}/groups`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: groupName, description, room }),
        });
        if (response.status === 201) window.location.reload();
        if (response.status === 401) {
            getToken();
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
        getElementById("createGroupPopUp").disabled = false;
        getElementById("createGroupPopUp").innerText = "Create";
    }
}

async function showPopUp() {
    try {
        await setDefault();
        getElementById("chat-history").style.display = "flex";
        getElementById("chat-history").style.justifyContent = "center";
        getElementById("chat-action").innerHTML = "";
        getElementById("chat-history").innerHTML = `<div
      class="groupPopUp"
      id= "groupPopUp"
      style="display: flex; justify-content: center; padding: 10px"
    >
      <div class="card" style="width: 18rem">
        <div class="card-header">add new group</div>
        <div class="card-body">
          <div class="mb-4">
            <label for="name" class="form-label">Name</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="name"
              placeholder="group name"
              autocomplete="off"
              required
            />
          </div>
          <div class="mb-4">
            <label for="text" class="form-label">description</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="description"
              placeholder="description"
              autocomplete="off"
            />
          </div>
          <div class="d-grid gap-3">
            <button
              class="btn btn-sm btn-success"
              type="button"
              id= "createGroupPopUp"
              onclick="createGroup()"
            >
              Create
            </button>
            <button
              class="btn btn-sm btn-danger"
              type="button"
              onclick="removePopUp()"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>`;
        getElementById("groupPopUp").style.display = "flex";
    } catch (error) {
        console.log(error);
    }
}

async function removePopUp() {
    try {
        getElementById("groupPopUp").style.display = "none";
        getElementById("chat-history").style.justifyContent = "none";
        getElementById("chat-history").style.display = "flex";
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

async function deleteGroup(id) {
    console.log(id);
    const response = await fetch(`${URI}/groups/${id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        window.location.reload();
        console.log("Deleted");
    }
    if (response.status === 401) {
        getToken();
        return deleteGroup(id);
    }
}

async function showDeleteGroupPopUp() {
    try {
        await setDefault();
        const groupId = getValueById("groupId");
        const response = await fetch(`${URI}/groups/${groupId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status !== 200) throw Error("API failed");

        const { group } = await response.json();

        getElementById("chat-history").style.display = "flex";
        getElementById("chat-history").style.justifyContent = "center";
        getElementById("chat-action").innerHTML = "";
        getElementById("chat-history").innerHTML = `<div
          class="groupPopUp"
          id= "groupPopUp"
          style="display: flex; justify-content: center; padding: 10px"
        >
          <div class="card" style="width: 18rem">
            <div class="card-header">Delete ${group.name}</div>
            <div class="card-body">
              
              <div class="d-grid gap-3">
                <button
                  class="btn btn-sm btn-success"
                  type="button"
                  onclick="deleteGroup('${groupId}')"
                >
                  Delete
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  type="button"
                  onclick="removePopUp()"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>`;
        getElementById("groupPopUp").style.display = "flex";
    } catch (error) {
        console.log(error);
    }
}

const show = (id, callback) => {
    getElementById(id).animate({ opacity: 0 }, 500);
    if (callback) callback();
};
