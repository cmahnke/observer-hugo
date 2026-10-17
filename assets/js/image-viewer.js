import lightGallery from 'lightgallery';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

const imageViewerDefaultOptions = {
    plugins: [lgFullscreen, lgThumbnail],
    share: false,
    autoplay: false,
    autoplayControls: false,
    thumbnail: true
};

window.addImageViewer = function(id, options) {
    if (options === undefined) {
        options = imageViewerDefaultOptions;
    }
    return lightGallery(document.getElementById(id), options);
}

function initImageViewers() {
    document.querySelectorAll('[data-image-viewer]').forEach(function (element) {
        lightGallery(element, imageViewerDefaultOptions);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewers);
} else {
    initViewers();
}
