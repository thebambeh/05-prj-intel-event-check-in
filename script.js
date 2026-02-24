"use strict";

const ATTENDANCE_GOAL = 50;
let count = 0;

const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (name === "" || team === "") {
    return;
  }

  console.log(name, teamName);

  count++;
  console.log(`Total check-ins: ${count}`);

  const percentage = Math.min((count / ATTENDANCE_GOAL) * 100, 100);
  progressBar.style.width = percentage + "%";

  const teamCounter = document.getElementById(`${team}Count`);
  const current = parseInt(teamCounter.textContent);
  teamCounter.textContent = current + 1;
  attendeeCount.textContent = count;

  greeting.textContent = `🎉 Welcome, ${name} from ${teamName}!`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  form.reset();
});
