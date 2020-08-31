import $ from 'jquery';
import 'lightgallery';
import 'lg-fullscreen';

window.$ = $;

window.addImageViewer = function(elem, options) {
    if (options === undefined) {
        options = {
            share: false,
            autoplay: false,
            autoplayControls: false
        };
    }

    return $(elem).lightGallery(options);
}
