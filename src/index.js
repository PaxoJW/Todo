

//factory function of a note
const TodoNote = function(title) {
    const description = "";
    const dueDate = "";
    const priority = "";
    
    return {title, description, dueDate, priority};
}

//factory function of a project
function project(projName) {
    const todos = [];
    const getTodos = () => todos;
    const attachTodo = (todoCard) => {
        todos.push(todoCard);
    }
    return {projName, getTodos, attachTodo};
}

function createProject(projName) {
    return project(projName);
};


function ScreenController() {
    const defaultNote = TodoNote("default note");
    const defaultProject = project("default project");

    defaultProject.attachTodo(defaultNote);

    const div1 = document.querySelector('.div1');
    div1.textContent = `Project Name: ${defaultProject.projName};
    Todos: ${defaultProject.getTodos().map(todo => todo.title).join(', ')}`;
}

ScreenController();