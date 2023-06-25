window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".to-do__form");
  const input = document.querySelector(".input");
  const toDoList = document.querySelector(".list");
  const errorMessage = document.querySelector(".text");

  const createListItem = (task, id, isActive = false) => {
    const toDoItem = document.createElement("li");
    toDoItem.classList.add("list__item");
    if (isActive) {
      toDoItem.classList.add("active");
    }
    toDoItem.textContent = task;
    toDoItem.dataset.id = id;
    const btnTrash = document.createElement("button");
    btnTrash.classList.add("delete");
    toDoItem.append(btnTrash);
    toDoList.prepend(toDoItem);
  };
  const getData = () => {
    request().then((data) =>
      data.forEach((item) => createListItem(item.title, item.id))
    );
  };

  const request = async (
    url = "https://jsonplaceholder.typicode.com/posts?_start=0&_limit=4",
    method = "GET",
    body = null,
    headers = { "Content-Type": "application/json" }
  ) => {
    try {
      const response = await fetch(url, { method, headers, body });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  toDoList.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
      const toDoItem = event.target;
      const id = toDoItem.dataset.id;
      const isActive = !toDoItem.classList.contains("active");
      request(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        "PATCH",
        JSON.stringify({ isActive })
      );
      toDoItem.classList.toggle("active");
    }
  });

  const checkedValue = (event) =>
    event.target.value.length >= 35
      ? (errorMessage.style.display = "block")
      : (errorMessage.style.display = "none");
  input.oninput = (event) => checkedValue(event);
  form.onsubmit = (event) => {
    event.preventDefault();
    const task = input.value;
    if (task.trim() === "") {
      form.reset();
      errorMessage.style.display = "none";
      return;
    }
    form.reset();
    request(
      "https://jsonplaceholder.typicode.com/posts/",
      "POST",
      JSON.stringify({ title: task })
    ).then((e) => createListItem(e.title, e.id));
  };

  toDoList.onclick = (event) => {
    if (event.target.tagName === "BUTTON") {
      const toDoItem = event.target.parentNode;
      const id = toDoItem.dataset.id;
      request(`https://jsonplaceholder.typicode.com/posts/${id}`, "DELETE");
      toDoList.removeChild(toDoItem);
    }
  };

  getData();
});
