// https://www.freecodecamp.org/news/how-to-create-interactive-terminal-based-portfolio/
function ready() {
    term.echo(() => {
        const title = rainbow(render(greetings));
        const instructions = '*Here is the instructions.                *\n*They will be completed at a later moment!*';
        return `${title}\nThis is my terminal portfolio\n${instructions}`
    }).resume();
}

function render(text) {
    const cols = term.cols();
    return figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    });
}

//Font coloring
function rainbow(string) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string).join('\n');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}

function print_dirs() {
    term.echo(dirs.map(dir => {
        return `<blue class="directory">${dir}</blue>`;
    }).join("\n"));
}

const root = "~";
let cwd = root;

const commands = {
    help() {
        term.echo(`List of available commands: ${helpList}`);
    },
    echo(...args) {
        term.echo(args.join(' '));
    },
    cd(dir = null) {
        // go to root
        if (dir === null || dir === ".." && dir !== root) {
            cwd = root;
        }
        // open an absolute path
        else if (dir.startsWith("~/") && dirs.includes(dir.substring(2))) {
            cwd = dir;
        }
        // open a relative path
        else if (dirs.includes(dir)) {
            cwd = dir;
        }
        else {
            this.error("Wrong directory");
        }
    },
    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                // ls ~ or ls ~/
                print_dirs();
            } else if (dir.startsWith("~/")) {
                const path = dir.substring(2);
                const dirs = path.split("/");
                if (dirs.length > 1) {
                    this.error("Invalid directory");
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join("\n"));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join("\n"));
                } else {
                    this.error("Invalid directory");
                }
            } else if (dir === "..") {
                print_dirs();
            } else {
                this.error("Invalid directory");
            }
        } else if (cwd === root) {
            print_dirs();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join("\n"));
        }
    }
};

// console prompt
const user = "guest";
const host = "oskars_portfolio";

function prompt() {
    return `<green>${user}@${host}</green>:<blue>${cwd}</blue>$ `;
}

const greetings = 'Oskar Siegfrids'
const font = 'ANSI Shadow';
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts' });
figlet.preloadFonts([font], ready);


const term = $('#terminalWindow').terminal(commands, {
    greetings: false,
    checkArity: false,
    exit: false,
    completion: true,
    prompt
});

// format the list
const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction'
});
const listOfCommands = ['clear'].concat(Object.keys(commands));       // Object.keys(item) returns a list of item's enumerable string-keyed property names
const formattedList = listOfCommands.map(cmd => {
    return `<white class="command">${cmd}</white>`;
});
const helpList = formatter.format(formattedList);

term.on('click', '.command', function() {
    const command = $(this).text();
    term.exec(command);
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`);
});
// syntax highlighting - use regular expression to match all commands on list
const any_command_re = new RegExp(`^\s*(${command_list.join('|')})`);

jQuery.terminal.new_formatter(function(string) {
    return string.replace(re, function(_, command, args) {
        return `<white>${command}</white> <aqua>${args}</aqua>`;
    });
});

// create the directory tree
const directories = {
    education: [
        "",
        "<white>Education</white>",
        [
            [
                "University of Helsinki",
                "https://www.helsinki.fi/en",
                "Master of Political Science, 2020"
            ],
            [
                "Brändö Gymnasium",
                "https://www.brandogymnasium.fi/",
                "General upper secondary education, 2009"
            ],
        ].map(([name, url, description = ""]) => {
            return `* <a href="${url}">${name}</a> - <green>${description}</green>`
        }),
        "<white>Certifications</white>",
        [
            [
                "Academic Work Academy C++ reskill program",
                "https://drive.google.com/file/d/1We6sp02rc1ryaV8ZrMlFOSgPAchFjvrB/view?usp=sharing",
                "2023"
            ],
            [
                "Google Crash Course on Python",
                "https://drive.google.com/file/d/1xSHagwVhzk_-VP4HF-PksoAim4X0tROb/view?usp=sharing",
                "2023"
            ]
        ].map(([name, url, description = ""]) => {
            return `* <a href="${url}">${name}</a> - <green>${description}</green>`
        }),
        ""
    ],
    employment_history: [
        "",
        "<white>Employment history</white>",
        [
            [
                "Software engineer, Academic Work, 09/2023 - present",
                "Control system software engineering at customer Sandvik Mining and Rock Solutions. Developing mainly the machine control software on dumper trucks using Codesys(IEC 61131-3) and C++. Also some small part in developing the main display software using C++ (Qt) and QML."
            ],
            [
                "Project manager, Novia University of Applied Sciences, 10/2021 - 05/2023",
                "Managed an ESF funded project helping micro businesses with digital tools and systems in the archipelago of South-Western Finland."
            ],
            [
                "Project coordinator, Turku University of Applied Sciences, 01/19 - 07/2021",
                "Stakeholder communication and liaison during the construction of the new campus building. Main user and administration of TRAIL asset management software."
            ]

        ].map(([name, description = ""]) => {
            return `* <a>${name}</a> - <green>${description}</green>`
        }),
        ""
    ],
    skills: [
        "",
        "<white>Languages</white>",
        [
            [
                "C++",
                "Intermediate"
            ],
            [
                "Codesys (IEC 61131-3)",
                "Intermediate"
            ],
            [
                "Python",
                "Advanced beginner"
            ],
            [
                "Bash",
                "Beginner"
            ],
            [
                "Javascript, HTML & CSS",
                "Beginner"
            ],
            [
                "SQL",
                "Beginner"
            ]

        ].map(([skill, proficiency = ""]) => {
            return `* <yellow>${skill} - ${proficiency}</yellow>`
        }),
        "<white>Tools</white>",
        [
            "Git",
            "Cmake",
            "Linux"
        ].map(skill => {
            return `* <blue>${skill}</blue>`
        }),
        ""
    ]
}

term.pause();
