import { embed as pdfEmbed, type Options as PDFObjectOptions } from 'pdfobject';

declare global {
    interface Window {
        addPDFViewer: (elemId: string, url: string, options?: PDFObjectOptions) => HTMLElement;
    }
}

const pdfViewerDefaultOptions: PDFObjectOptions = {
    pdfOpenParams: {
        navpanes: 1,
        toolbar: 1,
        statusbar: 1,
        scrollbar: 1,
        view: "FitH"
    },
    PDFJS_URL: "/js/pdfjs/web/viewer.html"
};

window.addPDFViewer = function (elemId: string, url: string, options?: PDFObjectOptions): HTMLElement {
    if (options === undefined) {
        options = pdfViewerDefaultOptions;
    }

    return pdfEmbed(url, elemId, options);
}

function initPDFViewers(): void {
    document.querySelectorAll<HTMLElement>('[data-pdf-viewer]').forEach(function (element) {
        pdfEmbed(element.dataset.pdfViewer ?? '', element, pdfViewerDefaultOptions);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPDFViewers);
} else {
    initPDFViewers();
}
