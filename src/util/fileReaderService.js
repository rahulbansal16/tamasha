export const readImage = (file, cb) => {
    if (file.type && file.type.indexOf('image') === -1) {
      console.log('File is not an image.', file.type, file);
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
    //   img.src = event.target.result;
        return cb(event.target.result)
    });
    reader.readAsArrayBuffer(file);
  }
  