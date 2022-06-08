const socket = io()

const messages = document.querySelector('#message-container')
const messageInput = document.querySelector('#message-input')
const loadingMessages = document.querySelector('#loading-messages')
let date = new Date().toLocaleDateString('en-gb')
const isTyping = document.querySelector('#is-typing')
let name = localStorage.getItem('name') || prompt('What is your name?')

localStorage.setItem('name', name)

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
  socket.emit('send-chat-message', message)
  messageInput.value = ''
  messages.scrollTo(0, messages.scrollHeight)
}

function renderMessage() {
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

export { renderSendMessage, renderMessage }
