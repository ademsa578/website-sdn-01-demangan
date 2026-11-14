
/* =====================================================
   WEBSITE SDN 01 DEMANGAN
   SCRIPT.JS - RESPONSIVE HP & LAPTOP
   PDF.JS - TAMPILAN SATU KOLOM DAN AUTO FIT
===================================================== */


/* =====================================================
   1. NAVIGASI & MENU MOBILE
===================================================== */

const menu = document.getElementById("menu");
const nav = document.querySelector(".siteNav") ||
            document.querySelector("nav");

if (menu && nav) {
    menu.addEventListener("click", () => {
        nav.style.display =
            nav.style.display === "flex" ? "" : "flex";
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

        x = Math.max(8, Math.min(
            window.innerWidth - bot.offsetWidth - 8, x
        ));

        y = Math.max(38, Math.min(
            window.innerHeight - bot.offsetHeight - 8, y
        ));

        bot.style.left = x + "px";
        bot.style.top = y + "px";
    });

    function stopDrag() {
        drag = false;
        bot.classList.remove("dragging");
    }

    bot.addEventListener("pointerup", stopDrag);
    bot.addEventListener("pointercancel", stopDrag);

    bot.addEventListener("dblclick", () => {
        if (aiBox) aiBox.style.display = "block";
    });
}


/* =====================================================
   4. PDF VIEWER GLOBAL RESPONSIVE
===================================================== */


/* A. MEMUAT PDF.JS */

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


/* B. CSS RESPONSIVE PDF VIEWER */

function installPDFStyles() {

    if (document.getElementById("globalPDFStyles")) return;

    const style = document.createElement("style");
    style.id = "globalPDFStyles";

    style.textContent = `

        /* KOTAK UTAMA PDF */

        .pdfjs-inline-viewer {
            display: flex;
            flex-direction: column;

            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;

            flex: 0 0 100% !important;
            grid-column: 1 / -1 !important;

            margin: 15px 0 !important;
            box-sizing: border-box;

            background: #e2e8f0;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            overflow: hidden;
        }

        /* TOOLBAR */

        .pdfjs-toolbar {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 7px;
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            background: #102c46;
            color: white;
        }

        .pdfjs-toolbar button {
            border: none;
            border-radius: 6px;
            padding: 9px 12px;
            background: white;
            color: #102c46;
            font-weight: 700;
            cursor: pointer;
        }

        .pdfjs-toolbar button:disabled {
            opacity: .4;
            cursor: not-allowed;
        }

        .pdfjs-page-info {
            color: white;
            font-size: 13px;
            font-weight: 600;
            padding: 5px;
        }

        /* AREA HALAMAN PDF */

        .pdfjs-canvas-area {
            display: block;
            width: 100%;
            max-width: 100%;
            min-width: 0;
            max-height: 75vh;

            overflow: auto;
            padding: 10px;

            text-align: center;
            background: #e2e8f0;
            box-sizing: border-box;

            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
        }

        /* HALAMAN PDF */

        .pdfjs-canvas {
            display: block;
            width: auto;
            max-width: 100% !important;
            height: auto;
            margin: 0 auto;

            background: white;
            box-shadow: 0 2px 12px rgba(0,0,0,.15);
        }

        .pdfjs-status {
            padding: 20px;
            color: #334155;
            text-align: center;
            font-size: 14px;
        }

        .pdfjs-download {
            background: #087f68 !important;
            color: white !important;
        }

        /* POPUP PDF */

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
            display: flex;
            flex-direction: column;
            min-height: 0;
            margin: 0 !important;
            border: none;
            border-radius: 0;
        }

        #pdfViewerBox .pdfjs-canvas-area {
            flex: 1;
            max-height: none;
        }

        /* KHUSUS HP */

        @media (max-width: 600px) {

            .pdfjs-inline-viewer {
                width: 100% !important;
                max-width: 100% !important;
                flex-basis: 100% !important;
                margin: 12px 0 !important;
                border-radius: 9px;
            }

            .pdfjs-toolbar {
                gap: 5px;
                padding: 8px 4px;
            }

            .pdfjs-toolbar button {
                padding: 8px 9px;
                font-size: 12px;
            }

            .pdfjs-page-info {
                font-size: 12px;
                padding: 4px;
            }

            .pdfjs-canvas-area {
                width: 100%;
                max-width: 100%;
                padding: 5px;
                max-height: 70vh;
            }

            .pdfjs-canvas {
                max-width: 100% !important;
                height: auto;
            }

            #pdfViewerBox .pdfjs-canvas-area {
                max-height: none;
            }
        }
    `;

    document.head.appendChild(style);
}


/* C. MEMBUAT KOMPONEN PDF */

function createPDFPanel(pdfUrl, titleText) {

    const panel = document.createElement("div");
    panel.className = "pdfjs-inline-viewer";

    panel.innerHTML = `

        <div class="pdfjs-toolbar">

            <button type="button" data-action="prev">◀</button>

            <span class="pdfjs-page-info">Memuat...</span>

            <button type="button" data-action="next">▶</button>

            <button type="button" data-action="minus">−</button>

            <button type="button" data-action="plus">+</button>

            <button type="button"
                    class="pdfjs-download"
                    data-action="download">
                Unduh
            </button>

        </div>

        <div class="pdfjs-canvas-area">

            <div class="pdfjs-status">
                Memuat dokumen: ${escapePDFText(titleText)}
            </div>

            <canvas class="pdfjs-canvas"
                    style="display:none">
            </canvas>

        </div>
    `;

    const canvas = panel.querySelector(".pdfjs-canvas");
    const context = canvas.getContext("2d");

    const status = panel.querySelector(".pdfjs-status");
    const area = panel.querySelector(".pdfjs-canvas-area");
    const pageInfo = panel.querySelector(".pdfjs-page-info");

    const prev = panel.querySelector('[data-action="prev"]');
    const next = panel.querySelector('[data-action="next"]');
    const minus = panel.querySelector('[data-action="minus"]');
    const plus = panel.querySelector('[data-action="plus"]');
    const download = panel.querySelector('[data-action="download"]');

    const state = {
        document: null,
        page: 1,
        zoom: 1,
        task: null,
        loadingTask: null,
        renderNumber: 0,
        destroyed: false,
        lastWidth: 0,
        resizeObserver: null
    };


    /* MENGHITUNG LEBAR AREA PDF */

    function getAvailableWidth() {

        const style = window.getComputedStyle(area);

        const padding =
            parseFloat(style.paddingLeft || 0) +
            parseFloat(style.paddingRight || 0);

        return Math.max(100, area.clientWidth - padding);
    }


    /* RENDER HALAMAN PDF */

    async function renderPage() {

        if (!state.document || state.destroyed) return;

        /*
           Jika panel sedang tersembunyi,
           tunggu sampai panel dibuka.
        */

        if (area.clientWidth < 50) return;

        const availableWidth = getAvailableWidth();

        if (availableWidth < 50) return;

        const renderNumber = ++state.renderNumber;

        if (state.task) {
            try {
                state.task.cancel();
            } catch (e) {}
        }

        try {

            const page = await state.document.getPage(state.page);

            if (state.destroyed ||
                renderNumber !== state.renderNumber) return;

            const original = page.getViewport({ scale: 1 });

            /*
               FIT WIDTH:
               PDF menyesuaikan lebar kotak.
            */

            const fitScale = availableWidth / original.width;

            const viewport = page.getViewport({
                scale: fitScale * state.zoom
            });

            const pixelRatio = Math.min(
                window.devicePixelRatio || 1,
                2
            );

            canvas.width = Math.floor(viewport.width * pixelRatio);
            canvas.height = Math.floor(viewport.height * pixelRatio);

            canvas.style.width = viewport.width + "px";
            canvas.style.height = viewport.height + "px";

            context.clearRect(0, 0, canvas.width, canvas.height);

            pageInfo.textContent =
                "Halaman " + state.page +
                " / " + state.document.numPages;

            prev.disabled = state.page <= 1;
            next.disabled = state.page >= state.document.numPages;

            canvas.style.display = "block";
            status.style.display = "none";

            state.task = page.render({

                canvasContext: context,
                viewport: viewport,

                transform: [
                    pixelRatio, 0,
                    0, pixelRatio,
                    0, 0
                ]
            });

            await state.task.promise;

            if (renderNumber !== state.renderNumber) return;

            state.lastWidth = availableWidth;

        } catch (error) {

            if (error.name !== "RenderingCancelledException") {
                console.error("PDF rendering error:", error);
            }
        }
    }


    /* MENYESUAIKAN PDF KETIKA KOTAK BERUBAH UKURAN */

    if ("ResizeObserver" in window) {

        state.resizeObserver = new ResizeObserver(() => {

            if (!state.document || state.destroyed) return;

            if (area.clientWidth < 50) return;

            const newWidth = getAvailableWidth();

            if (Math.abs(newWidth - state.lastWidth) > 2) {
                renderPage();
            }
        });

        state.resizeObserver.observe(area);

    } else {

        window.addEventListener("resize", renderPage);
    }


    /* MEMUAT DOKUMEN */

    async function loadDocument() {

        try {

            status.textContent = "Memuat dokumen PDF...";

            const pdfjs = await loadPDFLibrary();

            if (state.destroyed) return;

            state.loadingTask = pdfjs.getDocument({
                url: pdfUrl
            });

            state.document = await state.loadingTask.promise;

            if (state.destroyed) return;

            state.page = 1;

            pageInfo.textContent =
                "Halaman 1 / " + state.document.numPages;

            await renderPage();

        } catch (error) {

            console.error("Gagal membuka PDF:", error);

            if (!state.destroyed) {

                canvas.style.display = "none";
                status.style.display = "block";

                status.innerHTML =
                    "Dokumen tidak dapat ditampilkan.<br><br>" +
                    "Periksa alamat PDF, koneksi internet, dan akses dokumen.";

                pageInfo.textContent = "Gagal memuat";
            }
        }
    }


    /* TOMBOL KONTROL */

    prev.onclick = () => {

        if (state.document && state.page > 1) {
            state.page--;
            renderPage();
        }
    };

    next.onclick = () => {

        if (state.document &&
            state.page < state.document.numPages) {

            state.page++;
            renderPage();
        }
    };

    plus.onclick = () => {
        state.zoom = Math.min(state.zoom + 0.2, 3);
        renderPage();
    };

    minus.onclick = () => {
        state.zoom = Math.max(state.zoom - 0.2, 0.5);
        renderPage();
    };

    download.onclick = () => {

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "";

        document.body.appendChild(link);
        link.click();
        link.remove();
    };


    /* MEMBERSIHKAN PDF */

    function destroy() {

        state.destroyed = true;
        state.renderNumber++;

        if (state.resizeObserver) {
            state.resizeObserver.disconnect();
        } else {
            window.removeEventListener("resize", renderPage);
        }

        if (state.task) {
            try {
                state.task.cancel();
            } catch (e) {}
        }

        if (state.loadingTask) {
            try {
                state.loadingTask.destroy();
            } catch (e) {}
        }

        state.document = null;
    }


    loadDocument();

    return {
        element: panel,
        destroy: destroy,
        render: renderPage
    };
}


/* D. MELINDUNGI JUDUL DOKUMEN */

function escapePDFText(text) {

    const div = document.createElement("div");
    div.textContent = String(text);

    return div.innerHTML;
}


/* E. MENYIAPKAN URL PDF */

function resolvePDFUrl(url) {

    let fullUrl = new URL(url, document.baseURI);

    if (fullUrl.hostname === "mozilla.github.io") {

        const originalPDF = fullUrl.searchParams.get("file");

        if (originalPDF) {
            fullUrl = new URL(originalPDF, document.baseURI);
        }
    }

    return fullUrl.href;
}


/* F. POPUP PDF GLOBAL */

function createGlobalPDFViewer() {

    let viewer = document.getElementById("pdfViewerBox");

    if (viewer) return viewer;

    viewer = document.createElement("div");
    viewer.id = "pdfViewerBox";

    viewer.innerHTML = `
        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            background:#102c46;
            padding:12px;
            color:white;
            gap:10px;
        ">

            <strong id="pdfTitleText">Dokumen PKKS</strong>

            <button type="button"
                    onclick="closeGlobalPdfViewer()"
                    style="
                        background:#ffffff;
                        color:#102c46;
                        border:0;
                        border-radius:6px;
                        padding:9px 13px;
                        font-weight:bold;
                        cursor:pointer;
                    ">
                ✕ Tutup
            </button>

        </div>

        <div id="pdfGlobalContent"
             style="flex:1;min-height:0;overflow:auto">
        </div>
    `;

    document.body.appendChild(viewer);

    return viewer;
}


/* G. MEMBUKA PDF GLOBAL */

let globalPDFPanel = null;

window.openGlobalPdfViewer = function(
    pdfUrl,
    titleText,
    element
) {

    installPDFStyles();

    const viewer = createGlobalPDFViewer();
    const content = document.getElementById("pdfGlobalContent");

    if (globalPDFPanel) {
        globalPDFPanel.destroy();
        globalPDFPanel = null;
    }

    content.innerHTML = "";

    viewer.classList.add("active");

    document.getElementById("pdfTitleText").textContent =
        titleText || "Dokumen PKKS";

    const fullUrl = resolvePDFUrl(pdfUrl);

    globalPDFPanel = createPDFPanel(
        fullUrl,
        titleText || "Dokumen PKKS"
    );

    content.appendChild(globalPDFPanel.element);

    document.querySelectorAll(".pdfCard").forEach(card => {
        card.classList.remove("active");
    });

    if (element && element.classList.contains("pdfCard")) {
        element.classList.add("active");
    }

    document.body.style.overflow = "hidden";
};


/* H. MENUTUP PDF GLOBAL */

window.closeGlobalPdfViewer = function() {

    const viewer = document.getElementById("pdfViewerBox");

    if (globalPDFPanel) {
        globalPDFPanel.destroy();
        globalPDFPanel = null;
    }

    if (viewer) {
        viewer.classList.remove("active");
    }

    document.body.style.overflow = "";

    document.querySelectorAll(".pdfCard").forEach(card => {
        card.classList.remove("active");
    });
};


/* I. FUNGSI SHOWPDF LAMA */

window.showPdf = function(pdfUrl, titleText, element) {

    window.openGlobalPdfViewer(
        pdfUrl,
        titleText,
        element
    );
};


/* J. MENGUBAH IFRAME PDF MENJADI PDF.JS */

function convertOldPDFFrames() {

    installPDFStyles();

    /* Mengisi iframe kosong dari tombol unduh */

    document.querySelectorAll(".pdfFrameWrapperFull").forEach(wrapper => {

        const iframe = wrapper.querySelector("iframe");

        if (!iframe || iframe.getAttribute("src")) return;

        const downloadButton = wrapper
            .closest(".pdfFullCard")
            ?.querySelector(".pdfDownloadBtn");

        if (downloadButton) {

            const pdfUrl = downloadButton.getAttribute("href");

            if (pdfUrl) {
                iframe.setAttribute("src", pdfUrl);
            }
        }
    });


    /* Mengubah iframe PDF */

    document.querySelectorAll("iframe").forEach(iframe => {

        if (iframe.dataset.pdfjsConverted === "true") return;

        const source = iframe.getAttribute("src");

        if (!source) return;

        let isPDF = false;

        try {

            const url = new URL(source, document.baseURI);

            if (
                url.hostname === "mozilla.github.io" &&
                url.searchParams.has("file")
            ) {
                isPDF = true;
            } else {
                isPDF = /\.pdf$/i.test(url.pathname);
            }

        } catch (e) {
            return;
        }

        if (!isPDF) return;

        const fullUrl = resolvePDFUrl(source);

        const panel = createPDFPanel(
            fullUrl,
            "Dokumen PKKS"
        );

        iframe.dataset.pdfjsConverted = "true";

        iframe.replaceWith(panel.element);
    });
}


/* K. MENYIAPKAN SEMUA HALAMAN */

function initializeDemanganWebsite() {

    installPDFStyles();
    convertOldPDFFrames();

}

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeDemanganWebsite
    );

} else {

    initializeDemanganWebsite();

}


/* =====================================================
   5. SELESAI
   PDF VIEWER RESPONSIVE SDN 01 DEMANGAN
===================================================== */
