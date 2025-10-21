// static/app.js
const diceRow = document.getElementById('diceRow');
const totalEl = document.getElementById('total');
const form = document.getElementById('controls');
const rollBtn = document.getElementById('rollBtn');
const statusEl = document.getElementById('status');
const countInput = document.getElementById('count');


form.addEventListener('submit', async (e) => {
e.preventDefault();
const count = Math.max(1, Math.min(10, parseInt(countInput.value || '2', 10)));
rollBtn.disabled = true;
statusEl.textContent = 'Rolling…';


// add temporary rolling state to current dice
[...diceRow.children].forEach(d => d.classList.add('rolling'));


try {
const res = await fetch(`/api/roll?count=${count}`);
if (!res.ok) throw new Error('HTTP ' + res.status);
const data = await res.json();


renderDice(data.dice);
totalEl.textContent = `Total: ${data.total}`;
statusEl.textContent = `Rolled ${data.dice.length} dice.`;
} catch (err) {
statusEl.textContent = 'Error: ' + err.message;
} finally {
// allow CSS animation to finish before unlocking
setTimeout(() => {
[...diceRow.children].forEach(d => d.classList.remove('rolling'));
rollBtn.disabled = false;
}, 450);
}
});


function renderDice(values) {
diceRow.innerHTML = '';
values.forEach(v => diceRow.appendChild(makeDie(v)));
}


function makeDie(value) {
const die = document.createElement('div');
die.className = 'die rolling';
const face = document.createElement('div');
face.className = 'face';


// 3x3 grid, decide where to put pips per value
const positions = pipPositions(value);
for (let i = 0; i < 9; i++) {
const cell = document.createElement('span');
if (positions.has(i)) {
const pip = document.createElement('div');
pip.className = 'pip';
cell.appendChild(pip);
}
face.appendChild(cell);
}
die.appendChild(face);
return die;
}


// Return a Set of indices (0..8) for the 3x3 grid where pips should appear
function pipPositions(n) {
const C = 4; // center index in 3x3 (0..8)
const TL = 0, TR = 2, BL = 6, BR = 8, ML = 3, MR = 5, TM = 1, BM = 7; // helpers
switch (n) {
case 1: return new Set([C]);
case 2: return new Set([TL, BR]);
case 3: return new Set([TL, C, BR]);
case 4: return new Set([TL, TR, BL, BR]);
case 5: return new Set([TL, TR, C, BL, BR]);
case 6: return new Set([TL, ML, BL, TR, MR, BR]);
default: return new Set([C]);
}
}


renderDice([3, 4]);