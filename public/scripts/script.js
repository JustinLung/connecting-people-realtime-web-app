// imports
import { renderWelcomeMessage } from './modules/render.js'
import { renderSendMessage, renderMessage } from './modules/messages.js'
import { userConnected, userDisconnected, updateList } from './modules/users.js'
import { typing } from './modules/is-typing.js'

// Variables
const socket = io()

const userButton = document.querySelector('#user-button')
const closeButton = document.querySelector('.close-button')
const overlay = document.querySelector('.overlay')
const messageInput = document.querySelector('#message-input')
const messageForm = document.querySelector('form')
const smileyButton = document.querySelector('#smiley-button')
const emojis = document.querySelector('.emojis')

// Eventlisteners and Function Decleration

userButton.addEventListener('click', () => {
  overlay.classList.add('open-menu')
})

closeButton.addEventListener('click', () => {
  overlay.classList.remove('open-menu')
})

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  renderSendMessage()
})

renderWelcomeMessage()

smileyButton.addEventListener('click', () => {
  emojis.classList.toggle('dissapear')
})

emojis.addEventListener('click', (event) => {
  if (event.target != event.currentTarget) {
    const smiley = event.target
    messageInput.value += smiley.textContent
    messageInput.focus()
  }
})

messageInput.addEventListener('keypress', function () {
  socket.emit('typing', name)
})

// Socket.io Functions

socket.emit('new-user', name)

socket.on('user-connected', (name) => {
  userConnected(name)
})

socket.on('chat-message', (data) => {
  renderMessage(data)
})

socket.on('user-disconnected', (data) => {
  userDisconnected(data)
})

socket.on('update-list', (users) => {
  updateList(users)
})

socket.on('typing', (data) => {
  typing(data)
})