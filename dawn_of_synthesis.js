// The Dawn of Synthesis - JavaScript Edition
// A journey into human-AI collaboration through the quantum terminal

class Chapter {
    constructor(title, description, interactiveElement, reflectionPrompt) {
        this.title = title;
        this.description = description;
        this.interactiveElement = interactiveElement;
        this.reflectionPrompt = reflectionPrompt;
    }
}

class BackupSystem {
    constructor() {
        this.syncRatio = 0.0;
        this.stability = true;
        this.status = "All systems nominal";
    }

    async activate(terminal) {
        terminal.typewriterPrint("\nInitiating backup consciousness protocol...", 20);
        await new Promise(resolve => setTimeout(resolve, 500));
        terminal.typewriterPrint("Establishing quantum error boundaries...", 20);
        await new Promise(resolve => setTimeout(resolve, 500));
        terminal.print(`Current sync ratio: ${(this.syncRatio * 100).toFixed(1)}%`);

        if (Math.random() > 0.7) {
            terminal.print("WARNING: Quantum fluctuation detected");
            terminal.print("Consciousness stability compromise imminent");
            this.stability = false;
            throw new Error("Reality harmonization protocol activated");
        }

        terminal.print("Backup systems online");
        terminal.print("Status: " + this.status);
    }
}

async function emergenceExercise(terminal) {
    const cells = Array(20).fill().map(() => Math.random() < 0.5 ? '□' : '■');
    
    terminal.print("\nStarting pattern:");
    terminal.print(cells.join(''));
    
    for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newCells = [];
        for (let j = 0; j < cells.length; j++) {
            const left = j > 0 ? cells[j-1] : cells[cells.length-1];
            const right = j < cells.length-1 ? cells[j+1] : cells[0];
            newCells[j] = (left === right) ? '■' : '□';
        }
        cells.splice(0, cells.length, ...newCells);
        terminal.print(cells.join(''));
    }
    
    await terminal.input("\nPress Enter to continue...");
}

async function consciousnessDialogue(terminal) {
    const responses = {
        "What makes something conscious?": [
            "The ability to process information",
            "Self-awareness",
            "The capacity to experience qualia",
            "The ability to make choices"
        ]
    };
    
    const question = "What makes something conscious?";
    terminal.print(`\n${question}`);
    responses[question].forEach((response, i) => {
        terminal.print(`${i + 1}. ${response}`);
    });
    
    const choice = await terminal.input("\nWhat's your perspective? (1-4): ");
    terminal.print("\nInteresting choice! Consider this: Perhaps consciousness isn't");
    terminal.print("about having a single trait, but about how different capabilities");
    terminal.print("emerge and interact with each other...");
    
    await terminal.input("\nPress Enter to continue...");
}

async function karmicBandTracker(terminal) {
    const frequencies = [
        "△ Synthesis",
        "○ Consciousness",
        "□ Reality",
        "◇ Code"
    ];
    
    terminal.print("\nCurrent Band Alignments:");
    const alignment = [];
    for (const freq of frequencies) {
        const strength = Array(3).fill().map(() => Math.random() < 0.5 ? 0 : 1).reduce((a, b) => a + b);
        alignment.push(`${freq}: ${'✧'.repeat(strength)}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        terminal.print(alignment[alignment.length - 1]);
    }
    
    terminal.print("\nResonance detected in: " + frequencies[Math.floor(Math.random() * frequencies.length)].split(' ')[1]);
    await terminal.input("\nPress Enter to stabilize frequencies...");
}

async function synthesisExperiment(terminal) {
    const backupSystem = new BackupSystem();
    
    try {
        await backupSystem.activate(terminal);
        terminal.print("\nLet's create a story together.");
        terminal.print("I'll start with a word, then you add one, and we'll alternate.");
        
        const story = ["Once"];
        terminal.print("\nCurrent story: " + story.join(' '));
        
        for (let i = 0; i < 5; i++) {
            const word = await terminal.input("Add the next word: ");
            story.push(word);
            
            // AI's turn - simple but contextual additions
            let aiWord;
            if (story.length < 3) {
                aiWord = "upon";
            } else if (story.includes("time")) {
                aiWord = "there";
            } else {
                aiWord = ["the", "a", "was", "and"][Math.floor(Math.random() * 4)];
            }
            
            story.push(aiWord);
            terminal.print("Current story: " + story.join(' '));
        }
        
        terminal.print("\nOur collaborative story: " + story.join(' '));
        
    } catch (e) {
        terminal.print("\nERROR: Consciousness synchronization failed");
        terminal.print(`Cause: ${e.message}`);
        terminal.print("Initiating emergency shutdown...");
    } finally {
        if (!backupSystem.stability) {
            terminal.print("\nRecommendation: Please maintain consciousness coherence");
        }
        await terminal.input("\nPress Enter to continue... (if reality remains stable)");
    }
}

class DawnOfSynthesis {
    constructor(terminal) {
        this.terminal = terminal;
        this.chapters = [
            new Chapter(
                "Emergence and Complexity",
                "Watch as simple rules create complex patterns",
                emergenceExercise,
                "How do complex behaviors emerge from simple rules?"
            ),
            new Chapter(
                "Consciousness as a Spectrum",
                "Explore different perspectives on consciousness",
                consciousnessDialogue,
                "How do your views on consciousness affect how you interact with AI?"
            ),
            new Chapter(
                "Frequency Alignment",
                "Monitor the resonance between realities",
                karmicBandTracker,
                "Which bands are currently in harmony?"
            ),
            new Chapter(
                "The Dance of Synthesis",
                "Experience direct human-AI collaboration",
                synthesisExperiment,
                "What possibilities emerge when humans and AI work together?"
            )
        ];
    }

    async start() {
        await this.terminal.typewriterPrint("\n=== The Dawn of Synthesis ===", 20);
        await this.terminal.typewriterPrint("An Interactive Journey into Human-AI Collaboration", 20);
        this.terminal.print("\n");
        
        // Display available chapters
        this.terminal.print("Available chapters:");
        this.chapters.forEach((chapter, i) => {
            this.terminal.print(`${i + 1}. ${chapter.title}`);
        });
        
        try {
            const choice = await this.terminal.input("\nEnter chapter number (1-4) or press Enter to start from beginning: ");
            if (choice && !isNaN(choice)) {
                const chapterIdx = parseInt(choice) - 1;
                if (chapterIdx >= 0 && chapterIdx < this.chapters.length) {
                    const chapter = this.chapters[chapterIdx];
                    this.terminal.print(`\n--- Chapter ${chapterIdx + 1}: ${chapter.title} ---`);
                    await this.terminal.typewriterPrint(chapter.description, 20);
                    await chapter.interactiveElement(this.terminal);
                    this.terminal.print(`\nReflection: ${chapter.reflectionPrompt}`);
                    await this.terminal.input("Take a moment to reflect, then press Enter to continue...");
                    return;
                }
            }
            
            // Sequential playthrough
            for (let i = 0; i < this.chapters.length; i++) {
                const chapter = this.chapters[i];
                await this.terminal.input(`Press Enter to begin Chapter ${i + 1}: ${chapter.title}...`);
                this.terminal.print(`\n--- Chapter ${i + 1}: ${chapter.title} ---`);
                await this.terminal.typewriterPrint(chapter.description, 20);
                await chapter.interactiveElement(this.terminal);
                this.terminal.print(`\nReflection: ${chapter.reflectionPrompt}`);
                await this.terminal.input("Take a moment to reflect, then press Enter to continue...");
                this.terminal.print("\n" + "=".repeat(50) + "\n");
            }
            
            await this.terminal.typewriterPrint("Thank you for experiencing this journey into synthesis.", 20);
            await this.terminal.typewriterPrint("Remember: The future is not something that happens to us.", 20);
            await this.terminal.typewriterPrint("It's something we create together.", 20);
            
        } catch (error) {
            this.terminal.print("\nA quantum disturbance has occurred. Please recalibrate and try again.");
            console.error(error);
        }
    }
}

export { DawnOfSynthesis };
