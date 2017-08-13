var app = new Vue({
  el: '#app',
  data: {
    list: [],
    val: "",
    showing: 'all',
    editing: -1,
  },
  created: function() {
    if(localStorage.todo === undefined) {
      this.list = []
      console.log('localStorage 里没有数据')
    }else {
      this.list = JSON.parse(localStorage.todo)
    }
  },
  methods: {
    destroy: function(index) { // 删除条目
      this.list.splice(index,1)
    },
    newtodo: function() { // 添加新条目
      if(this.val.trim()) {
        this.list.push({"title":this.val, checked: false})
        this.val = ""
      }
    },
    status: function(index) { // 更新条目已经完成与未完成的状态
      if(this.list[index].checked) {
        this.list[index].checked = true
      }else {
        this.list[index].checked = false
      }
    },
    toggleall: function() { // 全选与反选条目
      let check = this.list.every(it => it.checked)
      if(check) {
        this.list.forEach(it => it.checked = false)
      }else {
        this.list.forEach(it => it.checked = true)
      }
    },
    changeShowing(s) { // 全选、已完成、未完成面板切换
      this.showing = s
    },
    clearcompleted: function() { // 清除已经完成条目
      this.list = this.list.filter(it => !it.checked)
    },
    edits: function(index, e) {
      this.editing = index
      setTimeout(function() {
        e.target.parentNode.nextElementSibling.focus()
      },0)
    },
    // 不使用双向绑定实现Esc撤消用户内容
    // edittext: function(index,e) {
    //   if(this.list[index].title === '') {
    //     this.list.splice(index,1)
    //   }
    //   this.list[index].title = e.target.value
    //   this.editing = -1
    // }
    edittext: function(index,e) {
      if(this.list[index].title === '') {
        this.list.splice(index,1)
      }
      this.editing = -1
    }
  },
  computed: {
    tooglestatus: function() {
      if(this.list.length === 0) {
        return false
      }
      let check = this.list.every(it => it.checked)
      if(check) {
        return this.checked = true
      }else{
        return this.checked = false
      }
    },
    showbar: function() {
      if(this.list.length !== 0) {
        return true
      }else {
        return false
      }
    },
    showcompleted: function() {
      let check = this.list.some(it => it.checked)
      if(check) {
        return true
      }else{
        return false
      }
    },
    showingItems(){
      if (this.showing=='all') {
        return this.list
      }
      if (this.showing=='active') {
        return this.list.filter(it => !it.checked)
      }
      if (this.showing=='done') {
        return this.list.filter(it => it.checked)
      }
    },
    allCount: function() {
      return this.list.filter(it => !it.checked).length
    },
    completedCount: function() {
      return this.list.filter(it => it.checked).length
    },
  },
  watch: { // 深度监控条目数据，并储存到localStorage里
    list: {
      handler: function (newVal, oldVal) {
        localStorage.todo = JSON.stringify(newVal)
      },
      deep: true
    }
  }
})
