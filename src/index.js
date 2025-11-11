import { format } from 'date-fns';

format(new Date(1, 11, 2014), "dd-MM-yyyy"); //=> "1-11-2014"


function todoController() {
    //factory function of a note
    const todoNoteFun = function(title = "title", description, dueDate, priority) {
        
        //date manipulation can be done here
        if (dueDate) {
            const parsedDate = new Date(dueDate);
            dueDate = format(parsedDate, "dd-MM-yyyy");
        } else {
            dueDate = "No due date";
        }

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
            // if (!project || !project.attachTodo) {
            //     const project = projectModule.project(`${project}`);
            // }
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
        const project = {projName, todos};
        
        const getTodos = () => todos;
       
        const attachTodo = (todoCard) => {
            todos.push(todoCard);
        }
        
        return {project, getTodos, attachTodo};
    }

    return {projectFun};
};


//controller module to manage the screen
function ScreenController() {
    const tdNControl = todoController();
    const pjControl = projectController();
    
    const defaultProject = pjControl.projectFun("Default Project");
    const defaultTodo = tdNControl.todoNoteFun("Default Todo", "Sample description", "2024-05-23", "Low");

    defaultProject.attachTodo(defaultTodo);

    console.log("Default project name:", defaultProject.project.projName);
    console.log("Todos inside default project:", defaultProject.getTodos());
    console.log("Default Todo Details:", defaultTodo);

    //Let's return both controllers so we can use them outside
    return { tdNControl, pjControl };

}

// //Only one app controller is needed
const app = ScreenController();
window.app = app; //For debugging purposes  
