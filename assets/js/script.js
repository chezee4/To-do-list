

 window.addEventListener("DOMContentLoaded", () =>{

    const form = document.querySelector('.to-do__form');
    const input = document.querySelector('.input');
    const list = document.querySelector('.list');
    const  errorMessage  = document.querySelector('.text');
  

        const createListItem = (task, id, isActive = false) =>{
            const li = document.createElement('li');
            li.classList.add('list__item');
            if (isActive) {
                li.classList.add('active');
            }
            li.textContent = task;
            li.dataset.id = id;
            const img = document.createElement('img');
            img.classList.add("delete");
            img.src = "./assets/icon/trash.png";
            li.append(img);
            list.prepend(li);
        }
            const  getData = async() => {
            try {
                const response = await fetch('http://localhost:3000/list');
                const data = await response.json();
                await  data.forEach(item => {
                       createListItem(item.task, item.id, item.isActive);
                });
            } catch (reject) {
                console.log("Упс...");
            }
        }

        list.addEventListener('click', async event => {
            if (event.target.tagName === "LI") {
                const li = event.target;
                const id = li.dataset.id;
                const isActive = !li.classList.contains('active');
                try {
                    await fetch(`http://localhost:3000/list/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify( {isActive} )
                    });
                    li.classList.toggle('active');
                } catch (reject) {
                    console.log("Упс...");
                }
            }
        });
         
        const checkedValue = event => event.target.value.length >= 35? errorMessage.style.display = "block": errorMessage.style.display = "none"
        input.addEventListener('input', checkedValue);


        form.onSubmit = async event => {
            event.preventDefault();
            const task = input.value;
            if (task.trim() === ""|| task.length>=35) {
                form.reset(); 
                errorMessagep.style.display ="none";
                return;
            }
            
            form.reset(); 
            try {
                const response = await fetch('http://localhost:3000/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ task })
                });
                const data = await response.json();
                createListItem(task, data.id);
            } catch (reject) {
                console.log("Упс...");
            }
        });
        


        list.addEventListener('click', async event => {
            if (event.target.tagName === "IMG") {
                const li = event.target.parentNode;
                const id = li.dataset.id;
                try {
                     await fetch(`http://localhost:3000/list/${id}`, {
                        method: 'DELETE'
                    });
                    list.removeChild(li);
                } catch (reject) {
                    console.log("Упс...");
                }
            }
        });
        
        getData();

 });
