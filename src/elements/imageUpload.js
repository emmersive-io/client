export default class ImageUpload {
    constructor(options, callback) {
        this.element = document.createElement('div');
        this.element.className = 'file-upload ' + options.className;
        this.element.innerHTML = `
            <img class="file-upload__image" src="${options.src}"/>
            <input class="file-upload__input" type="file" accept="image/*" capture autocomplete="photo" />`;

        this.image = this.element.firstElementChild;
        this.input = this.element.lastElementChild;

        this.input.addEventListener('change', function (e) {
            var file = e.target.files[0];
            callback(file, {contentType: file.type});
            return false;
        }, false)
    }

    setImage(imageSrc) {
        this.image.src = imageSrc;
    }
}