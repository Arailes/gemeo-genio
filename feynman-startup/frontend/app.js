const API = "https://SEU-BACKEND.onrender.com";

async function generate() {
  const text = document.getElementById("input").value;

  const res = await fetch(API + "/generate", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  document.getElementById("output").innerText = data.result;
}

async function schedule() {
  const text = document.getElementById("input").value;

  const res = await fetch(API + "/schedule", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  document.getElementById("output").innerText = data.result;
}

async function subscribe() {
  const res = await fetch(API + "/create-checkout", { method: "POST" });
  const data = await res.json();
  window.location.href = data.url;
}