import lightGallery from 'lightgallery';
import type { LightGallery, LightGallerySettings } from 'lightgallery';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

declare global {
    interface Window {
        addImageViewer: (id: string, options?: LightGallerySettings) => LightGallery | false;
    }
}

const imageViewerDefaultOptions: LightGallerySettings = {
    plugins: [lgFullscreen, lgThumbnail],
    share: false,
    autoplay: false,
    autoplayControls: false,
    thumbnail: true
};

window.addImageViewer = function (id: string, options?: LightGallerySettings): LightGallery | false {
    if (options === undefined) {
        options = imageViewerDefaultOptions;
    }
    const element = document.getElementById(id);
    if (element === null) {
        return false;
    }
    return lightGallery(element, options);
}

function initImageViewers(): void {
    document.querySelectorAll<HTMLElement>('[data-image-viewer]').forEach(function (element) {
        lightGallery(element, imageViewerDefaultOptions);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageViewers);
} else {
    initImageViewers();
}
