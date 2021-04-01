
function solutionsItemsToggleClass() {
    const item = document.querySelectorAll('.solutions-item')
    item.forEach(i => {
        i.addEventListener('click', e => {
            e.target.classList.toggle('active')
        })
    })
}
solutionsItemsToggleClass()

function checkboxToggle() {
    let checkbox = document.querySelector('#agreed-check')
    let fakeCheckbox = document.querySelector('.checkbox-inside')
    if(checkbox.checked) {
        fakeCheckbox.classList.add('active')
    } else {
        fakeCheckbox.classList.remove('active')
    }
}
checkboxToggle()