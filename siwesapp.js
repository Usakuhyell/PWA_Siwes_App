const fullName = document.getElementById('fullName');
const description = document.getElementById('description');
const image = document.getElementById('image');
const form = document.getElementById('uploadform');

form.addEventListener('submit', (event) => {
  const submitText = document.getElementById('submit');
  submitText.textContent = 'Uploading...';

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
      if (data.status === 'success') {
        submitText.textContent = 'Click Home to see your photo';
      }
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

const cards = document.getElementById('cards');
const studentName = document.getElementById('studentName');
const imgDescription = document.getElementById('imgDescription');
const projectImage = document.getElementById('projectImage');

fetch('getsubmissions.php')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.forEach((post) => {
      cards.innerHTML += `
    <div class="card">
      <div class="card-image">
        <img src="${post.Image_url}" alt="Project image">
      </div>

      <h3>${post.full_name}</h3>
      <p>${post.Image_description}</p>
    </div>
  `;
    });

    console.log('Data fetched successfully');
  })
  .catch((err) => {
    console.log('Rejected:', err);
  });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}
