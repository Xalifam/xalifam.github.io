  const images = [
    'Slide1.JPG', 'Slide2.JPG', 'Slide3.JPG', 'Slide4.JPG', 'Slide5.JPG', 
    'Slide6.JPG', 'Slide7.JPG', 'Slide8.JPG', 'Slide9.JPG', 'Slide10.JPG',
    'Slide11.JPG', 'Slide12.JPG', 'Slide13.JPG', 'Slide14.JPG', 'Slide15.JPG',
    'Slide16.JPG', 'Slide17.JPG', 'Slide18.JPG', 'Slide19.JPG', 'Slide20.JPG',
    'Slide21.JPG', 'Slide22.JPG', 'Slide23.JPG', 'Slide24.JPG', 'Slide25.JPG',
    'Slide26.JPG', 'Slide27.JPG', 'Slide28.JPG', 'Slide29.JPG', 'Slide30.JPG',
    'Slide31.JPG', 'Slide32.JPG', 'Slide33.JPG', 'Slide34.JPG', 'Slide35.JPG',
    'Slide36.JPG', 'Slide37.JPG', 'Slide38.JPG'
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