let body = document.querySelector('.body'),
    burger = document.querySelector('.header__burger'),
    asideClass = 'body--aside';

burger.addEventListener('click', () => {
    if(body.classList.contains(asideClass)){
        body.classList.remove(asideClass);
    }else {
        body.classList.add(asideClass);
    }
})