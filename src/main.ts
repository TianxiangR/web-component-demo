import "./style.css";
import "./components/TodoList";

const main = document.querySelector<HTMLDivElement>("#app")!;
main.innerHTML = /*html*/ `
<style>
  .main-container {
    display: flex;
    flex-direction: column;
  }

  h1.h1__title {
    font-weight: 1;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 0.5em;
  }

  ul {
    list-style: none;
    padding: 0;
  }
  </style>
<div class="main-container">
  <h1 class="h1__title">ToDo List</h1>
  <todo-list></todo-list>
</div>
`;
