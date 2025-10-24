  const images = [
    'Slide1.jpg', 'Slide2.jpg', 'Slide3.jpg', 'Slide4.jpg', 'Slide5.jpg', 
    'Slide6.jpg', 'Slide7.jpg', 'Slide8.jpg', 'Slide9.jpg', 'Slide10.jpg',
    'Slide11.jpg', 'Slide12.jpg', 'Slide13.jpg', 'Slide14.jpg', 'Slide15.jpg',
    'Slide16.jpg', 'Slide17.jpg', 'Slide18.jpg', 'Slide19.jpg', 'Slide20.jpg',
    'Slide21.jpg', 'Slide22.jpg', 'Slide23.jpg', 'Slide24.jpg', 'Slide25.jpg',
    'Slide26.jpg', 'Slide27.jpg', 'Slide28.jpg', 'Slide29.jpg', 'Slide30.jpg',
    'Slide31.jpg', 'Slide32.jpg', 'Slide33.jpg', 'Slide34.jpg', 'Slide35.jpg',
    'Slide36.jpg', 'Slide37.jpg', 'Slide38.jpg'
];

  const book = document.getElementById('book');

  images.forEach((img, i) => {
    const page = document.createElement('div');
    page.className = 'page';
    page.id = 'page' + (i + 1);

    const image = document.createElement('img');
    image.src = "pages/" + img;
    image.alt = `Page ${i + 1}`;
	
	
    page.appendChild(image);
    book.appendChild(page);
	page.style.zIndex = images.length-i;
  });