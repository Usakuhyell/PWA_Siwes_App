const fullName = document.getElementById('fullName');
const description = document.getElementById('description');
const image = document.getElementById('image');
const form = document.getElementById('uploadform');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const isValid = validation();
  if (isValid === false) {
    return false;
  }

  const nameValue = document.getElementById('fullName').value;
  const photoDescription = document.getElementById('description').value;
  const image = document.getElementById('image').files[0];

  const formData = new FormData();

  formData.append('fullName', nameValue);
  formData.append('imageDescription', photoDescription);
  formData.append('photo', image);

  fetch('submit.php', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      form.reset();
    })
    .catch((err) => {
      console.log('Request not sent:', err);
    });
});

function validation() {
  const onlyLetters = /^[A-Za-z\s]+$/;
  const fullName = document.getElementById('fullName').value.trim();
  const description = document.getElementById('description').value.trim();
  const image = document.getElementById('image').files[0];
  const allowedImageType = ['image/jpeg', 'image/png'];
  const allowedImageSize = 5 * 1024 * 1024;
  const nameError = document.querySelector('.nameError');
  const descriptionError = document.querySelector('.descriptionError');
  const imageError = document.querySelector('.imageError');

  nameError.textContent = '';
  descriptionError.textContent = '';
  imageError.textContent = '';

  if (
    fullName === '' ||
    !onlyLetters.test(fullName) ||
    fullName.length < 3 ||
    fullName.length > 50
  ) {
    nameError.textContent = 'Invalid name.';
    return false;
  }

  if (description.length < 5) {
    descriptionError.textContent =
      'Description must be more than five characters';
    return false;
  }

  if (!image) {
    imageError.textContent = 'Invalid image';
    return false;
  }

  if (!allowedImageType.includes(image.type)) {
    imageError.textContent = 'Invalid image type';
    return false;
  }

  if (image.size > allowedImageSize) {
    imageError.textContent = 'Image is too large.';
    return false;
  }
  return true;
}
