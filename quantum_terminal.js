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
    }

    async initialize() {
        // Initialize terminal
        this.term.open(document.getElementById('terminal'));
        this.term.writeln('Initializing quantum terminal...');
        
        // Load Pyodide
        this.term.writeln('Loading Python runtime...');
        this.pyodide = await loadPyodide();
        
        // Create a clean namespace for our Python code
        const namespace = this.pyodide.globals.get("dict")();
        
        // Set up stdout and stdin
        const terminalIO = {
            stdout: {
                write: (text) => {
                    if (text instanceof Uint8Array) {
                        text = new TextDecoder().decode(text);
                    }
                    this.term.write(text);
                    return text.length;
                },
                flush: () => {}
            },
            stdin: {
                read: () => {
                    return prompt("Input required:") + "\n";
                }
            }
        };

        this.pyodide.setStdin(terminalIO.stdin);
        this.pyodide.setStdout(terminalIO.stdout);
        this.pyodide.setStderr(terminalIO.stdout);
        
        // Load dawn_of_synthesis.py
        try {
            const response = await fetch('dawn_of_synthesis.py');
            const content = await response.text();
            
            // Run in our clean namespace
            await this.pyodide.runPython(content, {globals: namespace});
            await this.pyodide.runPython('main()', {globals: namespace});
        } catch (err) {
            console.error(err);
            this.term.writeln('Warning: Could not load synthesis protocols');
        }

        this.term.writeln('Type run_synthesis() to initiate quantum protocols');
    }
}

// Initialize when page loads
window.addEventListener('load', async () => {
    const terminal = new QuantumTerminal();
    await terminal.initialize();
});
