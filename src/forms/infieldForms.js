import onReady from '../core/onReady';

function updateFormField(e) {
    if (e.target.closest('.form--infield')) {
        var label = e.target.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            var isActive = (e.target === document.activeElement || e.target.value.length > 0 );
            label.classList.toggle('is-active', isActive);
        }
    }
}

onReady(function () {
    document.body.addEventListener('blur', updateFormField, true);
    document.body.addEventListener('focus', updateFormField, true);
    document.body.addEventListener('input', updateFormField, false);
});