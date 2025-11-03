import {TodoNote, project} from './todoClass.js';


const defaultNote = TodoNote("default note");
const defaultProject = project("default project");

defaultProject.attachTodo(defaultNote);


