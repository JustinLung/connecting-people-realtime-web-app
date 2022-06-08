function typing() {
  isTyping.innerHTML = `<p><em> ${data} is typing...</em></p>`
  setTimeout(() => {
    isTyping.innerHTML = ''
  }, 5000)
}

export { typing }
