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


// --- 4. Solusi Global PDF Viewer (Berlaku untuk Semua Komponen PKKS) ---
// Fungsi ini otomatis menggantikan showPdf lokal di setiap halaman komponen
window.showPdf = function(pdfUrl, titleText, element) {
    let viewerBox = document.getElementById('pdfViewerBox');
    let pdfFrame = document.getElementById('pdfFrame');
    let titleTextEl = document.getElementById('pdfTitleText');

    // Jika container viewer belum ada di halaman tersebut, buat secara otomatis
    if (!viewerBox) {
        const grid = document.querySelector('.pdfGrid');
        if (!grid) return;
        
        viewerBox = document.createElement('div');
        viewerBox.id = 'pdfViewerBox';
        viewerBox.className = 'pdfViewerContainer';
        viewerBox.innerHTML = `
            <div class="pdfViewerHeader">
                <span id="pdfTitleText">Memuat Dokumen...</span>
                <span style="font-size:13px; color:#087f68; cursor:pointer;" onclick="closePdf()">Tutup [✕]</span>
            </div>
            <iframe id="pdfFrame" class="pdfIframe" src=""></iframe>
        `;
        grid.parentNode.insertBefore(viewerBox, grid.nextSibling);
        
        pdfFrame = document.getElementById('pdfFrame');
        titleTextEl = document.getElementById('pdfTitleText');
    }

    // Rakit URL absolut file PDF
    let fullUrl = pdfUrl;
    if (!pdfUrl.startsWith('http')) {
        fullUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + pdfUrl;
    }

    // Gunakan Mozilla PDF.js Viewer yang kompatibel di semua browser HP & Desktop
    const viewerUrl = "https://mozilla.github.io/pdf.js/web/viewer.html?file=" + encodeURIComponent(fullUrl);

    pdfFrame.src = viewerUrl;
    titleTextEl.innerText = "📁 " + titleText;

    // Tampilkan penampil dokumen
    viewerBox.classList.add('active');

    // Tandai kartu yang aktif
    document.querySelectorAll('.pdfCard').forEach(card => card.classList.remove('active'));
    if (element) element.classList.add('active');

    // Gulir ke area penampil PDF
    viewerBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// Fungsi Global untuk Menutup Penampil PDF
window.closePdf = function() {
    const viewerBox = document.getElementById('pdfViewerBox');
    const pdfFrame = document.getElementById('pdfFrame');
    if (pdfFrame) pdfFrame.src = "";
    if (viewerBox) viewerBox.classList.remove('active');
    document.querySelectorAll('.pdfCard').forEach(card => card.classList.remove('active'));
};
