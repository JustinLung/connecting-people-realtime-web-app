// Variables
let socket = io()

// User List Variables
let userButton = document.querySelector('#user-button')
let closeButton = document.querySelector('.close-button')
let usersList = document.querySelector('.users-list')
let overlay = document.querySelector('.overlay')

// Messages Variables
let messages = document.querySelector('#message-container')
let loadingMessages = document.querySelector('#loading-messages')
let messageInput = document.querySelector('#message-input')
let messageForm = document.querySelector('form')
let submitButton = document.querySelector('.submit-button')
let isTyping = document.querySelector('#is-typing')
let date = new Date().toLocaleDateString('en-gb')

let name = localStorage.getItem('name') || prompt('What is your name?')
let smileyButton = document.querySelector('#smiley-button')

// Eventlisteners and Function Decleration
localStorage.setItem('name', name)

renderWelcomeMessage()

userButton.addEventListener('click', () => {
  overlay.classList.add('open-menu')
})

closeButton.addEventListener('click', () => {
  overlay.classList.remove('open-menu')
})

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  let message = messageInput.value
  renderSendMessage()
  socket.emit('send-chat-message', message)
  messageInput.value = ''
  messages.scrollTo(0, messages.scrollHeight)
})

messageInput.addEventListener('keypress', function () {
  socket.emit('typing', name)
})

smileyButton.addEventListener('click', (e) => {
  messageInput.value += '&#128512;'
  return
})

// Socket.io Functions

socket.emit('new-user', name)

socket.on('user-connected', (name) => {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${name} has joined the chat!</li>`
  )
  messages.scrollTo(0, messages.scrollHeight)
})

socket.on('chat-message', (data) => {
  isTyping.innerHTML = ''
  messages.insertAdjacentHTML(
    'beforeend',
    `
    <li class="loading-message">
      <span class="circle loading">${name.charAt(0)}</span>
      <div class="message">
        <h2>${data.name} ${date}</h2>
        <p>${data.message}</p>
      </div>
    </li>
  `
  )
  messages.scrollTo(0, messages.scrollHeight)
})

socket.on('user-disconnected', (data) => {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${data.name} has left the chat!</li>`
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

function renderSendMessage() {
  if (messageInput.value === '') return
  isTyping.innerHTML = ''
  let message = messageInput.value
  loadingMessages.insertAdjacentHTML(
    'beforeend',
    `
    <li class="loading-message">
      <span class="circle loading">${name.charAt(0)}</span>
      <div class="message">
        <h2>${name} ${date} <span><img class="loading-image" src="assets/icons/clock.svg" /> Sending...</span></h2>
        <p>${message}</p>
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
}
