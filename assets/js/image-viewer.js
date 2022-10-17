import $ from 'jquery';
import lightGallery from 'lightgallery';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

window.$ = $;

window.addImageViewer = function(id, options) {
    if (options === undefined) {
        options = {
            plugins: [lgFullscreen, lgThumbnail],
            share: false,
            autoplay: false,
            autoplayControls: false,
            thumbnail: true
        };
    }
    return lightGallery(document.getElementById(id), options);

}
