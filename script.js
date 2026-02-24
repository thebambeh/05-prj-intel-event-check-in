// script.js
// Check-in system for Intel event with team-based attendance
//  tracking and progress visualization.
//
// Version: 02/23/2026
// Author: Intel Team, Guil Hernandez, and Prameswara Wardhana

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
const STORAGE_LIST = "intel_attendee_list";
const resetBtn = document.getElementById("resetBtn");

let attendeeList = [];

const listSection = document.createElement("div");
listSection.style.marginTop = "20px";
listSection.style.paddingTop = "20px";
listSection.style.borderTop = "2px solid #f1f5f9";

const listTitle = document.createElement("h3");
listTitle.textContent = "Attendee List";
listTitle.style.color = "#64748b";
listTitle.style.fontSize = "16px";
listTitle.style.marginBottom = "12px";
listTitle.style.textAlign = "center";

const listEl = document.createElement("ul");
listEl.style.listStyle = "none";
listEl.style.padding = "0";
listEl.style.margin = "0";
listEl.style.display = "grid";
listEl.style.gap = "10px";

listSection.appendChild(listTitle);
listSection.appendChild(listEl);

document.querySelector(".container").appendChild(listSection);

function formatName(rawName) {
  const trimmed = rawName.trim();

  //regex formatting
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return null;
  }

  return trimmed
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function setGreeting(text) {
  greeting.textContent = text;
  greeting.classList.add("success-message");
}

function updateProgress() {
  const percentage = Math.min((count / ATTENDANCE_GOAL) * 100, 100);
  progressBar.style.width = percentage + "%";
}

function getTeamCounterElement(team) {
  return document.getElementById(`${team}Count`);
}

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

function saveList() {
  localStorage.setItem(STORAGE_LIST, JSON.stringify(attendeeList));
}

function loadList() {
  const raw = localStorage.getItem(STORAGE_LIST);
  if (!raw) {
    attendeeList = [];
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      attendeeList = parsed;
      return;
    }
  } catch {}

  attendeeList = [];
}

function renderList() {
  listEl.innerHTML = "";

  for (const entry of attendeeList) {
    const item = document.createElement("li");
    item.style.padding = "12px 14px";
    item.style.border = "1px solid rgba(0, 0, 0, 0.06)";
    item.style.borderRadius = "12px";
    item.style.background = "#ffffff";
    item.style.boxShadow = "0 2px 10px rgba(0,0,0,0.03)";
    item.textContent = `${entry.formattedName} • ${entry.teamName}`;
    listEl.appendChild(item);
  }
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
  updateProgress();

  loadList();
  renderList();

  if (count >= ATTENDANCE_GOAL) {
    const winner = getWinningTeamName();
    if (winner === "a tie") {
      setGreeting("🎉 Goal reached! It’s a tie between teams. Great turnout!");
      return;
    }
    setGreeting(`🎉 Goal reached! Winning team: ${winner}!`);
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formattedName = formatName(nameInput.value);
  const team = teamSelect.value;

  if (!formattedName || team === "") {
    setGreeting("Please enter a valid name (letters only).");
    greeting.style.display = "block";
    return;
  }

  if (count >= ATTENDANCE_GOAL) {
    const winner = getWinningTeamName();
    if (winner === "a tie") {
      setGreeting("🎉 Goal reached! It’s a tie between teams. Great turnout!");
      return;
    }
    setGreeting(`🎉 Goal reached! Winning team: ${winner}!`);
    return;
  }

  const teamName = teamSelect.selectedOptions[0].text;

  count += 1;
  attendeeCount.textContent = count;
  updateProgress();

  const teamCounter = getTeamCounterElement(team);
  const current = parseInt(teamCounter.textContent);
  teamCounter.textContent = current + 1;

  attendeeList.unshift({ formattedName, teamName });
  renderList();

  saveCounts();
  saveList();

  setGreeting(`🎉 Welcome, ${formattedName} from ${teamName}!`);

  if (count >= ATTENDANCE_GOAL) {
    const winner = getWinningTeamName();
    if (winner === "a tie") {
      setGreeting("🎉 Goal reached! It’s a tie between teams. Great turnout!");
    } else {
      setGreeting(`🎉 Goal reached! Winning team: ${winner}!`);
    }
  }

  form.reset();
});

resetBtn.addEventListener("click", function () {
  const ok = confirm(
    "Reset all attendance counts and clear the attendee list?",
  );
  if (!ok) {
    return;
  }
  resetAll();
});

function resetAll() {
  count = 0;
  attendeeList = [];

  attendeeCount.textContent = "0";
  progressBar.style.width = "0%";

  waterCountEl.textContent = "0";
  zeroCountEl.textContent = "0";
  powerCountEl.textContent = "0";

  greeting.style.display = "none";
  greeting.textContent = "";

  renderList();

  localStorage.removeItem(STORAGE_TOTAL);
  localStorage.removeItem(STORAGE_WATER);
  localStorage.removeItem(STORAGE_ZERO);
  localStorage.removeItem(STORAGE_POWER);
  localStorage.removeItem(STORAGE_LIST);

  form.reset();
}

loadCounts();
