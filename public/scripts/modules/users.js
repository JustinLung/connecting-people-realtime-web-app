const usersList = document.querySelector('.users-list')
let name = localStorage.getItem('name') || prompt('What is your name?')

localStorage.setItem('name', name)

function userConnected(name) {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${name} has joined the chat!</li>`
  )
  messages.scrollTo(0, messages.scrollHeight)
}

function userDisconnected(data) {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${data.name} has left the chat!</li>`
  )
  messages.scrollTo(0, messages.scrollHeight)
}

function updateList(users) {
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
}

export { userConnected, userDisconnected, updateList }
