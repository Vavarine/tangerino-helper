const { powerSaveBlocker } = require('electron');
const Store = require('electron-store');

const store = new Store();
const storedSettings = store.get('settings')

window.addEventListener('DOMContentLoaded', () => {
  const save = document.querySelector('.save');
  const inputs = [...document.querySelectorAll("input")]

  console.log(storedSettings)

  if (storedSettings) {
    Object.keys(storedSettings).forEach(key => {
      console.log(key)
      const input = inputs.filter(input => input.name === key)[0]
      console.log(input)

      try {
        input.value = storedSettings[key]
      } catch (error) {
      }
    })
  }

  save.addEventListener('click', () => {
    const settings = inputs.reduce((acc, input) => {
      return { ...acc, [input.name]: input.value }
    }, {})

    const buttonText = save.textContent

    save.textContent = "Salvo!"

    setTimeout(() => {
      save.textContent = buttonText
    }, 2000)

    store.set('settings', settings)
  })
})