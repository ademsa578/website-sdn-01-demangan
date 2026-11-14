/* =====================================================
   WEBSITE SDN 01 DEMANGAN
   SCRIPT.JS - GABUNGAN AMAN (PDF.JS CANVAS & TERISOLASI)
===================================================== */

// --- 1. Navigasi & Menu Mobile ---
const menu = document.getElementById("menu"), nav = document.querySelector("nav");
if (menu && nav) {
    menu.onclick = () => nav.style.display = nav.style.display === "flex" ? "" : "flex";
    document.querySelectorAll("nav a").forEach(a => a.onclick = () => { if (innerWidth < 901) nav.style.display = "none"; });
}

// --- 2. Demangan AI Assistant ---
const aiButton = document.getElementById("aiButton"), aiBox = document.getElementById("aiBox"), closeAI = document.getElementById("closeAI"), send = document.getElementById("send"), input = document.getElementById("aiInput"), body = document.querySelector(".aiBody");
if (aiButton && aiBox) aiButton.onclick = () => aiBox.style.display = "block";
if (closeAI && aiBox) closeAI.onclick = () => aiBox.style.display = "none";
document.querySelectorAll(".chips button").forEach(b => b.onclick = () => { input.value = b.textContent; send.click(); });

function answer(q) {
    q = q.toLowerCase();
    if (q.includes("profil")) return "Profil sekolah dapat diisi dengan sejarah, visi-misi, kepala sekolah, guru, dan identitas resmi SDN 01 Demangan.";
    if (q.includes("program")) return "Program unggulan pada template: Adiwiyata, PMR, PUSAKA PJOK, dan Kembang Krambil.";
    if (q.includes("ppdb") || q.includes("spmb")) return "Bagian SPMB/PPDB dapat diarahkan ke halaman informasi dan formulir resmi sekolah.";
    if (q.includes("kontak")) return "Kontak resmi sekolah dapat ditambahkan di bagian Kontak setelah data diberikan.";
    return "Terima kasih! Saya adalah Demangan AI. Jawaban dan data sekolah dapat kita sambungkan ke informasi resmi pada tahap berikutnya.";
}

if (send && input && body) {
    send.onclick = () => {
        let q = input.value.trim();
        if (!q) return;
        let u = document.createElement("div"); u.className = "userMsg"; u.textContent = q; body.appendChild(u);
        let a = document.createElement("div"); a.className = "aiAnswer"; a.textContent = answer(q); body.appendChild(a);
        input.value = ""; body.scrollTop = body.scrollHeight;
    };
    input.onkeydown = e => { if (e.key === "Enter") send.click(); };
}

// --- 3. Kepala AI Dapat Diseret ke Mana Saja ---
const bot = document.getElementById("heroAI");
if (bot) {
    let drag = false, offsetX = 0, offsetY = 0;
    bot.addEventListener("pointerdown", e => { drag = true; bot.classList.add("dragging"); bot.setPointerCapture(e.pointerId); const r = bot.getBoundingClientRect(); offsetX = e.clientX - r.left; offsetY = e.clientY - r.top; bot.style.left = r.left + "px"; bot.style.top = r.top + "px"; bot.style.position = "fixed"; });
    bot.addEventListener("pointermove", e => { if (!drag) return; let x = e.clientX - offsetX, y = e.clientY - offsetY; x = Math.max(8, Math.min(innerWidth - bot.offsetWidth - 8, x)); y = Math.max(38, Math.min(innerHeight - bot.offsetHeight - 8, y)); bot.style.left = x + "px"; bot.style.top = y + "px"; });
    function stopDrag() { drag = false; bot.classList.remove("dragging"); }
    bot.addEventListener("pointerup", stopDrag); bot.addEventListener("pointercancel", stopDrag);
    bot.addEventListener("dblclick", () => { aiBox.style.display = "block"; });
}


/* =====================================================
   4. RENDER PDF MENGGUNAKAN PDF.JS (TAMPIL DI HP & TIDAK TERCAMPUR)
===================================================== */
let pdfjsLib = null;

async function initPdfJs() {
    if (!pdfjsLib) {
        // Muat pustaka PDF.js dari CDN resmi secara asinkron
        pdfjsLib = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.mjs");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs";
    }
    return pdfjsLib;
}

// Fungsi utama untuk merender file PDF halaman demi halaman secara vertikal ke bawah
async function renderPdfToContainer(pdfUrl, containerElement) {
    containerElement.innerHTML = `<div style="text-align:center; padding:30px; color:#334155; font-weight:600;">Memuat dokumen PDF...</div>`;
    
    try {
        const lib = await initPdfJs();
        const loadingTask = lib.getDocument(pdfUrl);
        const pdfDoc = await loadingTask.promise;
        
        containerElement.innerHTML = ""; // Bersihkan teks loading

        // Looping untuk merender setiap halaman PDF ke dalam elemen <canvas> terpisah
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const scale = 1.5; // Kualitas ketajaman tampilan
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement("canvas");
            canvas.style.display = "block";
            canvas.style.width = "100%";
            canvas.style.height = "auto";
            canvas.style.marginBottom = "15px";
            canvas.style.borderRadius = "8px";
            canvas.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            containerElement.appendChild(canvas);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
        }
    } catch (err) {
        console.error("Gagal merender PDF:", err);
        containerElement.innerHTML = `<div style="text-align:center; padding:30px; color:#dc2626;">Gagal memuat dokumen. Silakan unduh file melalui tombol di atas.</div>`;
    }
}

// --- Otomatisasi saat halaman dimuat ---
document.addEventListener("DOMContentLoaded", function() {
    // 1. Tangkap wadah iframe statis (seperti di halaman 01.2, 01.3, dll) dan ubah jadi kontainer canvas
    const wrappers = document.querySelectorAll('.pdfFrameWrapperFull');
    wrappers.forEach(wrapper => {
        let iframe = wrapper.querySelector('iframe');
        let downloadBtn = wrapper.closest('.pdfFullCard')?.querySelector('.pdfDownloadBtn');
        
        if (iframe && downloadBtn) {
            let pdfUrl = downloadBtn.getAttribute('href');
            if (pdfUrl) {
                // Buat kotak kontainer baru khusus untuk canvas vertikal
                let container = document.createElement('div');
                container.className = "pdfCanvasContainer";
                container.style.cssText = "width:100%; background:#f8fafc; padding:10px; border-radius:12px; overflow-y:auto;";
                
                iframe.replaceWith(container);
                renderPdfToContainer(pdfUrl, container);
            }
        }
    });

    // 2. Tangkap klik kartu interaktif (seperti halaman 01.1 atau 01.11 yang punya banyak pilihan file)
    document.body.addEventListener("click", function(e) {
        let target = e.target.closest('.pdfCard');
        if (!target) return;

        let onClickAttr = target.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes('showPdf')) {
            let match = onClickAttr.match(/showPdf\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);
            if (match) {
                let pdfUrl = match[1];
                let titleText = match[2];
                e.preventDefault();
                openCleanPdfViewer(pdfUrl, titleText, target);
            }
        }
    });
});

// Fungsi Popup/Kotak Interaktif yang Aman dan Terisolasi per File
function openCleanPdfViewer(pdfUrl, titleText, element) {
    let viewerBox = document.getElementById('pdfViewerBox');
    
    if (!viewerBox) {
        let container = document.querySelector('.pkksWrap') || document.querySelector('main') || document.body;
        viewerBox = document.createElement('div');
        viewerBox.id = 'pdfViewerBox';
        viewerBox.style.cssText = "background:white; border:1px solid #cbd5e1; border-radius:16px; padding:20px; box-shadow:0 10px 25px rgba(0,0,0,0.1); margin-top:30px; margin-bottom:40px; display:block;";
        viewerBox.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; font-weight:700; font-size:16px; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                <span id="pdfTitleText">Memuat Dokumen...</span>
                <span style="font-size:13px; color:#087f68; cursor:pointer; font-weight:bold;" onclick="closeCleanPdfViewer()">Tutup [✕]</span>
            </div>
            <div id="cleanPdfContent" style="width:100%; max-height:75vh; overflow-y:auto; background:#f8fafc; padding:15px; border-radius:8px;"></div>
        `;
        container.appendChild(viewerBox);
    } else {
        viewerBox.style.display = "block";
    }

    document.getElementById('pdfTitleText').innerText = "📁 " + titleText;
    let contentContainer = document.getElementById('cleanPdfContent');

    // Render file PDF secara spesifik milik tombol yang diklik saja (tidak tercampur)
    renderPdfToContainer(pdfUrl, contentContainer);

    document.querySelectorAll('.pdfCard').forEach(c => c.classList.remove('active'));
    if (element) element.classList.add('active');

    viewerBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeCleanPdfViewer() {
    const viewerBox = document.getElementById('pdfViewerBox');
    if (viewerBox) viewerBox.style.display = "none";
    document.querySelectorAll('.pdfCard').forEach(card => card.classList.remove('active'));
}

// Fallback agar fungsi showPdf lama tetap aman
window.showPdf = function(pdfUrl, titleText, element) {
    openCleanPdfViewer(pdfUrl, titleText, element);
};
