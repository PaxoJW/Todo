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
                todoCard[key] = "unassigned";
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
        
        //Here we get all todos attached to the project, they are the todo const defined above
        const getTodos = () => todos;
        
        //Here we attach a todo to the project, it's the todo const defined above not the todoCard inside it
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
    const pageDiv = document.getElementById("content");
    const projectsList = []; //List of all projects

    //Create a default project and todo for demonstration
    const defaultProject = pjControl.projectFun("Default Project");
    const defaultTodo = tdNControl.todoNoteFun("Default Todo", "Sample description", "2024-05-23", "Low");

    defaultProject.attachTodo(defaultTodo);
    projectsList.push(defaultProject);

    const DOMmanipulation = () => {
        //Clear the page
        pageDiv.textContent = "";

        //Display all projects and their todos
        projectsList.forEach((proj) => {
            
            const projDiv = document.createElement("div");
            const projTitle = document.createElement("h2");
            const projContent = document.createElement("div");

            projDiv.setAttribute("id", crypto.randomUUID()); //Unique ID for each project div
            projTitle.textContent = proj.project.projName;
            projDiv.appendChild(projTitle);
            projContent.setAttribute("class", "todo-card");

            projContent.textContent = "Todos:\n";
            
            proj.getTodos().forEach((todo) => {
                const todoDiv = document.createElement("div");
                const todoTitle = document.createElement("h3");
                const todoDesc = document.createElement("p");
                const todoDue = document.createElement("p");
                const todoPriority = document.createElement("p");

                todoTitle.textContent = todo.getDetail("title");
                todoDesc.textContent = `Description: ${todo.getDetail("description")}`;
                todoDue.textContent = `Due Date: ${todo.getDetail("dueDate")}`;
                todoPriority.textContent = `Priority: ${todo.getDetail("priority")}`;

                todoDiv.appendChild(todoTitle);
                todoDiv.appendChild(todoDesc);
                todoDiv.appendChild(todoDue);
                todoDiv.appendChild(todoPriority);
                projContent.appendChild(todoDiv);
            });
            
            const addTodoBtn = document.createElement("button");
            addTodoBtn.textContent = "Add Todo";
            addTodoBtn.addEventListener("click", (e) => {
                const title = prompt("Enter todo title:");
                const description = prompt("Enter todo description:");
                const dueDate = prompt("Enter due date (dd-mm-yyyy):");
                const priority = prompt("Enter priority (Low, Medium, High):");
                const projectID = e.currentTarget; //Here we can get the project to assign the todo to
                console.log(projectID);
                if (title) {
                    addTodo(title, description, dueDate, priority, defaultProject); //Assigning to the default project for demo
                }
            });

            projContent.appendChild(addTodoBtn);
            projDiv.appendChild(projContent);
            pageDiv.appendChild(projDiv);
        });

        //Add buttons to add projects and todos
        const addProjBtn = document.createElement("button");
        addProjBtn.textContent = "Add Project";
        addProjBtn.addEventListener("click", () => {
            const projName = prompt("Enter project name:");
            if (projName) {
                addProject(projName);
            }
        });
        pageDiv.appendChild(addProjBtn);

        
        
    }

    //Functions to add projects and todos
    function addProject(projName) {
        const newProject = pjControl.projectFun(projName);
        projectsList.push(newProject);
        DOMmanipulation();
    }

    function addTodo(title, description, dueDate, priority, project) {
        const newTodo = tdNControl.todoNoteFun(title, description, dueDate, priority);
        // we assign the todo to the project here
        newTodo.assignProject(project);
        DOMmanipulation();
    }

    DOMmanipulation();
    //Let's return both controllers so we can use them outside
    return { tdNControl, pjControl };

}

// //Only one app controller is needed
const app = ScreenController();

window.app = app; //For debugging purposes as bundling puts verything in its own scope and won't be accessible from the console otherwise
