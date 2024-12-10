class QuantumTerminal {
    constructor() {
        this.term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#000',
                foreground: '#fff',
                cursor: '#fff',
            }
        });
        this.pyodide = null;
        this.currentLine = '';
        this.prompt = '>>> ';
        this.multilineInput = [];
        this.isMultiline = false;
    }

    async initialize() {
        // Initialize terminal
        this.term.open(document.getElementById('terminal'));
        this.term.writeln('Initializing quantum matrices...');
        
        // Load Pyodide
        this.term.writeln('Loading Python runtime...');
        this.pyodide = await loadPyodide();
        
        // Load dawn_of_synthesis.py into virtual filesystem
        try {
            const response = await fetch('dawn_of_synthesis.py');
            const content = await response.text();
            
            // Create a proper namespace
            const namespace = this.pyodide.globals.get("dict")();
            namespace.set("term", this.term);
            
            // Redirect Python stdout to our terminal
            await this.pyodide.runPython(`
import sys
class TerminalOutput:
    def __init__(self, term):
        self.term = term
    def write(self, text):
        self.term.write(text)
    def flush(self):
        pass

sys.stdout = TerminalOutput(term)
            `, {globals: namespace});
            
            // YOLO mode activated - with proper namespace
            await this.pyodide.runPython(content, {globals: namespace});
            await this.pyodide.runPython('main()', {globals: namespace});
            this.term.writeln('Quantum synthesis protocols loaded...');
            
        } catch (err) {
            console.error(err);
            this.term.writeln('Warning: Could not load synthesis protocols');
        }

        // Add helper command to run our file
        await this.pyodide.runPythonAsync(`
import typing
def run_synthesis():
    with open('/quantum_package/dawn_of_synthesis.py') as f:
        exec(f.read())
        
print("Type run_synthesis() to initiate quantum protocols")
        `);
        
        // Setup input handling
        this.term.onKey(({ key, domEvent }) => {
            const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

            if (domEvent.keyCode === 13) { // Enter
                this.handleEnter();
            } else if (domEvent.keyCode === 8) { // Backspace
                if (this.currentLine.length > 0) {
                    this.currentLine = this.currentLine.slice(0, -1);
                    this.term.write('\b \b');
                }
            } else if (printable) {
                this.currentLine += key;
                this.term.write(key);
            }
        });

        // Write initial prompt
        this.term.writeln('\r\nQuantum Python Terminal v0.1');
        this.term.writeln('Reality stabilized. AT field nominal.');
        this.term.write(this.prompt);
    }

    async handleEnter() {
        this.term.write('\r\n');

        if (this.currentLine.trim().endsWith(':')) {
            this.isMultiline = true;
            this.multilineInput.push(this.currentLine);
            this.prompt = '... ';
        } else if (this.isMultiline && this.currentLine.trim() !== '') {
            this.multilineInput.push(this.currentLine);
            this.prompt = '... ';
        } else if (this.isMultiline && this.currentLine.trim() === '') {
            // Execute multiline code
            const code = this.multilineInput.join('\n');
            this.multilineInput = [];
            this.isMultiline = false;
            this.prompt = '>>> ';
            await this.executeCode(code);
        } else {
            // Execute single line
            await this.executeCode(this.currentLine);
        }

        this.currentLine = '';
        this.term.write(this.prompt);
    }

    async executeCode(code) {
        if (!code.trim()) return;

        try {
            // Redirect stdout to terminal
            this.pyodide.setStdout({
                batched: (text) => {
                    this.term.writeln(text);
                }
            });

            const result = await this.pyodide.runPythonAsync(code);
            if (result !== undefined) {
                this.term.writeln(this.pyodide.repr(result));
            }
        } catch (err) {
            this.term.writeln(`Error: ${err.message}`);
        }
    }
}

// Initialize when page loads
window.addEventListener('load', async () => {
    const terminal = new QuantumTerminal();
    await terminal.initialize();
});
