import './style.css';
import { format } from 'date-fns';

format(new Date(1, 11, 2014), "dd-MM-yyyy"); //=> "1-11-2014"


function storageController() {
    const saveProjects = (projectsList) => {
        localStorage.setItem("projects", JSON.stringify(projectsList));
    };

    const loadProjects = () => {
        const data = localStorage.getItem("projects");
        if (!data) return null;
        return JSON.parse(data);
    };

    return {saveProjects, loadProjects};
}

//factory function of a note
const todoNoteFun = function(title = "title", description, dueDate, priority) {
    
    //Format only if inout is a valid ISO-like date
    if (dueDate && !isNaN(new Date(dueDate))) {
        //Store raw date
        const dueDate = new Date(dueDate).toISOString();
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
        // if (key === "dueDate" && todoCard.dueDate) {
        //     return format(new Date(todoCard.dueDate), "dd-MM-yyyy");
        // }
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
    
    const toJSON = () => ({
        project:{
            projName: projName,
            todos: todos.map(t => t.todoCard),
            id: projectID
        }
    })

    return {project, getTodos, attachTodo, toJSON};
}





//Rendering functions
function renderTodoContent(todo, todoContent) {
    //forEach works on arrays, so we use Object.keys to get an array of keys from the todoCard object
    const todoHTML = todo.getKeys()
        .filter(key => key !== "title" && key !== "priority")//We filter out the title key to avoid displaying it twice
        .filter(key => todo.getDetail(key) !== "Empty" && todo.getDetail(key) !== "No due date") //filter out empty details
        .map(key => `<li>${key}: ${todo.getDetail(key)}</li>`)
        .join(""); //convert the array to a string
        
    todoContent.innerHTML = `<h3 class = "todo-title">${todo.todoCard.title}</h3><ul class = "details">${todoHTML}</ul>`;
}

function renderEditTodoForm(todo, editDialog) {
    const editTodoForm = todo.getKeys().map(key => {
        return `
            <label for="${key}">${key}:</label>
            <input type="text" id="${key}" name="${key}" value="${todo.getDetail(key)}"><br>`;
    }).join("");
    
    editDialog.innerHTML = `
    <form>
        <h3>Edit Todo:</h3>
        ${editTodoForm}
        <menu>
            <button type="button" id="cancel-btn">Cancel</button>
            <button type = "submit">Confirm</button>
        </menu>
    </form>`;
}

function renderCreateTodoForm(todoCreationDialog) {
    //Similar to edit form but without pre-filled values
    todoCreationDialog.innerHTML = `
    <form>
        <h3>Create Todo:</h3>
        <label for="title">Title:</label>
        <input type="text" id="title" name="title"><br>
        <label for="description">Description:</label>
        <input type="text" id="description" name="description"><br>
        <label for="dueDate">Due Date:</label>
        <input type="text" id="dueDate" name="dueDate"><br>
        <label for="priority">Priority:</label>
        <input type="text" id="priority" name="priority"><br>
        <menu>
            <button type = "submit">Create</button>
        </menu>
    </form>`;
}



//controller module to manage the screen
function ScreenController() {
    const storage = storageController();

    function saveAll() {
    const rawProjects = projectsList.map(p => p.toJSON());
    storage.saveProjects(rawProjects);
    }

    const pageDiv = document.getElementById("content");
    let projectsList = []; //List of all projects

    const storedProjects = storage.loadProjects();

    if (storedProjects) {
        // JSON stripped away the methods, let's rebuild them
        projectsList = storedProjects.map(p => {
            const proj = projectFun(p.project.projName);
            p.project.todos.forEach(t => {
                console.log(t);
                const rebTodo = todoNoteFun(
                    t.title,
                    t.description,
                    t.dueDate,
                    t.priority
                );
                proj.attachTodo(rebTodo);
            });
            return proj;
        });
    } else {
        //No stored data --> Create a default project and todo for demonstration
        const defaultProject = projectFun("Default Project");
        projectsList.push(defaultProject);
        const defaultTodo = todoNoteFun("Default Todo", "Sample description", "2024-05-23", "Low");
        defaultProject.attachTodo(defaultTodo);
    }
    

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
                const editTodoDialog = document.createElement("dialog");
                editTodoDialog.setAttribute("class", "edit-todo-form");
                editTodoDialog.setAttribute("closedby", "any");
                
                document.body.appendChild(editTodoDialog); //Dialogs need to be in the body

                //Initial rendering of todo details
                renderTodoContent(todo, todoContent);
                todoDiv.appendChild(todoContent);
                todoDiv.classList.add(`${todo.todoCard.priority.toLowerCase()}-priority`); //Adding priority class to todo card for styling

                //Rendering of todo form inside dialog
                renderEditTodoForm(todo, editTodoDialog);
                

                //Event listener to open dialog on click
                todoContent.addEventListener("click", () => {
                    //FInd opened dialogs and close them
                    const openedDialogs = document.querySelectorAll('dialog[open]');
                    openedDialogs.forEach(d => d.close());
                    
                    editTodoDialog.show();
                });
                
                //Cancel button logic
                editTodoDialog.querySelector("#cancel-btn").addEventListener("click", () => {
                    todo.getKeys().forEach((key) => {
                        editTodoDialog.querySelector(`input[name="${key}"]`).value = todo.getDetail(key);
                    });
                    
                    editTodoDialog.close();
                });

                //Form submission logic
                const editTodoForm = editTodoDialog.querySelector("form");
                editTodoForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const formData = new FormData(editTodoForm);

                    for (const [key, value] of formData.entries()) {
                        todo.addDetail(key, value);
                        console.log(key, value);
                    }
                    
                    console.log("Todo updated:", todo);
                    //Re-render the todo details
                    renderTodoContent(todo, todoContent);
                    saveAll();
                    console.log(typeof editTodoDialog.close);
                    console.log(typeof editTodoDialog);
                    editTodoDialog.close();
                });

                //Delete todo button logic
                const deleteTodoBtn = document.createElement("button");
                deleteTodoBtn.textContent = "Delete todo";
                deleteTodoBtn.classList.add("delete-todo-btn");

                deleteTodoBtn.addEventListener("click", () => { 
                    const todoIndex = proj.getTodos().indexOf(todo);
                    if (todoIndex > -1) {
                        proj.getTodos().splice(todoIndex, 1);
                        saveAll();
                        DOMmanipulation();
                    }
                })

                todoDiv.appendChild(deleteTodoBtn);

                projContent.appendChild(todoDiv);
            });
            

            const newTodoDialog = document.createElement("dialog");
            newTodoDialog.setAttribute("class", "new-todo-form");
            newTodoDialog.setAttribute("closedby", "any");
            document.body.appendChild(newTodoDialog); //Forms need to be in the body

            //create the form in the dialog before any interaction
            renderCreateTodoForm(newTodoDialog);

            // Add todos button logic
            const addTodoBtn = document.createElement("button");
            addTodoBtn.textContent = "Add Todo";
            addTodoBtn.classList.add("add-todo-btn");
            addTodoBtn.addEventListener("click", () => {
                console.log("Add todo button clicked");
                //open new dialog
                newTodoDialog.show();

                // const title = prompt("Enter todo title:");
                // const description = prompt("Enter todo description:");
                // const dueDate = prompt("Enter due date (dd-mm-yyyy):");
                // const priority = prompt("Enter priority (Low, Medium, High):");
                
                // //Here we can get the unique ID of the project to assign the todo to
                // //First we get the closest project div in the ierarchy to the button clicked
                // const projectCard = e.target.closest(".project-card"); 
                // const projectID = projectCard.dataset.projectID; //we get the project id from the div
                // const targetProject = projectsList.find(p => p.project.id === projectID); //we look for the correspoding project in the list
                // if (!targetProject) {
                //     return;
                // }
                // if (title) {
                //     addTodo(title, description, dueDate, priority, targetProject); //Assigning to the target project
                // } else {
                //     alert("Todo must have a title!");
                // }
            });

            //New todo form submission logic
            const newTodoForm = newTodoDialog.querySelector("form");
            console.log(newTodoDialog);
            newTodoForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const newTodoData = new FormData(newTodoForm);

                const title = newTodoData.get("title");
                const description = newTodoData.get("description");
                const dueDate = newTodoData.get("due-date");
                const priority = newTodoData.get("priority");

                const projectCard = addTodoBtn.closest(".project-card");
                
                const projectID = projectCard.dataset.projectID;
                const targetProject = projectsList.find(p => p.project.id === projectID);
                console.log(targetProject);
                if (!targetProject) {
                    return;
                }
                if (title) {
                    addTodo(title, description, dueDate, priority, targetProject); //Assigning to the target project
                } else {
                    alert("Todo must have a title!");
                }

                console.log(newTodoForm)
                console.log(typeof newTodoForm)
                console.log(typeof newTodoForm.close)
                newTodoForm.reset();
                //close the dialog
                newTodoDialog.close();
            })

            //Delete project button logic
            const deleteProjBtn = document.createElement("button");
            deleteProjBtn.textContent = "Delete Project";
            deleteProjBtn.classList.add("delete-project-btn");
            deleteProjBtn.addEventListener("click", () => {
                const projIndex = projectsList.indexOf(proj);
                if (projIndex > -1) {
                    projectsList.splice(projIndex, 1);
                    saveAll();
                    DOMmanipulation();
                }
            });
            
            projDiv.appendChild(projContent);
            projContent.appendChild(addTodoBtn);
            projDiv.appendChild(deleteProjBtn);
            pageDiv.appendChild(projDiv);
        });
    }

    //Functions to add projects and todos
    function addProject(projName) {
        const newProject = projectFun(projName);
        projectsList.push(newProject);
        saveAll();
        DOMmanipulation();
    }

    function addTodo(title, description, dueDate, priority, project) {
        const newTodo = todoNoteFun(title, description, dueDate, priority);
        // we assign the todo to the project here
        newTodo.assignProject(project);
        saveAll();
        DOMmanipulation();
    }

    DOMmanipulation();
}

//Only one app controller is needed
const app = ScreenController();

window.app = app; //For debugging purposes as bundling puts verything in its own scope and won't be accessible from the console otherwise
