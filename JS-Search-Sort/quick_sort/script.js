let data = [40, 10, 50, 30, 20]; // Default awal
const container = document.getElementById("array-container");
const logList = document.getElementById("step-log");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function writeLog(message, color = "#333") {
    const li = document.createElement("li");
    li.innerText = message;
    li.style.color = color;
    logList.prepend(li);
}

// Fungsi untuk mengambil input dari user
function setCustomArray() {
    const inputVal = document.getElementById("user-input").value;
    if (!inputVal) return alert("Masukkan angka dipisahkan koma!");
    
    // Ubah string "10, 20, 30" menjadi array [10, 20, 30]
    const customData = inputVal.split(',')
                               .map(x => parseInt(x.trim()))
                               .filter(x => !isNaN(x));
    
    if (customData.length === 0) return alert("Format salah!");
    data = customData;
    renderArray();
    writeLog("Array diperbarui oleh pengguna.");
}

function renderArray() {
    container.innerHTML = "";
    data.forEach((val, i) => {
        const bar = document.createElement("div");
        // Skala tinggi (maksimal 150px agar rapi)
        const maxHeight = Math.max(...data);
        const heightVal = (val / maxHeight) * 150;
        
        bar.style.height = `${heightVal}px`;
        bar.classList.add("bar");
        bar.innerText = val;
        bar.setAttribute("id", `bar-${i}`);
        container.appendChild(bar);
    });
}

async function quickSort(arr, start, end) {
    if (start >= end) {
        if (start === end) document.getElementById(`bar-${start}`).style.backgroundColor = "#27ae60";
        return;
    }
    let index = await partition(arr, start, end);
    await quickSort(arr, start, index - 1);
    await quickSort(arr, index + 1, end);
}

async function partition(arr, start, end) {
    let pivotValue = arr[end];
    let pivotIndex = start;
    
    document.getElementById(`bar-${end}`).style.backgroundColor = "#e74c3c"; // Merah (Pivot)
    writeLog(`Pilih pivot: ${pivotValue}`, "#e74c3c");

    for (let i = start; i < end; i++) {
        document.getElementById(`bar-${i}`).style.backgroundColor = "#f1c40f"; // Kuning (Cek)
        
        if (arr[i] < pivotValue) {
            writeLog(`${arr[i]} < ${pivotValue}, geser ke kiri.`);
            await swap(arr, i, pivotIndex);
            pivotIndex++;
        }
        await sleep(600);
        document.getElementById(`bar-${i}`).style.backgroundColor = "#3498db";
    }
    
    writeLog(`Pivot ${pivotValue} pindah ke posisi tetap.`, "#27ae60");
    await swap(arr, pivotIndex, end);
    document.getElementById(`bar-${pivotIndex}`).style.backgroundColor = "#27ae60"; // Hijau
    
    return pivotIndex;
}

async function swap(arr, a, b) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;

    const barA = document.getElementById(`bar-${a}`);
    const barB = document.getElementById(`bar-${b}`);
    
    // Update tampilan
    const maxHeight = Math.max(...data);
    barA.style.height = `${(arr[a] / maxHeight) * 150}px`;
    barA.innerText = arr[a];
    barB.style.height = `${(arr[b] / maxHeight) * 150}px`;
    barB.innerText = arr[b];
    await sleep(100);
}

async function startSort() {
    logList.innerHTML = "";
    await quickSort(data, 0, data.length - 1);
    writeLog("SELESAI!", "#27ae60");
}

function resetArray() {
    data = data.sort(() => Math.random() - 0.5);
    renderArray();
    logList.innerHTML = "<li>Array diacak ulang.</li>";
}

// Munculkan array pertama kali
renderArray();