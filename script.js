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


// --- 4. SOLUSI GLOBAL UTAMA: Paksa Semua Link/Tombol PDF Tampil di Dalam Web ---
document.addEventListener("DOMContentLoaded", function() {
    // Jalankan pengecekan pada setiap klik di seluruh halaman
    document.body.addEventListener("click", function(e) {
        // Cari apakah yang diklik adalah link berakhiran .pdf atau kartu dengan onclick
        let target = e.target.closest('a, .pdfCard');
        if (!target) return;

        let pdfUrl = "";
        let titleText = "Dokumen PDF";

        // Kasus A: Jika berupa link biasa (tag <a>) yang mengarah ke file .pdf
        if (target.tagName === 'A') {
            let href = target.getAttribute('href');
            if (href && (href.toLowerCase().endsWith('.pdf') || href.includes('assets/'))) {
                pdfUrl = href;
                titleText = target.innerText.trim() || target.getAttribute('title') || "Dokumen PDF";
                e.preventDefault(); // Cegah buka tab baru
            }
        }
        // Kasus B: Jika berupa kartu dengan fungsi onclick (seperti 01.1)
        else if (target.classList.contains('pdfCard')) {
            let onClickAttr = target.getAttribute('onclick');
            if (onClickAttr && onClickAttr.includes('showPdf')) {
                let match = onClickAttr.match(/showPdf\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);
                if (match) {
                    pdfUrl = match[1];
                    titleText = match[2];
                    e.preventDefault(); // Cegah fungsi bawaan bentrok
                }
            }
        }

        // Jika URL PDF ditemukan, buka menggunakan penampil universal
        if (pdfUrl) {
            openGlobalPdfViewer(pdfUrl, titleText, target);
        }
    });
});

// Fungsi Universal untuk Membuka Viewer PDF.js di Halaman Manapun
window.openGlobalPdfViewer = function(pdfUrl, titleText, element) {
    let viewerBox = document.getElementById('pdfViewerBox');
    
    // Jika di halaman tersebut belum ada kotak viewer, buat secara otomatis di bawah elemen utama
    if (!viewerBox) {
        let container = document.querySelector('.pkksWrap') || document.querySelector('main') || document.body;
        
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
        container.appendChild(viewerBox);
    } else {
        viewerBox.style.display = "block";
        viewerBox.classList.add('active');
    }

    const pdfFrame = document.getElementById('pdfFrame');
    const titleTextEl = document.getElementById('pdfTitleText');

    // Ubah URL relatif menjadi absolute URL agar aman dibaca oleh PDF.js
    let fullUrl = pdfUrl;
    if (!pdfUrl.startsWith('http')) {
        fullUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + pdfUrl;
    }
    
    // Gunakan Mozilla PDF.js Viewer
    const viewerUrl = "https://mozilla.github.io/pdf.js/web/viewer.html?file=" + encodeURIComponent(fullUrl);

    if (pdfFrame) pdfFrame.src = viewerUrl;
    if (titleTextEl) titleTextEl.innerText = "📁 " + titleText;

    // Tandai elemen aktif jika berupa kartu
    document.querySelectorAll('.pdfCard').forEach(c => c.classList.remove('active'));
    if (element && element.classList.contains('pdfCard')) element.classList.add('active');

    // Gulir halus ke arah kotak viewer di bawah
    viewerBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

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

// Backup fungsi showPdf agar tidak error di halaman 01.1
window.showPdf = function(pdfUrl, titleText, element) {
    openGlobalPdfViewer(pdfUrl, titleText, element);
};
