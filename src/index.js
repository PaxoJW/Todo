function todoController() {
    //factory function of a note
    const TodoNoteFun = function(title = "title", description, dueDate, priority) {
        //other functions of notes can go here
        const addDetail = (key, content) =>{
            this.key = content;
        }

        const getDetail = (param) => {
            return {param};
        }

        const assignProject = (project) => {
            if (!project || !project.attachTodo) {
                const project = projectModule.project(`${project}`);
            }
            project.attachTodo(this);
        }

        return {title, description, dueDate, priority, addDetail, getDetail, assignProject};
    };

    return {TodoNoteFun};
};

function projectController() {
    //factory function of a project
    function projectFun(projName = "project name") {
        const todos = [];
        const getTodos = () => todos;
        const attachTodo = (todoCard) => {
            todos.push(todoCard);
        }
        return {projName, getTodos, attachTodo};
    }

    return {projectFun};
};


//controller module to manage the screen
function ScreenController() {
    const todoNote = todoController().TodoNoteFun("default title", "default description", "2024-01-01", "Low");
    const project = projectController().projectFun("Default Project");
    
    project.attachTodo(todoNote);

    // console.log(project);
    console.log(todoNote);
    console.log(project.projName);
    console.log(project);
}

const app1 = ScreenController();
const app2 = projectController();
const app3 = todoController();