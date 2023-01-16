

const input = document.querySelector('.task-input input');
const taskBox = document.querySelector('.task-box');
const clearAll = document.querySelector('.clear-btn');

const filter = document.querySelectorAll('.filters span');
// console.log(btnFilters);

let editId;
let isEditedTask = false;
let data = JSON.parse(localStorage.getItem('task'));

filter.forEach((item) => {
   item.addEventListener('click', () => {
      document.querySelector('span.active').classList.remove('active');
      item.classList.add('active');

      showList(item.id)
   })
})

function showList(filter) {
   // console.log(filter);
   let li = '';
   if (data) {
      data.forEach((item, ind) => {
         let isChecked = item.status === 'done' ? 'checked' : '';

         if (filter === item.status || filter === 'all') {
            // console.log(filter, item.status);
            li += `
                  <li class="task">
                  <label for="${ind}">
                  <input type="checkbox" onclick="updateStatus(this)" id="${ind}" ${isChecked}/>
                  <p class="${isChecked}">${item.name}</p>
                  </label>
                     <div class="settings">
                        <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                        <ul class="task-menu">
                           <li onclick="editTask(${ind}, '${item.name}')"><i class="fa-solid fa-pencil"></i>edit</li>
                           <li onclick="deleteTask(${ind})"><i class="fa-solid fa-trash"></i>delite</li>
                        </ul>
                     </div>
                  </li>
            `;
         }
      });
   }
   taskBox.innerHTML = li || `<span>У вас нет заметок</span>`;
}

showList('all');

function showMenu(selectedElem) {
   // находим menu div
   const selectedMenu = selectedElem.parentElement.lastElementChild;
   selectedMenu.classList.add('show');
   document.addEventListener('click', (e) => {
      // Убираем class ---'show'--- если нажимаем не на него
      if (e.target.nodeName !== 'I' || e.target !== selectedElem) {
         selectedMenu.classList.remove('show');
      }
   })

}

function editTask(taskId, selectedName) {
   editId = taskId;
   isEditedTask = true;
   input.value = selectedName;
}

function deleteTask(deleteId) {
   // Удаляем елемент с массива по id
   data.splice(deleteId, 1);
   localStorage.setItem('task', JSON.stringify(data))
   showList('all');
}

clearAll.addEventListener('click', () => {
   // Удаляем все елементы с массива
   // data = [];
   data.splice(0, data.length);
   localStorage.setItem('task', JSON.stringify(data))
   showList('all');
})

function updateStatus(selectedElem) {
   // selectedElem -- это <input />
   // находим <p> и вешаем на него class ---'checked'---
   const lastElem = selectedElem.parentElement.lastElementChild;
   if (selectedElem.checked) {
      lastElem.classList.add('checked')
      // обращаемся к localStorage меняем значение status = 'done' 
      data[selectedElem.id].status = 'done'
   } else {
      // если <input /> не отмечен
      // обращаемся к localStorage меняем значение status = 'pending'
      // убераем class ---'checked'---
      lastElem.classList.remove('checked');
      data[selectedElem.id].status = 'pending'
   }
   // Заносим новые знчени в localStorage 
   localStorage.setItem('task', JSON.stringify(data));
   // showList();
}


input.addEventListener('keyup', (e) => {
   const taskInput = input.value.trim();

   if (e.key === 'Enter' && taskInput) {
      if (!isEditedTask) {
         if (!data) {
            data = [];
         }

         let taskUser = { name: taskInput, status: 'pending' };
         data.push(taskUser);

      } else {
         isEditedTask = false;
         data[editId].name = taskInput;
      }

      input.value = '';
      localStorage.setItem('task', JSON.stringify(data));

      showList('all');
   }

})



