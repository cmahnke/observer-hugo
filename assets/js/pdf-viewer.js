import PDFObject from 'pdfobject';

const pdfViewerDefaultOptions = {
    pdfOpenParams: {
        navpanes: 1,
        toolbar: 1,
        statusbar: 1,
        scrollbar: 1,
        view: "FitH"
    },
    PDFJS_URL: "/js/pdfjs/web/viewer.html"
};

window.addPDFViewer = function (elemId, url, options) {
    if (options === undefined) {
        options = pdfViewerDefaultOptions;
    }

    return  PDFObject.embed(url, elemId, options);
}

function initPDFViewers() {
    document.querySelectorAll('[data-pdf-viewer]').forEach(function (element) {
        PDFObject.embed(element.dataset.pdfViewer, element, pdfViewerDefaultOptions);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPDFViewers);
} else {
    initPDFViewers();
}
