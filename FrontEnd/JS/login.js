const token = window.sessionStorage.getItem("token");

document.getElementById('logout-button').style.display = 'none';

document.getElementById("to-log-in").addEventListener("click", async function(event) {
    event.preventDefault()

    let usernameInput = document.getElementById("username").value
    let passwordInput = document.getElementById("password").value

    const id = await fetch("http://localhost:5678/api/users/login", {
            body: `{"email": "${usernameInput}", "password": "${passwordInput}"}`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "POST"
        })
        .then(response => response.json())

    if (id.userId === 1) {
        window.location.href = "/FrontEnd/index.html";
        const token = id.token;
        window.sessionStorage.setItem("token", token);     
    } else {
        const alert = document.querySelector(".alert");
        alert.style.display = "inline";
    }
});