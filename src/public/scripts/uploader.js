class Uploader {
  constructor() {
    this.form = document.querySelector('.upload-form');
    this.inputFile = document.querySelector('.uploader-form__input');
    this.label = document.querySelector('.uploader-form__label');
    this.uploadBtn = document.querySelector('.uploader-form__btn');
  }

  events() {
    this.form.addEventListener('submit', (e) => e.preventDefault());
    this.uploadBtn.addEventListener('click', (e) => this.handleClick(e));
    this.inputFile.addEventListener('change', (e) => this.handleChange(e));
  }

  handleChange(e) {
    const file = e.target.files[0];

    if (!file) {
      this.label.textContent = 'Select or drag over a file';
      return;
    }

    encryptionStream(file);
  }
}
