// Variables
const socket = io()

// User List Variables
const userButton = document.querySelector('#user-button')
const closeButton = document.querySelector('.close-button')
const usersList = document.querySelector('.users-list')
const overlay = document.querySelector('.overlay')

// Messages Variables
const messages = document.querySelector('#message-container')
const loadingMessages = document.querySelector('#loading-messages')
const messageInput = document.querySelector('#message-input')
const messageForm = document.querySelector('form')
const submitButton = document.querySelector('.submit-button')
const isTyping = document.querySelector('#is-typing')
const date = new Date().toLocaleDateString('en-gb')
const smileyButton = document.querySelector('#smiley-button')
const emojis = document.querySelector('.emojis')

const name = localStorage.getItem('name') || prompt('What is your name?')

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
  const message = messageInput.value
  renderSendMessage()
  socket.emit('send-chat-message', message)
  messageInput.value = ''
  messages.scrollTo(0, messages.scrollHeight)
})

messageInput.addEventListener('keypress', function () {
  socket.emit('typing', name)
})

smileyButton.addEventListener('click', () => {
  emojis.classList.toggle('dissapear')
})

emojis.addEventListener('click', (e) => {
  if (e.target != e.currentTarget) {
    const smiley = e.target
    messageInput.value += smiley.textContent
    messageInput.focus()
  }
})

// Socket.io Functions

socket.emit('new-user', name)

socket.on('user-connected', (name) => {
  renderUserConnected(name)
})

socket.on('chat-message', (data) => {
  renderChatMessage(data)
})

socket.on('user-disconnected', (data) => {
  renderUserDisconnected(data)
})

socket.on('update-list', (users) => {
  renderUpdateList(users)
})

socket.on('typing', (data) => {
  renderIsTyping(data)
})

// Functions

function renderUserConnected(name) {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${name} has joined the chat!</li>`
  )
  messages.scrollTo(0, messages.scrollHeight)
}

function renderUserDisconnected(data) {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${data} has left the chat!</li>`
  )
  messages.scrollTo(0, messages.scrollHeight)
}

function renderChatMessage(data) {
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
}

function renderUpdateList(data) {
  usersList.innerHTML = ''
  const userList = Object.values(data)
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
}

function renderIsTyping(data) {
  isTyping.innerHTML = `<p><em> ${data} is typing...</em></p>`
  setTimeout(() => {
    isTyping.innerHTML = ''
  }, 5000)
}

function renderWelcomeMessage() {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li class="welcome-message">Welcome ${name}, have a great time talking to everybody!</li>`
  )
}

function renderSendMessage() {
  if (messageInput.value === '') return
  isTyping.innerHTML = ''
  const message = messageInput.value
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
