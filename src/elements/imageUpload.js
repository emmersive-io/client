export default class ImageUpload {
    constructor(options, callback) {
        this.element = document.createElement('div');
        this.element.className = 'file-upload ' + options.className;
        this.element.innerHTML = `
            <img class="file-upload__image" />            
            <input class="file-upload__input" type="file" accept="image/*" autocomplete="photo" />
            <div class="file-upload__empty-state">Upload an image</div>`;

        this.image = this.element.firstElementChild;
        this.setImage(options.src);

        var input = this.element.children[1];
        input.addEventListener('change', e => {
            var file = e.target.files[0];
            if (callback) {
                callback(file);
            }

            this.setImage(file);
            return false;
        }, false)
    }

    setImage(file) {
        if (!file) {
            this.image.src = '';
        }
        else if (typeof file === 'string') {
            this.image.src = file;
        }
        else {
            this.file = file;
            var fileReader = new FileReader();
            fileReader.onload = () => this.image.src = fileReader.result;
            fileReader.readAsDataURL(file);
        }

        this.element.classList.toggle('has-image', file != null);
    }
}