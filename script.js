// --- 1. Navigasi & Menu Mobile ---
const menu=document.getElementById("menu"),nav=document.querySelector("nav");
menu.onclick=()=>nav.style.display=nav.style.display==="flex"?"":"flex";
document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>{if(innerWidth<901)nav.style.display="none"});


// --- 2. Demangan AI Assistant ---
const aiButton=document.getElementById("aiButton"),aiBox=document.getElementById("aiBox"),closeAI=document.getElementById("closeAI"),send=document.getElementById("send"),input=document.getElementById("aiInput"),body=document.querySelector(".aiBody");
aiButton.onclick=()=>aiBox.style.display="block";closeAI.onclick=()=>aiBox.style.display="none";
document.querySelectorAll(".chips button").forEach(b=>b.onclick=()=>{input.value=b.textContent;send.click()});

function answer(q){
    q=q.toLowerCase();
    if(q.includes("profil"))return"Profil sekolah dapat diisi dengan sejarah, visi-misi, kepala sekolah, guru, dan identitas resmi SDN 01 Demangan.";
    if(q.includes("program"))return"Program unggulan pada template: Adiwiyata, PMR, PUSAKA PJOK, dan Kembang Krambil.";
    if(q.includes("ppdb")||q.includes("spmb"))return"Bagian SPMB/PPDB dapat diarahkan ke halaman informasi dan formulir resmi sekolah.";
    if(q.includes("kontak"))return"Kontak resmi sekolah dapat ditambahkan di bagian Kontak setelah data diberikan.";
    return"Terima kasih! Saya adalah Demangan AI. Jawaban dan data sekolah dapat kita sambungkan ke informasi resmi pada tahap berikutnya.";
}

send.onclick=()=>{
    let q=input.value.trim();
    if(!q)return;
    let u=document.createElement("div");
    u.className="userMsg";
    u.textContent=q;
    body.appendChild(u);
    
    let a=document.createElement("div");
    a.className="aiAnswer";
    a.textContent=answer(q);
    body.appendChild(a);
    input.value="";
    body.scrollTop=body.scrollHeight;
};

input.onkeydown=e=>{if(e.key==="Enter")send.click()};


// --- 3. Kepala AI Dapat Diseret ke Mana Saja ---
const bot=document.getElementById("heroAI");
if(bot){
    let drag=false,offsetX=0,offsetY=0;
    bot.addEventListener("pointerdown",e=>{drag=true;bot.classList.add("dragging");bot.setPointerCapture(e.pointerId);const r=bot.getBoundingClientRect();offsetX=e.clientX-r.left;offsetY=e.clientY-r.top;bot.style.left=r.left+"px";bot.style.top=r.top+"px";bot.style.position="fixed"});
    bot.addEventListener("pointermove",e=>{if(!drag)return;let x=e.clientX-offsetX,y=e.clientY-offsetY;x=Math.max(8,Math.min(innerWidth-bot.offsetWidth-8,x));y=Math.max(38,Math.min(innerHeight-bot.offsetHeight-8,y));bot.style.left=x+"px";bot.style.top=y+"px"});
    function stopDrag(){drag=false;bot.classList.remove("dragging")}
    bot.addEventListener("pointerup",stopDrag);bot.addEventListener("pointercancel",stopDrag);
    bot.addEventListener("dblclick",()=>{aiBox.style.display="block"});
}


// --- 4. Solusi Universal Interceptor PDF (Otomatis Aktif di Seluruh Halaman) ---
document.addEventListener("DOMContentLoaded", function() {
    // Tangkap semua klik pada elemen kartu atau link yang berformat PDF
    document.body.addEventListener("click", function(e) {
        // Cari apakah yang diklik adalah kartu PDF atau link yang mengarah ke file .pdf
        let card = e.target.closest('.pdfCard, a[href$=".pdf"]');
        if (!card) return;

        let pdfUrl = "";
        let titleText = "Dokumen PDF";

        // Jika bentuknya kartu dengan atribut onclick (seperti 01.1)
        if (card.classList.contains('pdfCard')) {
            let onClickAttr = card.getAttribute('onclick');
            if (onClickAttr && onClickAttr.includes('showPdf')) {
                let match = onClickAttr.match(/showPdf\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);
                if (match) {
                    pdfUrl = match[1];
                    titleText = match[2];
                }
            }
            // Batalkan aksi bawaan agar tidak bentrok
            e.preventDefault();
        } 
        // Jika bentuknya link biasa berakhiran .pdf
        else if (card.tagName === 'A') {
            pdfUrl = card.getAttribute('href');
            titleText = card.innerText || "Dokumen PDF";
            e.preventDefault();
        }

        if (pdfUrl) {
            openGlobalPdfViewer(pdfUrl, titleText, card);
        }
    });
});

// Fungsi Global untuk Membuka Viewer PDF.js di Semua Halaman
function openGlobalPdfViewer(pdfUrl, titleText, element) {
    let viewerBox = document.getElementById('pdfViewerBox');
    
    // Jika di halaman tersebut belum ada kotak viewer, buat secara otomatis di bawah grid dokumen
    if (!viewerBox) {
        let grid = document.querySelector('.pdfGrid') || document.querySelector('.grid') || document.querySelector('main');
        if (!grid) return;
        
        viewerBox = document.createElement('div');
        viewerBox.id = 'pdfViewerBox';
        viewerBox.className = 'pdfViewerContainer';
        viewerBox.style.cssText = "background:white; border:1px solid #cbd5e1; border-radius:16px; padding:20px; box-shadow:0 10px 25px #0f172a0a; margin-top:30px; margin-bottom:40px; display:block;";
        viewerBox.innerHTML = `
            <div class="pdfViewerHeader" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; font-weight:700; font-size:16px; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
                <span id="pdfTitleText">Memuat Dokumen...</span>
                <span style="font-size:13px; color:#087f68; cursor:pointer; font-weight:bold;" onclick="closeGlobalPdfViewer()">Tutup [✕]</span>
            </div>
            <iframe id="pdfFrame" style="width:100%; height:650px; border:none; border-radius:8px; background:#f8fafc;" src=""></iframe>
        `;
        grid.parentNode.insertBefore(viewerBox, grid.nextSibling);
    } else {
        viewerBox.style.display = "block";
    }

    const pdfFrame = document.getElementById('pdfFrame');
    const titleTextEl = document.getElementById('pdfTitleText');

    // Ubah URL relatif menjadi absolute URL agar aman dibaca oleh PDF.js
    let fullUrl = pdfUrl;
    if (!pdfUrl.startsWith('http')) {
        fullUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + pdfUrl;
    }
    
    const viewerUrl = "https://mozilla.github.io/pdf.js/web/viewer.html?file=" + encodeURIComponent(fullUrl);

    if (pdfFrame) pdfFrame.src = viewerUrl;
    if (titleTextEl) titleTextEl.innerText = "📁 " + titleText;
    viewerBox.classList.add('active');

    // Tandai kartu aktif jika ada
    document.querySelectorAll('.pdfCard').forEach(c => c.classList.remove('active'));
    if (element && element.classList.contains('pdfCard')) element.classList.add('active');

    viewerBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Fungsi Global untuk Menutup Penampil PDF
window.closeGlobalPdfViewer = function() {
    const viewerBox = document.getElementById('pdfViewerBox');
    const pdfFrame = document.getElementById('pdfFrame');
    if (pdfFrame) pdfFrame.src = "";
    if (viewerBox) {
        viewerBox.classList.remove('active');
        viewerBox.style.display = "none";
    }
    document.querySelectorAll('.pdfCard').forEach(card => card.classList.remove('active'));
};

// Cadangan fungsi showPdf agar halaman lama tidak error
window.showPdf = function(pdfUrl, titleText, element) {
    openGlobalPdfViewer(pdfUrl, titleText, element);
};
