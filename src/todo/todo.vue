<template>
    <section class="real-app">
        <input type="text"
            class="add-input"
            autofocus = "autofocus"
            placeholder="What's your plan next ?"
            @keyup.enter="addTodo"
        >
        <div class="have-items" v-if="filteredTodos.length > 0">
            <item 
            :todo="todo"
            v-for="todo in filteredTodos"
            :key="todo.id"
            @del="deleteTodo"
            ></item>
        </div>
        <p class="none-items" v-else-if="filter === 'active'">No active item</p>
        <p class="none-items" v-else-if="filter === 'completed'">No completed item</p>
        <p class="none-items" v-else>None! Add the first to-do list above!</p>
        <tabs 
            :filter="filter" 
            :todos="todos"
            @toggle="toggleFilter"
            @clearAllCompleted='clearAllCompleted'
        ></tabs>
    </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id = 0
export default {
    data() {
        return {
            todos: [], 
            filter: 'all'
        }
    },
    computed: {
        filteredTodos() {
            if (this.filter === 'all') {
                return this.todos
            }
            const completed = this.filter === 'completed'
            return this.todos.filter(todo => completed === todo.completed)
        }
    },
    components: {
        Item,
        Tabs,
    },
    methods: {
        addTodo(e) {
            if(e.target.value.length === 0){
                return false
            }
            this.todos.unshift({
                id: id++,
                content: e.target.value.trim(),
                completed: false
            })
            e.target.value = ''
        },
        deleteTodo(id) {
            this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
        },
        toggleFilter(state) {
            this.filter = state
        },
        clearAllCompleted() {
            this.todos = this.todos.filter(todo => !todo.completed)
        }
    }
}
</script>

<style lang="stylus" scoped>
.real-app {
    width 600px
    margin 50px auto 0
    box-shadow 0 0 5px #666666
}

.add-input {
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: 0;
    outline: none;
    color: inherit;
    box-sizing: border-box;
    font-smoothing: antialiased;
    padding: 16px 16px 16px 36px;
    border: none;
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}
.none-items {
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    text-align center
    line-height 6rem;
    background-color #fff;
}

.have-items {
    min-height 6rem
    background-color #fff;  
}

</style>

