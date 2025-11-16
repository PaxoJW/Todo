import './style.css';
import { format } from 'date-fns';


format(new Date(1, 11, 2014), "dd-MM-yyyy"); //=> "1-11-2014"



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
    
    //Assign empty value to undefined values
    Object.keys(todoCard)
    .filter(key => !todoCard[key])
    .map(key => {
        todoCard[key] = "Empty";
    });

    //other functions of notes can go here
    const addDetail = (key, content) => {
        if (!todoCard[key]) {
            alert(`Key: ${key} does not exist on todoCard`);
            return;
        }

        todoCard[key] = content;
    }

    const getDetail = (key) => {
        if (!todoCard[key]) {
            todoCard[key] = "unassigned";
            alert(`Key: ${key} does not exist on todoCard`);
            return;
        }
        return todoCard[key];
    }

    const getKeys = () => {
        return Object.keys(todoCard);
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
        getKeys,
        assignProject
    }

    return todo;
};



//factory function of a project
function projectFun(projName = "project name") {
    const todos = [];
    const projectID = crypto.randomUUID();
    const project = {projName, todos, id: projectID}; //we assign a unique id to each project
    
    //Here we get all todos attached to the project, they are the todo const defined above
    const getTodos = () => todos;
    
    //Here we attach a todo to the project, it's the todo const defined above not the todoCard inside it
    const attachTodo = (todoCard) => {
        todos.push(todoCard);
    }
    
    return {project, getTodos, attachTodo};
}

function renderTodoContent(todo, todoContent) {
    //forEach works on arrays, so we use Object.keys to get an array of keys from the todoCard object
    const todoHTML = todo.getKeys()
        .filter(key => key !== "title")  //We filter out the title key to avoid displaying it twice
        .map(key => `<li>${key}: ${todo.getDetail(key)}</li>`)
        .join(""); //convert the array to a string
        
    todoContent.innerHTML = `<h3 class = "todo-title">${todo.todoCard.title}</h3><ul class = "details">${todoHTML}</ul>`;
}

function renderTodoForm(todo, todoFormDialog) {
    const todoForm = todo.getKeys().map(key => {
        return `
            <label for="${key}">${key}:</label>
            <input type="text" id="${key}" name="${key}" value="${todo.getDetail(key)}"><br>`;
    }).join("");
    
    todoFormDialog.innerHTML = `<form>
        <h3>Edit Todo:</h3>
        ${todoForm}
        <menu>
            <button type="button" id="cancel-btn">Cancel</button>
            <button type = "submit">Confirm</button>
        </menu>
    </form>`;
}

//controller module to manage the screen
function ScreenController() {
    const pageDiv = document.getElementById("content");
    const projectsList = []; //List of all projects

    //Create a default project and todo for demonstration
    const defaultProject = projectFun("Default Project");
    const defaultTodo = todoNoteFun("Default Todo", "Sample description", "2024-05-23", "Low");

    defaultProject.attachTodo(defaultTodo);
    projectsList.push(defaultProject);

    const DOMmanipulation = () => {
        //Clear the page
        pageDiv.textContent = "";
        
        //Add buttons to add projects
        const addProjBtn = document.createElement("button");
        addProjBtn.textContent = "Add Project";
        addProjBtn.classList.add("add-project-btn");
        addProjBtn.addEventListener("click", () => {
            const projName = prompt("Enter project name:");
            if (projName) {
                addProject(projName);
            }
        });
        pageDiv.appendChild(addProjBtn);
        
        //Display all projects and their todos
        projectsList.forEach((proj) => {
            
            const projDiv = document.createElement("div");
            const projTitle = document.createElement("h2");
            const projContent = document.createElement("div");

            projDiv.dataset.projectID = proj.project.id; //The unique ID for each project is set to the relative div
            projDiv.setAttribute("class", "project-card");
            projTitle.setAttribute("class", "project-title");
            projTitle.textContent = proj.project.projName;
            projDiv.appendChild(projTitle);
            projContent.setAttribute("class", "project-content");
            console.log(proj);
            //Display todos of the project
            proj.getTodos().forEach((todo) => {
                const todoDiv = document.createElement("div");
                todoDiv.setAttribute("class", "todo-card");
                const todoContent = document.createElement("div");
                todoContent.setAttribute("class", "todo-content");
                const todoFormDialog = document.createElement("dialog");
                todoFormDialog.setAttribute("closedby", "any");

                document.body.appendChild(todoFormDialog); //Dialogs need to be in the body

                //Initial rendering of todo details
                renderTodoContent(todo, todoContent);
                todoDiv.appendChild(todoContent);

                //Rendering of todo form inside dialog
                renderTodoForm(todo, todoFormDialog);
                

                //Event listener to open dialog on click
                todoContent.addEventListener("click", () => {
                    //FInd opened dialogs and close them
                    const openedDialogs = document.querySelectorAll('dialog[open]');
                    openedDialogs.forEach(d => d.close());
                    
                    todoFormDialog.show();
                });
                
                //Cancel button logic
                todoFormDialog.querySelector("#cancel-btn").addEventListener("click", () => {
                    todo.getKeys().forEach((key) => {
                        todoFormDialog.querySelector(`input[name="${key}"]`).value = todo.getDetail(key);
                    });
                    
                    todoFormDialog.close();
                });

                //Form submission logic
                const form = todoFormDialog.querySelector("form");
                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);

                    for (const [key, value] of formData.entries()) {
                        todo.addDetail(key, value);
                        console.log(key, value);
                    }
                    
                    console.log("Todo updated:", todo);
                    //Re-render the todo details
                    renderTodoContent(todo, todoContent);

                    todoFormDialog.close();
                });



                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete todo";
                deleteBtn.classList.add("delete-todo-btn");

                deleteBtn.addEventListener("click", (e) => {
                    console.log("Delete button clicked");
                    // e.stopPropagation(); //To prevent the dialog from opening
                    const projectCard = e.target.closest(".project-card");
                    const projectID = projectCard.dataset.projectID;
                    const targetProject = projectsList.find(p => p.project.id === projectID);
                    console.log(projectCard, projectID, targetProject, projectsList);
                    if (!targetProject) {
                        return;
                    }
                    const todoIndex = targetProject.getTodos().indexOf(todo);
                    
                    if (todoIndex > -1) {
                        targetProject.getTodos().splice(todoIndex, 1);
                        DOMmanipulation();
                    }
                })

                todoDiv.appendChild(deleteBtn);

                projContent.appendChild(todoDiv);
            });
            
            // Add todos logic
            const addTodoBtn = document.createElement("button");
            addTodoBtn.textContent = "Add Todo";
            addTodoBtn.classList.add("add-todo-btn");
            addTodoBtn.addEventListener("click", (e) => {
                const title = prompt("Enter todo title:");
                const description = prompt("Enter todo description:");
                const dueDate = prompt("Enter due date (dd-mm-yyyy):");
                const priority = prompt("Enter priority (Low, Medium, High):");
                
                //Here we can get the unique ID of the project to assign the todo to
                //First we get the closest project div in the ierarchy to the button clicked
                const projectCard = e.target.closest(".project-card"); 
                const projectID = projectCard.dataset.projectID; //we get the project id from the div
                const targetProject = projectsList.find(p => p.project.id === projectID); //we look for the correspoding project in the list
                if (!targetProject) {
                    return;
                }
                if (title) {
                    addTodo(title, description, dueDate, priority, targetProject); //Assigning to the target project
                } else {
                    alert("Todo must have a title!");
                }
            });

            
            projDiv.appendChild(projContent);
            projDiv.appendChild(addTodoBtn);
            pageDiv.appendChild(projDiv);
        });
    }

    //Functions to add projects and todos
    function addProject(projName) {
        const newProject = projectFun(projName);
        projectsList.push(newProject);
        DOMmanipulation();
    }

    function addTodo(title, description, dueDate, priority, project) {
        const newTodo = todoNoteFun(title, description, dueDate, priority);
        // we assign the todo to the project here
        newTodo.assignProject(project);
        DOMmanipulation();
    }

    DOMmanipulation();
}

// //Only one app controller is needed
const app = ScreenController();

window.app = app; //For debugging purposes as bundling puts verything in its own scope and won't be accessible from the console otherwise
