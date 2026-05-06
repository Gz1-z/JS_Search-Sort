let data = [];
const container = document.getElementById('arrayVisual');
const statusMsg = document.getElementById('statusMsg');
const btnMulai = document.getElementById('btnMulai');

function generateArray() {
    const inputRaw = document.getElementById('arrayInput').value;
    // Ambil data dan URUTKAN (penting!)
    data = inputRaw.split(',')
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b); 

    renderBoxes();
    statusMsg.innerText = "Data terurut siap. Mari kita cari!";
    btnMulai.disabled = false;
}

function renderBoxes() {
    container.innerHTML = '';
    data.forEach((val, index) => {
        const div = document.createElement('div');
        div.className = 'box';
        div.id = `box-${index}`;
        div.innerText = val;
        container.appendChild(div);
    });
}

async function mulaiBinarySearch() {
    const target = parseInt(document.getElementById('targetInput').value);
    btnMulai.disabled = true;

    let kiri = 0;
    let kanan = data.length - 1;

    while (kiri <= kanan) {
        let tengah = Math.floor((kiri + kanan) / 2);

        // 1. Visualisasi: Tandai area pencarian dan titik tengah
        updateVisual(kiri, kanan, tengah);
        statusMsg.innerText = `Range: indeks ${kiri} sampai ${kanan}. Titik tengah: indeks ${tengah} (Nilai: ${data[tengah]})`;
        
        await new Promise(r => setTimeout(r, 1200));

        // 2. Cek Kondisi
        if (data[tengah] === target) {
            document.getElementById(`box-${tengah}`).classList.add('found');
            statusMsg.innerHTML = `<strong>DITEMUKAN!</strong> Angka ${target} ada di indeks ke-${tengah}.`;
            return;
        }

        if (data[tengah] < target) {
            statusMsg.innerText = `${data[tengah]} terlalu KECIL. Buang sisi kiri.`;
            kiri = tengah + 1;
        } else {
            statusMsg.innerText = `${data[tengah]} terlalu BESAR. Buang sisi kanan.`;
            kanan = tengah - 1;
        }
        
        await new Promise(r => setTimeout(r, 800));
    }

    statusMsg.innerText = "Data tidak ditemukan.";
}

function updateVisual(low, high, mid) {
    data.forEach((_, i) => {
        const el = document.getElementById(`box-${i}`);
        el.className = 'box'; // reset
        if (i < low || i > high) {
            el.classList.add('eliminated');
        } else if (i === mid) {
            el.classList.add('mid');
        } else {
            el.classList.add('in-range');
        }
    });
}