import './style.css'
import MainPage from './components/MainPage.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="main">
    
  </div>
`

const main = document.querySelector<HTMLDivElement>('#main')!

const mainPage = new MainPage({});
main.appendChild(mainPage);