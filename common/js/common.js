const container = document.querySelector('html');
const topBtn = document.querySelector('.footer__top--btn');

topBtn.addEventListener('click', function(e){
    e.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'})
});