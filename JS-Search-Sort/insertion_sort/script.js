let data = [40, 20, 50, 10, 30];
let generator = null;
let isSorting = false;

const container = document.getElementById('visualizer');
const logPanel = document.getElementById('logPanel');
const speedInput = document.getElementById('speed');

function render(keyIdx = -1, compareIdx = -1) {
    container.innerHTML = '';
    data.forEach((val, i) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        if (i === keyIdx) bar.classList.add('key');
        if (i === compareIdx) bar.classList.add('comparing');
        bar.style.height = (val * 3) + 'px';
        bar.innerText = val;
        container.appendChild(bar);
    });
}

function addLog(msg, highlight = false) {
    const item = document.createElement('div');
    item.className = 'log-item' + (highlight ? ' log-highlight' : '');
    item.innerText = `> ${msg}`;
    logPanel.prepend(item); // Pesan terbaru di atas
}

function updateData() {
    const val = document.getElementById('customInput').value;
    if (val) {
        data = val.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        reset();
    }
}

function randomizeData() {
    data = Array.from({length: 6}, () => Math.floor(Math.random() * 50) + 5);
    reset();
}

function reset() {
    generator = null;
    isSorting = false;
    logPanel.innerHTML = '';
    addLog("Data siap. Klik 'Mulai' atau 'Langkah'.");
    render();
}

function* insertionSort() {
    for (let i = 1; i < data.length; i++) {
        let key = data[i];
        let j = i - 1;
        addLog(`Pilih ${key} sebagai 'Key'`, true);
        yield render(i);

        while (j >= 0 && data[j] > key) {
            addLog(`Bandingkan: ${data[j]} > ${key}? Ya, geser.`);
            yield render(i, j);
            data[j + 1] = data[j];
            j--;
            yield render(-1, j + 1);
        }
        data[j + 1] = key;
        addLog(`Taruh ${key} di posisi baru.`);
        yield render();
    }
    addLog("PENGURUTAN SELESAI!", true);
    document.querySelectorAll('.bar').forEach(b => b.classList.add('done'));
}

async function startSorting() {
    if (isSorting) return;
    isSorting = true;
    if (!generator) generator = insertionSort();
    
    let step = generator.next();
    while (!step.done && isSorting) {
        const delay = 1600 - speedInput.value; // Inversi slider: kanan = cepat
        await new Promise(r => setTimeout(r, delay));
        step = generator.next();
    }
    isSorting = false;
}

function nextStep() {
    if (!generator) generator = insertionSort();
    generator.next();
}

// Inisialisasi awal
render();
addLog("Visualizer siap.");