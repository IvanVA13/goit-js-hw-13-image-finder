import * as basicLightbox from 'basiclightbox'
import 'basiclightbox/src/styles/main.scss'

function createModal(link, name) {
    const modal = basicLightbox.create(`
    <div class="modal">
            <img src=${link} alt=${name} width="800" height="600">
    </div>
`)
modal.show()
}

export default createModal