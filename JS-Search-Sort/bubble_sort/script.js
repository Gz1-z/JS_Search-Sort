let data = [45, 10, 30, 20, 5];
let generator = null;
let isSorting = false;

const container = document.getElementById('visualizer');
const logPanel = document.getElementById('logPanel');
const speedInput = document.getElementById('speed');

function render(idx1 = -1, idx2 = -1, isSwapping = false) {
    container.innerHTML = '';
    data.forEach((val, i) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        
        // Highlight logic
        if (i === idx1 || i === idx2) {
            bar.classList.add(isSwapping ? 'swap' : 'active');
        }
        
        bar.style.height = (val * 4) + 'px';
        bar.innerText = val;
        container.appendChild(bar);
    });
}

function addLog(msg, type = '') {
    const item = document.createElement('div');
    item.className = 'log-item ' + type;
    item.innerText = `> ${msg}`;
    logPanel.prepend(item);
}

function updateData() {
    const val = document.getElementById('customInput').value;
    if (val) {
        data = val.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        reset();
    }
}

function randomizeData() {
    data = Array.from({length: 6}, () => Math.floor(Math.random() * 45) + 5);
    reset();
}

function reset() {
    generator = null;
    isSorting = false;
    logPanel.innerHTML = '';
    addLog("Data siap. Gunakan 'Bubble Sort'.");
    render();
}

// Logika Bubble Sort dengan Generator
function* bubbleSort() {
    let n = data.length;
    addLog("Memulai Bubble Sort...", "log-pass");

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            addLog(`Bandingkan ${data[j]} & ${data[j+1]}`);
            yield render(j, j + 1, false);

            if (data[j] > data[j+1]) {
                addLog(`Tukar: ${data[j]} > ${data[j+1]}`, "log-swap");
                [data[j], data[j+1]] = [data[j+1], data[j]];
                yield render(j, j + 1, true);
            }
        }
        addLog(`Angka ${data[n-i-1]} sudah di posisi akhir.`, "log-pass");
        // Secara visual menandai yang sudah sorted bisa dilakukan di render, 
        // tapi untuk kesederhanaan kita log saja.
    }
    addLog("PENGURUTAN SELESAI!", "log-pass");
}

async function startSorting() {
    if (isSorting) return;
    isSorting = true;
    if (!generator) generator = bubbleSort();
    
    let step = generator.next();
    while (!step.done && isSorting) {
        const delay = 1600 - speedInput.value;
        await new Promise(r => setTimeout(r, delay));
        step = generator.next();
    }
    isSorting = false;
}

function nextStep() {
    if (!generator) generator = bubbleSort();
    generator.next();
}

render();
addLog("Visualizer Bubble Sort siap.");