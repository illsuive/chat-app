

const socket = io({
    reconnection: true, // Enable auto-reconnect
    reconnectionAttempts: 5, // Try 5 times before failing
    reconnectionDelay: 2000, // Wait 2s before reconnecting
});

let clientName = document.getElementById("inp1");
let set = document.getElementById("setbutton");
let chatRoom = document.getElementById("chat-room");
let inputField = document.getElementById("inp6");
let typingDiv = document.getElementById("typing");

let setName = () => {
    if (clientName.value.trim()) {
        socket.emit("fetchName", clientName.value);
        clientName.style.display = "none";
        set.style.display = "none";
    }
};

socket.on("setName", (clientName) => {
    let alertDiv = document.createElement("div");
    alertDiv.className = "alert-name";
    alertDiv.innerText = `${clientName}!`;
    chatRoom.append(alertDiv);
});

// Create chat message
function createChatMessage() {
    let messageVal = inputField.value.trim(); // Get updated value
    if (messageVal) {
        socket.emit("fetchMsg", messageVal);
        inputField.value = ""; // Clear input after sending
    }
}

// Handle new message from server
socket.on("newMsg", ({ name, msg }) => {
    let chatMessage = document.createElement("div");
    chatMessage.classList.add("chat-message");

    if (name == clientName.value) {
        chatMessage.classList.add("sender-msg");
    }

    let imgDiv = document.createElement("div");
    imgDiv.classList.add("imgDiv");

    let img = document.createElement("img");
    img.setAttribute("src", "https://randomuser.me/api/portraits/women/48.jpg");
    img.setAttribute("alt", "");
    imgDiv.appendChild(img);

    let secondDiv = document.createElement("div");
    secondDiv.classList.add("second");

    let upperData = document.createElement("div");
    upperData.classList.add("upper-data");

    let nameDiv = document.createElement("div");
    nameDiv.textContent = name;

    let timeDiv = document.createElement("div");
    timeDiv.textContent = `${new Date().toLocaleTimeString()}`;

    upperData.appendChild(nameDiv);
    upperData.appendChild(timeDiv);

    let messageDiv = document.createElement("div");
    messageDiv.textContent = msg;
    messageDiv.classList.add("message-text");

    secondDiv.appendChild(upperData);
    secondDiv.appendChild(messageDiv);

    chatMessage.appendChild(imgDiv);
    chatMessage.appendChild(secondDiv);

    chatRoom.appendChild(chatMessage);
});

// Handle user disconnect
socket.on("userDisconnect", (data) => {
    if (data) {
        let userDisconnectDiv = document.createElement("div");
        userDisconnectDiv.classList.add("disconnect");
        userDisconnectDiv.innerText = `${data} disconnected`;
        chatRoom.append(userDisconnectDiv);
    }
});

// Typing event handlers
inputField.addEventListener("focus", () => {
    socket.emit("fetchTyping", clientName.value);
});

socket.on("setNameTyping", (data) => {
    typingDiv.innerText = `${data} is typing...`;
    typingDiv.style.display = "block";
});

inputField.addEventListener("blur", () => {
    socket.emit("userStop", clientName.value);
});

socket.on("SetEmpty", () => {
    typingDiv.style.display = "none"; // Hide typing indicator
});
