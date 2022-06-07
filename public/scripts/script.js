// Variables

let socket = io()
let userButton = document.querySelector('#user-button')
let closeButton = document.querySelector('.close-button')
let usersList = document.querySelector('.users-list')
let userCountEl = document.querySelector('.user-count')
let overlay = document.querySelector('.overlay')
let messages = document.querySelector('#message-container')
let loadingMessages = document.querySelector('#loading-messages')
let messageInput = document.querySelector('#message-input')
let messageForm = document.querySelector('form')
let submitButton = document.querySelector('.submit-button')
let name = localStorage.getItem('name') || prompt('What is your name?')
let isTyping = document.querySelector('#is-typing')
let date = new Date().toLocaleDateString('en-gb')

// Eventlisteners and Function Decleration

userButton.addEventListener('click', () => {
  overlay.classList.add('open-menu')
})

closeButton.addEventListener('click', () => {
  overlay.classList.remove('open-menu')
})

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  isTyping.innerHTML = ''
  let message = messageInput.value
  loadingMessages.insertAdjacentHTML(
    'beforeend',
    `
    <li class="loading-message">
      <span class="circle-loading">${name.charAt(0)}</span>
      <div class="message">
        <h2>${name} ${date}</h2>
        <p>${message}</p>
        <p class="loading-margin"><img class="loading-image" src="assets/icons/clock.svg" /> Sending...</p>
      </div>
    </li>
  `
  )
  setTimeout(() => {
    loadingMessages.innerHTML = ''
    messages.insertAdjacentHTML(
      'beforeend',
      `
      <li>
        <span class="circle">${name.charAt(0)}</span>
        <div class="message">
          <h2>${name} ${date}</h2>
          <p>${message}</p>
        </div>
      </li>
    `
    )
  }, 500)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
  messages.scrollTo(0, messages.scrollHeight)
})

localStorage.setItem('name', name)

renderWelcomeMessage()

messageInput.addEventListener('keypress', function () {
  socket.emit('typing', name)
})

// Socket.io Functions

socket.emit('new-user', name)

socket.on('user-connected', (name) => {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${name} has joined the chat!</li>`
  )
})

socket.on('chat-message', (data) => {
  isTyping.innerHTML = ''
  loadingMessages.insertAdjacentHTML(
    'beforeend',
    `
    <li class="loading-message">
      <span class="circle-loading">${name.charAt(0)}</span>
      <div class="message">
        <h2>${name} ${date}</h2>
        <p>${message}</p>
        <p class="loading-margin"><img src="assets/icons/clock.svg" /> Sending...</p>
      </div>
    </li>
  `
  )
  setTimeout(() => {
    loadingMessages.innerHTML = ''
    messages.insertAdjacentHTML(
      'beforeend',
      `
      <li>
        <span class="circle">${name.charAt(0)}</span>
        <div class="message">
          <h2>${name} ${date}</h2>
          <p>${message}</p>
        </div>
      </li>
    `
    )
  }, 2000)
  messages.scrollTo(0, messages.scrollHeight)
})

socket.on('user-disconnected', (data) => {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${name} has left the chat!</li>`
  )
  messages.scrollTo(0, messages.scrollHeight)
})

socket.on('update-list', (users) => {
  usersList.innerHTML = ''
  const userList = Object.values(users)
  if (userList.length === 1 && userList[0] === name) {
    usersList.insertAdjacentHTML(
      'beforeend',
      `<p class="no-users-text">There is no one in this chatroom.</p>`
    )
  } else {
    userList.forEach((user) => {
      usersList.insertAdjacentHTML('beforeend', `<li>${user}</li>`)
    })
  }
})

socket.on('typing', (data) => {
  isTyping.innerHTML = `<p><em> ${data} is typing...</em></p>`
  setTimeout(() => {
    isTyping.innerHTML = ''
  }, 5000)
})

// Functions

function renderWelcomeMessage() {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li class="welcome-message">Welcome ${name}, have a great time talking to everybody!</li>`
  )
}
