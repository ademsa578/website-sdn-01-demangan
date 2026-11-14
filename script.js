/* =====================================================
   WEBSITE SDN 01 DEMANGAN
   SCRIPT.JS - RESPONSIVE HP & LAPTOP
   PDF.JS - TAMPILAN VERTICAL MENYAMBUNG KE BAWAH
===================================================== */


/* =====================================================
   1. NAVIGASI & MENU MOBILE
===================================================== */

const menu = document.getElementById("menu");
const nav = document.querySelector(".siteNav") || document.querySelector("nav");

if (menu && nav) {
    menu.addEventListener("click", () => {
        nav.style.display = nav.style.display === "flex" ? "" : "flex";
    });

    document.querySelectorAll("nav a").forEach(a => {
        a.addEventListener("click", () => {
            if (window.innerWidth < 901) {
                nav.style.display = "none";
            }
        });
    });
}


/* =====================================================
   2. DEMANGAN AI ASSISTANT
===================================================== */

const aiButton = document.getElementById("aiButton");
const aiBox = document.getElementById("aiBox");
const closeAI = document.getElementById("closeAI");
const send = document.getElementById("send");
const input = document.getElementById("aiInput");
const chatBody = document.querySelector(".aiBody");

if (aiButton && aiBox) {
    aiButton.onclick = () => {
        aiBox.style.display = "block";
    };
}

if (closeAI && aiBox) {
    closeAI.onclick = () => {
        aiBox.style.display = "none";
    };
}

function answer(q) {
    q = q.toLowerCase();

    if (q.includes("profil")) {
        return "Profil sekolah dapat diisi dengan sejarah, visi-misi, kepala sekolah, guru, dan identitas resmi SDN 01 Demangan.";
    }

    if (q.includes("program")) {
        return "Program unggulan pada template: Adiwiyata, PMR, PUSAKA PJOK, dan Kembang Krambil.";
    }

    if (q.includes("ppdb") || q.includes("spmb")) {
        return "Bagian SPMB/PPDB dapat diarahkan ke halaman informasi dan formulir resmi sekolah.";
    }

    if (q.includes("kontak")) {
        return "Kontak resmi sekolah dapat ditambahkan di bagian Kontak setelah data diberikan.";
    }

    return "Terima kasih! Saya adalah Demangan AI. Jawaban dan data sekolah dapat kita sambungkan ke informasi resmi pada tahap berikutnya.";
}

if (send && input && chatBody) {
    send.onclick = () => {
        const q = input.value.trim();
        if (!q) return;

        const userMessage = document.createElement("div");
        userMessage.className = "userMsg";
        userMessage.textContent = q;
        chatBody.appendChild(userMessage);

        const aiAnswer = document.createElement("div");
        aiAnswer.className = "aiAnswer";
        aiAnswer.textContent = answer(q);
        chatBody.appendChild(aiAnswer);

        input.value = "";
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    input.onkeydown = e => {
        if (e.key === "Enter") send.click();
    };

    document.querySelectorAll(".chips button").forEach(button => {
        button.onclick = () => {
            input.value = button.textContent;
            send.click();
        };
    });
}


/* =====================================================
   3. KEPALA AI DAPAT DIGESER
===================================================== */

const bot = document.getElementById("heroAI");

if (bot) {
    let drag = false;
    let offsetX = 0;
    let offsetY = 0;

    bot.addEventListener("pointerdown", e => {
        drag = true;
        bot.classList.add("dragging");
        bot.setPointerCapture(e.pointerId);

        const rect = bot.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        bot.style.left = rect.left + "px";
        bot.style.top = rect.top + "px";
        bot.style.position = "fixed";
    });

    bot.addEventListener("pointermove", e => {
        if (!drag) return;

        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        x = Math.max(8, Math.min(window.innerWidth - bot.offsetWidth - 8, x));
        y = Math.max(38, Math.min(window.innerHeight - bot.offsetHeight - 8, y));

        bot.style.left = x + "px";
        bot.style.top = y + "px";
    });

    function stopDocDrag() {
        drag = false;
        bot.classList.remove("dragging");
    }

    bot.addEventListener("pointerup", stopDocDrag);
    bot.addEventListener("pointercancel", stopDocDrag);

    bot.addEventListener("dblclick", () => {
        if (aiBox) aiBox.style.display = "block";
    });
}


/* =====================================================
   4. PDF VIEWER VERTICAL CONTINUOUS SCROLL
===================================================== */

let pdfLibrary = null;

async function loadPDFLibrary() {
    if (!pdfLibrary) {
        pdfLibrary = import(
            "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs"
        ).then(pdfjs => {
            pdfjs.GlobalWorkerOptions.workerSrc =
                "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
            return pdfjs;
        }).catch(error => {
            pdfLibrary = null;
            throw error;
        });
    }
    return await pdfLibrary;
}


/* STYLING CSS UNTUK TAMPILAN KE BAWAH (VERTICAL STACK) */

function installPDFStyles() {
    if (document.getElementById("globalPDFStyles")) return;

    const style = document.createElement("style");
    style.id = "globalPDFStyles";

    style.textContent = `
        .pdfjs-inline-viewer {
            display: flex;
            flex-direction: column;
            width: 100% !important;
            max-width: 100% !important;
            margin: 15px 0 !important;
            box-sizing: border-box;
            background: #e2e8f0;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            overflow: hidden;
        }

        .pdfjs-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px;
            background: #102c46;
            color: white;
            box-sizing: border-box;
        }

        .pdfjs-toolbar button {
            border: none;
            border-radius: 6px;
            padding: 8px 14px;
            background: white;
            color: #102c46;
            font-weight: 700;
            cursor: pointer;
        }

        .pdfjs-page-info {
            color: white;
            font-size: 13px;
            font-weight: 600;
        }

        /* AREA KONTAINER KE BAWAH */
        .pdfjs-canvas-area {
            display: block;
            width: 100%;
            max-height: 75vh;
            overflow-y: auto;
            padding: 15px;
            text-align: center;
            background: #e2e8f0;
            box-sizing: border-box;
            -webkit-overflow-scrolling: touch;
        }

        /* SUSUNAN HALAMAN MENYAMBUNG KE BAWAH */
        .pdfjs-page-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px; /* Jarak antar halaman PDF */
            width: 100%;
        }

        .pdfjs-canvas {
            display: block;
            max-width: 100% !important;
            height: auto !important;
            background: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            border-radius: 4px;
        }

        .pdfjs-status {
            padding: 30px;
            color: #334155;
            text-align: center;
            font-size: 14px;
        }

        .pdfjs-download {
            background: #087f68 !important;
            color: white !important;
            text-decoration: none;
        }

        /* POPUP FULLSCREEN PDF */
        #pdfViewerBox {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: none;
            flex-direction: column;
            background: #e2e8f0;
        }

        #pdfViewerBox.active {
            display: flex;
        }

        #pdfViewerBox .pdfjs-inline-viewer {
            flex: 1 1 auto !important;
            margin: 0 !important;
            border: none;
            border-radius: 0;
        }

        #pdfViewerBox .pdfjs-canvas-area {
            flex: 1;
            max-height: none;
        }
    `;

    document.head.appendChild(style);
}


/* MEMBUAT KOMPONEN RENDER SEMUA HALAMAN BERURUTAN KE BAWAH */

function createPDFPanel(pdfUrl, titleText) {
    const panel = document.createElement("div");
    panel.className = "pdfjs-inline-viewer";

    panel.innerHTML = `
        <div class="pdfjs-toolbar">
            <span class="pdfjs-page-info">Memuat dokumen...</span>
            <a class="pdfjs-download" href="${pdfUrl}" target="_blank" download>Unduh File PDF</a>
        </div>
        <div class="pdfjs-canvas-area">
            <div class="pdfjs-status">Memuat semua halaman dokumen...</div>
            <div class="pdfjs-page-container"></div>
        </div>
    `;

    const status = panel.querySelector(".pdfjs-status");
    const container = panel.querySelector(".pdfjs-page-container");
    const pageInfo = panel.querySelector(".pdfjs-page-info");
    const area = panel.querySelector(".pdfjs-canvas-area");

    const state = {
        document: null,
        destroyed: false,
        lastWidth: 0,
        resizeObserver: null
    };

    function getAvailableWidth() {
        const style = window.getComputedStyle(area);
        const padding = parseFloat(style.paddingLeft || 0) + parseFloat(style.paddingRight || 0);
        return Math.max(100, area.clientWidth - padding);
    }

    /* RENDER SEMUA HALAMAN SEKALIGUS SECARA BERURUTAN KE BAWAH */
    async function renderAllPages() {
        if (!state.document || state.destroyed) return;
        if (area.clientWidth < 50) return;

        const availableWidth = getAvailableWidth();
        container.innerHTML = ""; // Bersihkan sebelum render ulang

        try {
            const totalPages = state.document.numPages;
            pageInfo.textContent = "Total " + totalPages + " Halaman (Scroll ke bawah)";
            status.style.display = "none";

            for (let i = 1; i <= totalPages; i++) {
                if (state.destroyed) break;

                const page = await state.document.getPage(i);
                if (state.destroyed) break;

                const original = page.getViewport({ scale: 1 });
                const fitScale = availableWidth / original.width;
                const viewport = page.getViewport({ scale: fitScale });

                const canvas = document.createElement("canvas");
                canvas.className = "pdfjs-canvas";
                const context = canvas.getContext("2d");

                const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.floor(viewport.width * pixelRatio);
                canvas.height = Math.floor(viewport.height * pixelRatio);
                canvas.style.width = viewport.width + "px";
                canvas.style.height = viewport.height + "px";

                container.appendChild(canvas);

                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                    transform: [pixelRatio, 0, 0, pixelRatio, 0, 0]
                }).promise;
            }

            state.lastWidth = availableWidth;

        } catch (error) {
            console.error("PDF rendering error:", error);
        }
    }

    /* AUTO ADJUST KETIKA LAYAR DI-RESIZE */
    if ("ResizeObserver" in window) {
        state.resizeObserver = new ResizeObserver(() => {
            if (!state.document || state.destroyed || area.clientWidth < 50) return;
            const newWidth = getAvailableWidth();
            if (Math.abs(newWidth - state.lastWidth) > 5) {
                renderAllPages();
            }
        });
        state.resizeObserver.observe(area);
    }

    async function loadDocument() {
        try {
            const pdfjs = await loadPDFLibrary();
            if (state.destroyed) return;

            state.document = await pdfjs.getDocument({ url: pdfUrl }).promise;
            if (state.destroyed) return;

            await renderAllPages();

        } catch (error) {
            console.error("Gagal membuka PDF:", error);
            if (!state.destroyed) {
                status.style.display = "block";
                status.innerHTML = "Dokumen gagal dimuat. Periksa koneksi atau file PDF.";
                pageInfo.textContent = "Gagal memuat";
            }
        }
    }

    function destroy() {
        state.destroyed = true;
        if (state.resizeObserver) state.resizeObserver.disconnect();
        state.document = null;
    }

    loadDocument();

    return {
        element: panel,
        destroy: destroy
    };
}

function escapePDFText(text) {
    const div = document.createElement("div");
    div.textContent = String(text);
    return div.innerHTML;
}

function resolvePDFUrl(url) {
    let fullUrl = new URL(url, document.baseURI);
    if (fullUrl.hostname === "mozilla.github.io") {
        const originalPDF = fullUrl.searchParams.get("file");
        if (originalPDF) fullUrl = new URL(originalPDF, document.baseURI);
    }
    return fullUrl.href;
}


/* POPUP & GLOBAL VIEWER */

function createGlobalPDFViewer() {
    let viewer = document.getElementById("pdfViewerBox");
    if (viewer) return viewer;

    viewer = document.createElement("div");
    viewer.id = "pdfViewerBox";
    viewer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#102c46; padding:12px; color:white; gap:10px;">
            <strong id="pdfTitleText">Dokumen PKKS</strong>
            <button type="button" onclick="closeGlobalPdfViewer()" style="background:#ffffff; color:#102c46; border:0; border-radius:6px; padding:8px 12px; font-weight:bold; cursor:pointer;">✕ Tutup</button>
        </div>
        <div id="pdfGlobalContent" style="flex:1; min-height:0; overflow:auto;"></div>
    `;
    document.body.appendChild(viewer);
    return viewer;
}

let globalPDFPanel = null;

window.openGlobalPdfViewer = function(pdfUrl, titleText, element) {
    installPDFStyles();
    const viewer = createGlobalPDFViewer();
    const content = document.getElementById("pdfGlobalContent");

    if (globalPDFPanel) {
        globalPDFPanel.destroy();
        globalPDFPanel = null;
    }

    content.innerHTML = "";
    viewer.classList.add("active");
    document.getElementById("pdfTitleText").textContent = titleText || "Dokumen PKKS";

    const fullUrl = resolvePDFUrl(pdfUrl);
    globalPDFPanel = createPDFPanel(fullUrl, titleText || "Dokumen PKKS");
    content.appendChild(globalPDFPanel.element);

    document.querySelectorAll(".pdfCard").forEach(card => card.classList.remove("active"));
    if (element && element.classList.contains("pdfCard")) element.classList.add("active");

    document.body.style.overflow = "hidden";
};

window.closeGlobalPdfViewer = function() {
    const viewer = document.getElementById("pdfViewerBox");
    if (globalPDFPanel) {
        globalPDFPanel.destroy();
        globalPDFPanel = null;
    }
    if (viewer) viewer.classList.remove("active");
    document.body.style.overflow = "";
    document.querySelectorAll(".pdfCard").forEach(card => card.classList.remove("active"));
};

window.showPdf = function(pdfUrl, titleText, element) {
    window.openGlobalPdfViewer(pdfUrl, titleText, element);
};


/* KONVERSI OTOMATIS IFRAME DI SEMUA HALAMAN */

function convertOldPDFFrames() {
    installPDFStyles();

    document.querySelectorAll(".pdfFrameWrapperFull").forEach(wrapper => {
        const iframe = wrapper.querySelector("iframe");
        if (!iframe || iframe.getAttribute("src")) return;

        const downloadButton = wrapper.closest(".pdfFullCard")?.querySelector(".pdfDownloadBtn");
        if (downloadButton) {
            const pdfUrl = downloadButton.getAttribute("href");
            if (pdfUrl) iframe.setAttribute("src", pdfUrl);
        }
    });

    document.querySelectorAll("iframe").forEach(iframe => {
        if (iframe.dataset.pdfjsConverted === "true") return;
        const source = iframe.getAttribute("src");
        if (!source) return;

        let isPDF = false;
        try {
            const url = new URL(source, document.baseURI);
            if (url.hostname === "mozilla.github.io" && url.searchParams.has("file")) {
                isPDF = true;
            } else {
                isPDF = /\.pdf$/i.test(url.pathname);
            }
        } catch (e) {
            return;
        }

        if (!isPDF) return;

        const fullUrl = resolvePDFUrl(source);
        const panel = createPDFPanel(fullUrl, "Dokumen PKKS");
        iframe.dataset.pdfjsConverted = "true";
        iframe.replaceWith(panel.element);
    });
}

function initializeDemanganWebsite() {
    installPDFStyles();
    convertOldPDFFrames();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDemanganWebsite);
} else {
    initializeDemanganWebsite();
}
