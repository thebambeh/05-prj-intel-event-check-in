"use strict";

const ATTENDANCE_GOAL = 50;
let count = 0;

const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

const waterCountEl = document.getElementById("waterCount");
const zeroCountEl = document.getElementById("zeroCount");
const powerCountEl = document.getElementById("powerCount");

const STORAGE_TOTAL = "intel_total";
const STORAGE_WATER = "intel_water";
const STORAGE_ZERO = "intel_zero";
const STORAGE_POWER = "intel_power";

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

  if (count === ATTENDANCE_GOAL) {
    const winner = getWinningTeamName();

    if (winner === "a tie") {
      greeting.textContent =
        "🎉 Goal reached! It’s a tie between teams. Great turnout!";
      return;
    }

    greeting.textContent = `🎉 Goal reached! Winning team: ${winner}!`;
  }

  form.reset();
  saveCounts();
});

function getWinningTeamName() {
  const water = parseInt(waterCountEl.textContent);
  const zero = parseInt(zeroCountEl.textContent);
  const power = parseInt(powerCountEl.textContent);

  const max = Math.max(water, zero, power);

  const winners = [];
  if (water === max) winners.push("Team Water Wise");
  if (zero === max) winners.push("Team Net Zero");
  if (power === max) winners.push("Team Renewables");

  if (winners.length > 1) {
    return "a tie";
  }

  return winners[0];
}

function saveCounts() {
  localStorage.setItem(STORAGE_TOTAL, String(count));
  localStorage.setItem(STORAGE_WATER, waterCountEl.textContent);
  localStorage.setItem(STORAGE_ZERO, zeroCountEl.textContent);
  localStorage.setItem(STORAGE_POWER, powerCountEl.textContent);
}

function loadCounts() {
  const savedTotal = parseInt(localStorage.getItem(STORAGE_TOTAL));
  const savedWater = parseInt(localStorage.getItem(STORAGE_WATER));
  const savedZero = parseInt(localStorage.getItem(STORAGE_ZERO));
  const savedPower = parseInt(localStorage.getItem(STORAGE_POWER));

  if (!isNaN(savedTotal)) count = savedTotal;
  if (!isNaN(savedWater)) waterCountEl.textContent = savedWater;
  if (!isNaN(savedZero)) zeroCountEl.textContent = savedZero;
  if (!isNaN(savedPower)) powerCountEl.textContent = savedPower;

  attendeeCount.textContent = count;

  const percentage = Math.min((count / ATTENDANCE_GOAL) * 100, 100);
  progressBar.style.width = percentage + "%";
}

loadCounts();
