function todoController() {
    //factory function of a note
    const todoNoteFun = function(title = "title", description, dueDate, priority) {
        
        const todoCard = {title, description, dueDate, priority};
        
        //other functions of notes can go here
        const addDetail = (key, content) => {
            if (!todoCard[key]) {
                console.log(`Key: ${key} does not exist on todoCard`);
                return;
            }

            todoCard[key] = content;
        }

        const getDetail = (key) => {
            if (!todoCard[key]) {
                console.log(`Key: ${key} does not exist on todoCard`);
                return;
            }
            return todoCard[key];
        }

        const assignProject = (project) => {
            if (!project || !project.attachTodo) {
                const project = projectModule.project(`${project}`);
            }
            project.attachTodo(todo); //Defined below
        }

        const todo = {
            todoCard,
            addDetail,
            getDetail,
            assignProject
        }

        return todo;
    };

    return { todoNoteFun };
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
    const todoNoteFun = todoController();
    const projectFun = projectController();
    
    const defaultProject = projectFun.projectFun("Default Project");
    const defaultTodo = todoNoteFun.todoNoteFun("Default Todo", "Sample description", "2024-01-01", "Low");

    defaultProject.attachTodo(defaultTodo);

    console.log("Default project name:", defaultProject.projName);
    console.log("Todos inside default project:", defaultProject.getTodos());
    console.log("Default Todo Details:", defaultTodo);

    //Let's return both controllers so we can use them outside
    return { todoNoteFun, projectFun };

}

//Only one app controller is needed
const app1 = ScreenController();
