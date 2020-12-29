let add = $('.add');
let toggleAddProd = $('.add-product');
let searchValue = '';
let page = 1,
itemCount = 1;

$('.search').on('input', function(event) {
    searchValue = event.target.value;
    renderProd();
})

function getPagination() {

    fetch('http://localhost:8000/products')
        .then(res => res.json())
        .then(data => {
            pageCount = Math.ceil(data.length / 4);
            $('.pagination-page').remove()
            for(let i = pageCount; i >= 1; i--) {
                console.log(i)
                $('.previous-btn').after(`
                <span class="pagination-page">
                <button class="links" alt="....">
                ${i}
                </button>
                </span>
                `);
            }
        })
}

$('body').on('click', '.links', (e) => {
    page = e.target.innerText
    renderProd()
})



add.on('click', function() {
    $('.main-modal').css('display', 'block');
});

toggleAddProd.on('click', function() {
    if(!$('.title').val() || !$('.year').val() || !$('.image').val() || !$('.type').val() || !$('.genre').val() || !$('.description').val()){
        return alert('Заполните поля')
    }

    let movie = {
        title: $('.title').val(),
        year: $('.year').val(),
        image: $('.image').val(),
        type: $('.type').val(),
        genre: $('.genre').val(),
        description: $('.description').val()
    }
    fetch('http://localhost:8000/products', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {'Content-type': 'application/json'}
    })
    .then(() => {
        $('.main-modal').css('display', 'none')
        renderProd()
        $('.title').val('')
        $('.year').val('')
        $('.image').val('')
        $('.type').val('')
        $('.genre').val('')
        $('.description').val('')

    });
});

function renderProd() {
    fetch(`http://localhost:8000/products?_page=${page}&_limit=4&q=${searchValue}`)
        .then(res => res.json())
        .then(prod => {
            getPagination()
            $('.movies-block').html('')
            prod.forEach(item => {
                $('.movies-block').append(`
                <div class="movie-block">
                    <img class="mobile" src="${item.image}" alt="">
                    <h3 href="#">${item.title}</h3>
                    <p class="description">${item.description.slice(0, 100)}....</p>
                    <button id="${item.id}" class="btn-edit"><i class="fa fa-edit"></i>Редактировать</button>
                    <button id="${item.id}" class="btn-delete"><i class="fa fa-trash"></i>Удалить</button>
                </div>
                `)
            })
        })
}

$('body').on('click', '.btn-delete', function() {
    let id = this.id;
    fetch(`http://localhost:8000/products/${id}`, {
        method: 'DELETE'
    })
        .then(() => renderProd())
})


$('body').on('click', '.btn-edit', function() {
    let id = this.id;
    fetch(`http://localhost:8000/products/${id}`)
        .then(res => res.json())
        .then(prod => {
            $('.edit-title').val(prod.title)
            $('.edit-type').val(prod.type)
            $('.edit-image').val(prod.image)
            $('.edit-description').val(prod.description)
            $('.edit-genre').val(prod.genre)
            $('.edit-year').val(prod.year)
            $('.save-product').attr('id', id)
            $('.edit-main-modal').css('display', 'block')
            $('.edit-btn-close').attr('id', id)
        })
});

    $('.edit-btn-close').on('click', function() {
        $('.edit-main-modal').css('display', 'none');
    })

$('.save-product').on('click', function() {
    if(!$('.edit-title').val() || !$('.edit-year').val() || !$('.edit-image').val() || !$('.edit-type').val() || !$('.edit-genre').val() || !$('.edit-description').val()){
        return alert('Заполните поля')
    }
    let newProducts = {
        title: $('.edit-title').val(),
        type: $('.edit-type').val(),
        price: $('.edit-price').val(),
        image: $('.edit-image').val(),
        description: $('.edit-description').val()
    }
    fetch(`http://localhost:8000/products/${this.id}`, {
        method: 'PATCH',
        body: JSON.stringify(newProducts),
        headers: {'Content-type': 'application/json'}
    })
        .then(() => {
            $('.edit-main-modal').css('display', 'none')
            renderProd()
        });
})

$('.btn-close').on('click', function() {
    $('.main-modal').css('display', 'none');
});

$('.next-btn').on('click', function() {
    if(page >= pageCount) return;
    page++;
    renderProd();
})

$('.previous-btn').on('click', function() {
    if(page <= 1) return;
    page--;
    renderProd()
})




renderProd()