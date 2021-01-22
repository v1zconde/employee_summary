const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const validator = require("validator");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
let teamGroup = [];
let employeeId = 1;
let newEmployee;
function createManager(){
        console.log("Build your superheroe Team")
        console.log("---------------------------")
        inquirer.prompt([{
            type: "input",
            name: "managerName",
            message: "What is your manager's name?",
            validate: (response) => {
                if (response == "" || /\s/.test(response)){
                    return "Please enter first or last Name";
                };
                return true;
            }
        },
        {
            type: "input",
            name: "managerEmail",
            message: "What is the manager's email?",
            validate: (response) => {
                if (validator.isEmail(response)){
                    return true;
                }
                return "Please enter valid Email";
                
            } 
        },
        {
            type: "input",
            name: "managerOfficeNumber",
            message: "What is the manager office number",
            validate: async (response) => {
                if (isNaN(response)) {
                    return "Please enter a Number";
                }
                return true;
            }
        },
        {
            type: "list",
            name: "teamMembers",
            message: "Do you have team members?",
            choices: ["Yes", "No"],
        }]).then((responses) => {
            const manager = new Manager(responses.managerName, employeeId, responses.managerEmail, responses.managerOfficeNumber)
            console.log(manager);
            teamGroup.push(manager);
            if (responses.teamMembers === "Yes") {
                createTeam();
            }
            else
            {
                buildHtml();
            }
        })
    }

function createTeam(){
    console.log("Superheroe Team")
    inquirer.prompt([{
        type: "input",
        name: "nameEmployee",
        message: "What is name Employee?",
        validate: (response) => {
            if (response == "" || /\s/.test(response)){
                return "Please enter the name of the employee";
            };
            return true;
        }
        
    },
    {
        type: "input",
        name: "emailEmployee",
        message: "What is employee Email?",
        validate: (response) => {
            if (validator.isEmail(response)){
                return true;
            }
            return "Please enter valid Email";
        },
    },
    {
        type: "list",
        name: "employeeRole",
        message: "What is employee Role?",
        choices: ["engineer", "intern"],
    },
    {
       type: "input",
       name: "employeeGithub",
       message: "Whats the github of the engineer?",
       when: (response) => {
            return response.employeeRole == "engineer";
        },
        validate: (response) => {
            if (/\s/.test(response)){
                return "Please enter the github";
            };
            return true;
        }
    },
    {
        type: "input",
        name: "employeeSchool",
        message: "Whats the school of the intern?",
        when: (response) => {
            return response.employeeRole == "intern";
        },
        validate: (response) => {
            if (/\s/.test(response)){
                return "Please enter a School";
            };
            return true;
        }
    },
    {
        type: "list",
        name: "moreEmployee",
        message: "Add more employee??",
        choices: ["Yes", "No"]
    }]).then((response) => {
        employeeId++
        if (response.employeeRole == "engineer"){
            newEmployee = new Engineer(response.nameEmployee, employeeId, response.emailEmployee, response.employeeGithub)
        } 
        else
        {
            newEmployee = new Intern(response.nameEmployee, employeeId, response.emailEmployee, response.employeeSchool)
        }
        teamGroup.push(newEmployee);
        if (response.moreEmployee === "Yes") {
            createTeam();
        }
        else {
            buildHtml();
        }
    })
}

function buildHtml(){
    var page = render(teamGroup);
    fs.writeFile("./teamPage.html", page, function (err) {
        if (err) throw err;
    });
}

createManager();
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
