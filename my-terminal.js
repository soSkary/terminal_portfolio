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



const commands = {
    help() {
        term.echo(`List of available commands: ${helpList}`);
    },
    echo(...args) {
        term.echo(args.join(' '));
    }
};

const greetings = 'Oskar Siegfrids'
const font = 'ANSI Shadow';
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts' });
figlet.preloadFonts([font], ready);


const term = $('#terminalWindow').terminal(commands, {
    greetings: false,
    checkArity: false,
    exit: false,
    completion: true
});

term.pause();
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
