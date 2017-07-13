let todoapp = document.querySelector('.todoapp')
let clearCompleted = todoapp.querySelector('.clear-completed');
let todoCount = todoapp.querySelector('.todo-count');
let labelValue, editLi

// 内容输入创建节点
todoapp.addEventListener('keyup', function(e) {
  let todoList = todoapp.querySelector('.todo-list')
  let newTodo = todoapp.querySelector(".new-todo")
  let toggleAll = todoapp.querySelector('.toggle-all');
  if (e.key === 'Enter' && newTodo.value.trim()) {
    let li = `
    <li class="active">
      <div class="view">
        <input class="toggle" type="checkbox">
        <label>${newTodo.value}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" name="title">
    </li>
    `
    toggleAll.checked = false
    let listItem = document.createElement('div')
    listItem.innerHTML = li
    todoList.appendChild(listItem.firstElementChild)
    newTodo.value = ""
    checkActive()
  }

  if (e.key === 'Enter' && e.target.className === 'edit' || e.key === 'Escape') {
    if (!editLi.querySelector('.edit').value.trim()) {
      editLi.classList.remove('editing')
    } else {
      labelValue.innerHTML = editLi.querySelector('.edit').value;
      editLi.classList.remove('editing')
      editLi.querySelector('.edit').value = ""
    }
  }
})

// 用事件代理来处理所有事件
todoapp.addEventListener('click', function(e) {
  let toggleAll = todoapp.querySelector('.toggle-all');
  let toggleInput = todoapp.querySelectorAll('.toggle');
  // 单个完成与取消
  if (e.target.className === 'toggle') {
    if (Array.from(toggleInput).every(it => it.checked)) {
      toggleAll.checked = true
    } else {
      toggleAll.checked = false
    }
    if (e.target.checked) {
      e.target.parentElement.parentElement.classList.add('completed')
      e.target.parentElement.parentElement.classList.remove('active')
    } else {
      e.target.parentElement.parentElement.classList.add('active')
      e.target.parentElement.parentElement.classList.remove('completed')
    }
  }

  // 删除
  if (e.target.className === 'destroy') {
    e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
  }

  // 全选反选
  if (e.target.className === 'toggle-all') {
    if (Array.from(toggleInput).every(it => it.checked)) {
      Array.from(toggleInput).forEach(it => {
        it.checked = false;
        it.parentElement.parentElement.classList.add('active')
        it.parentElement.parentElement.classList.remove('completed')
      })
    } else {
      Array.from(toggleInput).forEach(it => {
        it.checked = true;
        it.parentElement.parentElement.classList.add('completed')
        it.parentElement.parentElement.classList.remove('active')
      })
    }
  }

  // 批量完成与取消
  if (e.target.className === 'show-all') {
    e.preventDefault()
    e.target.parentElement.parentElement.parentElement.parentElement.id = 'show-all'
    for (let key of e.target.parentElement.parentElement.querySelectorAll('li')) {
      if (key.className === 'selected') {
        key.className = '';
      }
    }
    e.target.parentElement.className = 'selected'
  }
  if (e.target.className === 'show-active') {
    e.preventDefault()
    e.target.parentElement.parentElement.parentElement.parentElement.id = 'show-active'
    for (let key of e.target.parentElement.parentElement.querySelectorAll('li')) {
      if (key.className === 'selected') {
        key.className = '';
      }
    }
    e.target.parentElement.className = 'selected'
  }
  if (e.target.className === 'show-completed') {
    e.preventDefault()
    e.target.parentElement.parentElement.parentElement.parentElement.id = 'show-completed'
    for (let key of e.target.parentElement.parentElement.querySelectorAll('li')) {
      if (key.className === 'selected') {
        key.className = '';
      }
    }
    e.target.parentElement.className = 'selected'
  }

  // 删除已经完成项
  if (e.target.className === 'clear-completed') {
    e.preventDefault()
    Array.from(toggleInput).forEach(it => {
      if (it.parentElement.parentElement.className === 'completed') {
        it.parentElement.parentElement.parentElement.removeChild(it.parentElement.parentElement)
      }
    })
  }
  checkCompleted();
  checkActive()
})

todoapp.addEventListener('dblclick', function(e) {
  let textTemp = ''
  editLi = e.target.parentElement.parentElement
  if (e.target.tagName === 'LABEL') {
    labelValue = e.target
    textTemp = e.target.innerHTML;
    editLi.classList.add('editing')
    editLi.querySelector('.edit').value = textTemp;
    editLi.querySelector('.edit').focus();
    textTemp = ""
  }
})

addEventListener('click', function(e) {
  if (editLi) {
    if (editLi.classList.contains('editing')) {
      editLi.classList.remove('editing')
    }
  }
})


// 检查完成
function checkCompleted() {
  let toggleInput = document.querySelectorAll('.toggle');
  if (Array.from(toggleInput).some(it => it.parentElement.parentElement.className === 'completed')) {
    clearCompleted.style.display = 'block'
  } else {
    clearCompleted.style.display = 'none'
  }
}

// 检查是否条目为空
function checkActive() {
  let toggleAll = todoapp.querySelector('.toggle-all');
  let toggleInput = todoapp.querySelectorAll('.toggle');
  let todoFooter = todoapp.querySelector('.footer');
  if (toggleInput.length === 0) {
    toggleAll.checked = false;
    todoFooter.style.display = 'none'
  } else {
    todoFooter.style.display = 'block'
  }
}
