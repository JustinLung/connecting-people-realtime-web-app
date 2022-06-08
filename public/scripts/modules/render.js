const messages = document.querySelector('#message-container')
let name = localStorage.getItem('name') || prompt('What is your name?')

localStorage.setItem('name', name)

// Functions

function renderWelcomeMessage() {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li class="welcome-message">Welcome ${name}, have a great time talking to everybody!</li>`
  )
}

export { renderWelcomeMessage }
