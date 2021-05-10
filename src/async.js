import notification from './js/notification'
import './styles.css'
import isAlpha from 'validator/lib/isAlpha';
import formMkp from './templates/form.hbs'
import btnListMkp from './templates/btn-list.hbs'
import imagesCardsMkp from './templates/images.hbs'
import fetch from './js/asyncApiService'
import createModal from './js/modal'
import debounce from 'lodash.debounce';
const inputRef = document.querySelector("#form-container")
const btnRef = document.querySelector("#btn-list")
const galleryRef = document.querySelector('.gallery')
const observerOptions = {
      rootMargin: '100px',
    };
const observerHandler = entries => {
      if (entries[0].isIntersecting) {
          incrementPage()
          fetch.fetchPictures().then(data => infinityRender(data))
      }
    };
const observerElement = document.createElement('div');  
const observer = new IntersectionObserver(observerHandler, observerOptions);
observer.observe(observerElement)
galleryRef.insertAdjacentElement('afterend', observerElement)
inputRef.insertAdjacentHTML('afterbegin', formMkp())

inputRef.addEventListener('input', debounce(onInput, 500));
btnRef.addEventListener('click', addNewPage);
galleryRef.addEventListener('click', showBigImage);

function onInput(e) {
    if (!isAlpha(e.target.value, 'en-US', { ignore: " -" })) {
        notification.error({ text: notification.text.error });
        addStyleInputBorder(e.target, "invalid", "valid")
    } else {
        galleryRef.innerHTML = ''
        addStyleInputBorder(e.target, "valid", "invalid")
        btnRef.innerHTML = btnListMkp()
        fetch.options.page = 1
        fetch.options.query = e.target.value
        disableBtn()
        getHitsByQuery();
    }
}

function getHitsByQuery() {
    fetch.fetchPictures().then(data => {
        if (data.totalHits !== 0) {
            notification.success({ text: notification.text.success })
            return renderAfterQuery(data)
        } else {
            notification.alert({ text: notification.text.empty })
        }

    }).catch(()=>notification.alert({ text: notification.text.alert }))
}

function addStyleInputBorder(target, add, rem) {
    target.classList.add(add)
    target.classList.remove(rem)
}

function addNewPage(e) {
    e.preventDefault()
    if (e.target.dataset.btn === 'prev') {
        fetch.options.page -= 1
        getHitsByQuery()
    }
    if (e.target.dataset.btn === 'next') {
        document.querySelector('[data-btn="prev"]').removeAttribute('disabled')
        incrementPage()
        getHitsByQuery()
    }
    disableBtn()
}

function incrementPage() {
    fetch.options.page += 1
}

function disableBtn() {
    if (fetch.options.page === 1) {
    document.querySelector('[data-btn="prev"]').setAttribute('disabled', ' ')
    }
    if (fetch.options.page === fetch.options.last_page) {
    document.querySelector('[data-btn="next"]').setAttribute('disabled', ' ')
    }
}

function renderAfterQuery(data) {
    galleryRef.innerHTML = imagesCardsMkp(data.hits)
}

function infinityRender(data) {
    galleryRef.insertAdjacentHTML('beforeend', imagesCardsMkp(data.hits))
}

function showBigImage(e) {
    createModal(e.target.dataset.src, e.target.alt)
}