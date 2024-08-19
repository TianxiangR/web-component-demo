import './style.css'
import './components/TodoList'

const main = document.querySelector<HTMLDivElement>('#app')!
main.innerHTML = /*html*/`
<style>
  .main-container {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }
  </style>
<div class="main-container">
  <todo-list></todo-list>
</div>
`