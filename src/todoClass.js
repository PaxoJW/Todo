//factory function of a note
const TodoNote = function(title) {
    return {title, description, dueDate, priority};
}

//factory function of a project
function project(projName) {
    const todos = [];
    const getTodos = () => todos;
    const attachTodo = (todoCard) => {
        todos.append(todoCard);
    }
    return {projName, getTodos, attachTodo};
}




export {TodoNote, project};
