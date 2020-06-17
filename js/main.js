//Работа с базой данных
const DBService = class{
    constructor(){
        this.API_KEY = '1daf1068bedbd74b18443b5aa961ffb0';
        this.DOMAIN = 'https://api.themoviedb.org/3';
    }
    getData = async (url) => {
        const res = await fetch(url);
        if(res.ok){
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные 
            по адресу ${url}`);
        }
    };
    getSearchResult = query => {
        return this.getData(`${this.DOMAIN}/search/tv?api_key=${this.API_KEY}&language=ru-RU&page=1&query=${query}&include_adult=true`);
    };
    getTvShow = id => {
        return this.getData(`${this.DOMAIN}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    };
    getPopular = () => {
        return this.getData(`${this.DOMAIN}/tv/popular?api_key=${this.API_KEY}&language=ru-RU&page=1`);
    };
    getTopRated = () => {
        return this.getData(`${this.DOMAIN}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU&page=1`);
    };
}


//Обработка информации и оформление карточек
const renderCard = response => {
    tvShowsList.textContent = '';

    response.results.forEach(item => {

        const {backdrop_path : backdrop,
               name : title,
               poster_path : poster, 
               vote_average : vote,
               id
               } = item;
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop  : ''; 
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = `
        <a href="#" id = ${id} class="tv-card">
            ${voteElem}
            <img class="tv-card__img"
                 src=${posterIMG}
                 data-backdrop="${backdropIMG}"
                 alt="${title}">
                 <h4 class="tv-card__head">${title}</h4>
        </a>
        `;
        loading.remove();
        tvShowsList.append(card);


    });
};


const renderStartPage = () => {
    tvShows.append(loading);
    new DBService().getPopular().then(renderCard);
    document.querySelector('.tv-shows__head').textContent = `Популярное`;
};
renderStartPage();


//Поиск
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('.tv-shows__head').textContent = `Результат поиска по запросу "${searchFormInput.value}"`;
    document.querySelector('.tv-shows__head').style = "display: inline";
    const value = searchFormInput.value.trim();
    if(value){
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';

});




//Открыть и закрыть левое меню
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});


//Закрыть левое меню при клике вне меню
document.addEventListener('click', event => {
    if(!event.target.closest('.left-menu')){ //!!!!!!!!!!!!!!!!!ПОЛЕЗНО
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});


//Обработчики кнопок левого окна
leftMenuTopRated.addEventListener('click',() => {
    document.querySelector('.tv-shows__head').textContent = `Лучшее`;
    new DBService().getTopRated().then(renderCard);
});

leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if(dropdown){
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});
leftMenuSearch.addEventListener('click',() => {
    document.querySelector('.tv-shows__head').textContent = '';
    tvShowsList.textContent = '';
});
leftMenuPopular.addEventListener('click',() => {
    document.querySelector('.tv-shows__head').textContent = `Популярное`;
    new DBService().getPopular().then(renderCard);
});
//Работа с модальным окном
tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    preloader.style = 'display:block';
    const target = event.target;
    const card = target.closest('.tv-card');
    if(card){
        new DBService().getTvShow(card.id)
            .then(response => {
                console.log(response);
                tvCardImg.src = IMG_URL + response.poster_path;
                modalTitle.textContent = response.name;
                genresList.textContent = '';
                for (const item of response.genres){
                    genresList.innerHTML += `<li>${item.name}</li>`;
                }
                rating.textContent = response.vote_average;
                description.textContent = response.overview;
                modalLink.href = response.homepage; 
                
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
                preloader.style = 'display:none';
            })

    }
});


//Закрыть модальное окно
modal.addEventListener('click', event => {
    event.preventDefault();
    if(event.target.closest('.cross') ||
       event.target.classList.contains('modal')){
        document.body.style.overflow = 'auto';
        modal.classList.add('hide');
    }
});


//Смена постера при наведении
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if(card){
        const img = card.querySelector('.tv-card__img');
        if(img.dataset.backdrop){
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }
    }
};
tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);


//Открывает популярное при клике на название сайта
mainTitle.addEventListener("click", () => {
    document.querySelector('.tv-shows__head').textContent = `Популярное`;
    tvShowsList.textContent = '';
    renleftMenuPopular.addEventListener('click',() => {
        document.querySelector('.tv-shows__head').textContent = `Популярное`;
        new DBService().getPopular().then(renderCard);
    });derStartPage();
    loading.remove();
});