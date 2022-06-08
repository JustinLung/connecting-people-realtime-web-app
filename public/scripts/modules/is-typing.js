const isTyping = document.querySelector('#is-typing')

function typing(data) {
  isTyping.innerHTML = `<p><em> ${data} is typing...</em></p>`
  setTimeout(() => {
    isTyping.innerHTML = ''
  }, 5000)
}

export { typing }