
/* =====================================================
   C. PDF VIEWER MULTI HALAMAN
   SEMUA HALAMAN TERSAMBUNG KE BAWAH
===================================================== */

function createPDFPanel(pdfUrl, titleText) {

    const panel = document.createElement("div");
    panel.className = "pdfjs-inline-viewer";

    panel.innerHTML = `

        <div class="pdfjs-toolbar">

            <span class="pdfjs-page-info">
                Memuat dokumen...
            </span>

            <button type="button" data-action="minus">
                −
            </button>

            <button type="button" data-action="plus">
                +
            </button>

            <button type="button"
                    class="pdfjs-download"
                    data-action="download">
                Unduh PDF
            </button>

        </div>

        <div class="pdfjs-canvas-area"
             style="
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:12px;
             ">

            <div class="pdfjs-status">
                Memuat dokumen: ${escapePDFText(titleText)}
            </div>

        </div>
    `;

    const area = panel.querySelector(".pdfjs-canvas-area");
    const status = panel.querySelector(".pdfjs-status");
    const pageInfo = panel.querySelector(".pdfjs-page-info");

    const minus = panel.querySelector('[data-action="minus"]');
    const plus = panel.querySelector('[data-action="plus"]');
    const download = panel.querySelector('[data-action="download"]');

    const state = {
        document: null,
        zoom: 1,
        tasks: [],
        renderNumber: 0,
        destroyed: false,
        lastWidth: 0,
        resizeObserver: null,
        rendering: false,
        pendingRender: false
    };


    /* MENGHITUNG LEBAR AREA */

    function getAvailableWidth() {

        const style = window.getComputedStyle(area);

        const padding =
            parseFloat(style.paddingLeft || 0) +
            parseFloat(style.paddingRight || 0);

        return Math.max(100, area.clientWidth - padding);
    }


    /* MEMBATALKAN RENDER SEBELUMNYA */

    function cancelRendering() {

        state.tasks.forEach(task => {
            try {
                task.cancel();
            } catch (e) {}
        });

        state.tasks = [];
    }


    /* MENAMPILKAN SEMUA HALAMAN PDF */

    async function renderAllPages() {

        if (!state.document || state.destroyed) return;

        if (area.clientWidth < 50) return;

        if (state.rendering) {
            state.pendingRender = true;
            return;
        }

        state.rendering = true;
        state.pendingRender = false;

        const renderNumber = ++state.renderNumber;

        cancelRendering();

        area.querySelectorAll(".pdfjs-page-wrapper").forEach(el => {
            el.remove();
        });

        const availableWidth = getAvailableWidth();

        try {

            for (
                let pageNumber = 1;
                pageNumber <= state.document.numPages;
                pageNumber++
            ) {

                if (
                    state.destroyed ||
                    renderNumber !== state.renderNumber
                ) return;

                /* Ambil halaman PDF */

                const page = await state.document.getPage(pageNumber);

                if (
                    state.destroyed ||
                    renderNumber !== state.renderNumber
                ) return;

                /* Ukuran asli halaman */

                const original = page.getViewport({
                    scale: 1
                });

                /* Sesuaikan dengan lebar HP atau laptop */

                const fitScale = availableWidth / original.width;

                const viewport = page.getViewport({
                    scale: fitScale * state.zoom
                });

                const pixelRatio = Math.min(
                    window.devicePixelRatio || 1,
                    2
                );

                /* Kotak masing-masing halaman */

                const wrapper = document.createElement("div");

                wrapper.className = "pdfjs-page-wrapper";

                wrapper.style.cssText = `
                    width:100%;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    box-sizing:border-box;
                    padding:0;
                    margin:0 auto 12px auto;
                `;

                /* Nomor halaman */

                const label = document.createElement("div");

                label.textContent =
                    "Halaman " + pageNumber +
                    " dari " + state.document.numPages;

                label.style.cssText = `
                    width:100%;
                    text-align:center;
                    padding:7px;
                    margin-bottom:6px;
                    font-size:12px;
                    font-weight:600;
                    color:#475569;
                    box-sizing:border-box;
                `;

                /* Canvas halaman */

                const canvas = document.createElement("canvas");

                canvas.className = "pdfjs-canvas";

                canvas.width = Math.floor(
                    viewport.width * pixelRatio
                );

                canvas.height = Math.floor(
                    viewport.height * pixelRatio
                );

                canvas.style.cssText = `
                    display:block;
                    width:${viewport.width}px;
                    height:${viewport.height}px;
                    max-width:none;
                    margin:0 auto;
                    background:white;
                    box-shadow:0 2px 12px rgba(0,0,0,.15);
                `;

                wrapper.appendChild(label);
                wrapper.appendChild(canvas);

                area.appendChild(wrapper);

                const context = canvas.getContext("2d");

                /* Render halaman */

                const task = page.render({

                    canvasContext: context,

                    viewport: viewport,

                    transform: [
                        pixelRatio, 0,
                        0, pixelRatio,
                        0, 0
                    ]

                });

                state.tasks.push(task);

                await task.promise;

                if (
                    state.destroyed ||
                    renderNumber !== state.renderNumber
                ) return;
            }

            state.lastWidth = availableWidth;

            status.style.display = "none";

            pageInfo.textContent =
                state.document.numPages +
                " halaman dokumen";

        } catch (error) {

            if (error.name !== "RenderingCancelledException") {

                console.error("PDF rendering error:", error);

                status.style.display = "block";

                status.textContent =
                    "Terjadi kesalahan saat menampilkan halaman PDF.";
            }

        } finally {

            state.rendering = false;

            if (state.pendingRender && !state.destroyed) {
                renderAllPages();
            }
        }
    }


    /* MEMUAT DOKUMEN PDF */

    async function loadDocument() {

        try {

            status.textContent = "Memuat seluruh halaman PDF...";

            const pdfjs = await loadPDFLibrary();

            if (state.destroyed) return;

            state.loadingTask = pdfjs.getDocument({
                url: pdfUrl
            });

            state.document = await state.loadingTask.promise;

            if (state.destroyed) return;

            pageInfo.textContent =
                state.document.numPages + " halaman dokumen";

            await renderAllPages();

        } catch (error) {

            console.error("Gagal membuka PDF:", error);

            if (!state.destroyed) {

                status.style.display = "block";

                status.textContent =
                    "Dokumen tidak dapat ditampilkan. Periksa alamat PDF dan koneksi internet.";

                pageInfo.textContent = "Gagal memuat";
            }
        }
    }


    /* TOMBOL PERBESAR */

    plus.onclick = () => {

        state.zoom = Math.min(
            state.zoom + 0.2,
            3
        );

        renderAllPages();
    };


    /* TOMBOL PERKECIL */

    minus.onclick = () => {

        state.zoom = Math.max(
            state.zoom - 0.2,
            0.5
        );

        renderAllPages();
    };


    /* TOMBOL UNDUH */

    download.onclick = () => {

        const link = document.createElement("a");

        link.href = pdfUrl;
        link.download = "";

        document.body.appendChild(link);

        link.click();

        link.remove();
    };


    /* OTOMATIS MENYESUAIKAN UKURAN */

    if ("ResizeObserver" in window) {

        state.resizeObserver = new ResizeObserver(() => {

            if (!state.document || state.destroyed) return;

            const newWidth = getAvailableWidth();

            if (
                area.clientWidth > 50 &&
                Math.abs(newWidth - state.lastWidth) > 2
            ) {
                renderAllPages();
            }
        });

        state.resizeObserver.observe(area);

    } else {

        window.addEventListener("resize", renderAllPages);
    }


    /* MEMBERSIHKAN VIEWER */

    function destroy() {

        state.destroyed = true;
        state.renderNumber++;

        cancelRendering();

        if (state.resizeObserver) {
            state.resizeObserver.disconnect();
        } else {
            window.removeEventListener("resize", renderAllPages);
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
        render: renderAllPages
    };
}
