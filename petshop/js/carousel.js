// Deslizar automático do carrossel (simples)
let scrollPosition = 0;
const carousel = document.getElementById("carousel");

setInterval(() => {
  scrollPosition += 200;
  if (scrollPosition >= carousel.scrollWidth) {
    scrollPosition = 0;
  }
  carousel.scrollTo({
    left: scrollPosition,
    behavior: "smooth"
  });
}, 3000);
