class NotesApp {
    constructor() {
        this.notes = [];
        this.currentNoteId = null;
        this.isEditing = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadNotes();
        this.renderNoteList();
        this.showWelcomeScreen();
    }

    initializeElements() {
        // Sidebar elements
        this.noteList = document.getElementById('noteList');
        this.newNoteBtn = document.getElementById('newNoteBtn');
        this.welcomeNewNoteBtn = document.getElementById('welcomeNewNoteBtn');
        
        // Main content elements
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.noteEditor = document.getElementById('noteEditor');
        this.currentNoteTitle = document.getElementById('currentNoteTitle');
        this.saveBtn = document.getElementById('saveBtn');
        this.publishBtn = document.getElementById('publishBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        
        // Editor elements
        this.noteTitle = document.getElementById('noteTitle');
        this.noteContent = document.getElementById('noteContent');
        this.toolbarBtns = document.querySelectorAll('.toolbar-btn');
    }

    bindEvents() {
        // Button events
        this.newNoteBtn.addEventListener('click', () => this.createNewNote());
        this.welcomeNewNoteBtn.addEventListener('click', () => this.createNewNote());
        this.saveBtn.addEventListener('click', () => this.saveCurrentNote());
        this.publishBtn.addEventListener('click', () => this.publishCurrentNote());
        this.deleteBtn.addEventListener('click', () => this.deleteCurrentNote());
        
        // Editor events
        this.noteTitle.addEventListener('input', () => this.updateCurrentNoteTitle());
        this.noteContent.addEventListener('input', () => this.handleContentChange());
        
        // Toolbar events
        this.toolbarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleToolbarClick(e));
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Auto-save
        let autoSaveTimeout;
        this.noteContent.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            this.showSavingIndicator();
            autoSaveTimeout = setTimeout(() => {
                if (this.currentNoteId) {
                    this.saveCurrentNote(false); // Silent save
                    this.hideSavingIndicator();
                }
            }, 2000);
        });
        

    }

    loadNotes() {
        try {
            const savedNotes = localStorage.getItem('notes');
            if (savedNotes) {
                this.notes = JSON.parse(savedNotes);
                console.log('Notes loaded successfully:', this.notes.length, 'notes');
            } else {
                console.log('No saved notes found');
            }
        } catch (error) {
            console.error('Failed to load notes:', error);
            this.notes = [];
        }
    }

    saveNotes() {
        try {
            localStorage.setItem('notes', JSON.stringify(this.notes));
            console.log('Notes saved successfully:', this.notes.length, 'notes');
        } catch (error) {
            console.error('Failed to save notes:', error);
            alert('Failed to save notes. Please check your browser settings.');
        }
    }

    createNewNote() {
        const newNote = {
            id: Date.now().toString(),
            title: 'Untitled',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            published: false
        };
        
        this.notes.unshift(newNote);
        this.saveNotes();
        this.renderNoteList();
        this.openNote(newNote.id);
    }

    openNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        this.currentNoteId = noteId;
        this.currentNoteTitle.textContent = note.title;
        this.noteTitle.value = note.title;
        this.noteContent.innerHTML = note.content;
        
        this.showEditor();
        this.updateNoteListSelection(noteId);
        this.showDeleteButton();
        this.showPublishButton();
    }

    saveCurrentNote(silent = true) {
        if (!this.currentNoteId) return;
        
        const note = this.notes.find(n => n.id === this.currentNoteId);
        if (!note) return;
        
        const newTitle = this.noteTitle.value.trim() || 'Untitled';
        const newContent = this.noteContent.innerHTML;
        
        note.title = newTitle;
        note.content = newContent;
        note.updatedAt = new Date().toISOString();
        
        this.saveNotes();
        this.renderNoteList();
        this.currentNoteTitle.textContent = newTitle;
        
        // Update the note item in the sidebar immediately
        const noteItem = document.querySelector(`[data-note-id="${this.currentNoteId}"] .note-title`);
        if (noteItem) {
            noteItem.textContent = newTitle;
        }
        
        if (!silent) {
            this.showSaveIndicator();
        }
        
        console.log('Note saved:', { title: newTitle, contentLength: newContent.length });
    }

    publishCurrentNote() {
        if (!this.currentNoteId) return;
        
        const note = this.notes.find(n => n.id === this.currentNoteId);
        if (!note) return;
        
        const newTitle = this.noteTitle.value.trim() || 'Untitled';
        const newContent = this.noteContent.innerHTML;
        
        if (!newContent.trim()) {
            alert('Please add some content before publishing.');
            return;
        }
        
        note.title = newTitle;
        note.content = newContent;
        note.updatedAt = new Date().toISOString();
        note.published = true;
        note.publishedAt = new Date().toISOString();
        
        this.saveNotes();
        this.renderNoteList();
        this.currentNoteTitle.textContent = newTitle;
        
        // Update the note item in the sidebar immediately
        const noteItem = document.querySelector(`[data-note-id="${this.currentNoteId}"] .note-title`);
        if (noteItem) {
            noteItem.textContent = newTitle;
        }
        
        this.showPublishIndicator();
        console.log('Post published:', { title: newTitle, contentLength: newContent.length });
    }

    deleteCurrentNote() {
        if (!this.currentNoteId) return;
        
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== this.currentNoteId);
            this.saveNotes();
            this.renderNoteList();
            this.showWelcomeScreen();
        }
    }

    updateCurrentNoteTitle() {
        if (this.currentNoteId) {
            this.currentNoteTitle.textContent = this.noteTitle.value.trim() || 'Untitled';
        }
    }

    handleContentChange() {
        // This is handled by auto-save
    }

    handleToolbarClick(e) {
        e.preventDefault();
        const format = e.currentTarget.dataset.format;
        this.applyFormat(format);
    }

    applyFormat(format) {
        // Modern approach using selection API
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        const fragment = range.extractContents();
        
        switch (format) {
            case 'bold':
                const bold = document.createElement('strong');
                bold.appendChild(fragment);
                range.insertNode(bold);
                break;
            case 'italic':
                const italic = document.createElement('em');
                italic.appendChild(fragment);
                range.insertNode(italic);
                break;
            case 'underline':
                const underline = document.createElement('u');
                underline.appendChild(fragment);
                range.insertNode(underline);
                break;
            case 'strikethrough':
                const strike = document.createElement('s');
                strike.appendChild(fragment);
                range.insertNode(strike);
                break;
            case 'h1':
                const h1 = document.createElement('h1');
                h1.appendChild(fragment);
                range.insertNode(h1);
                break;
            case 'h2':
                const h2 = document.createElement('h2');
                h2.appendChild(fragment);
                range.insertNode(h2);
                break;
            case 'h3':
                const h3 = document.createElement('h3');
                h3.appendChild(fragment);
                range.insertNode(h3);
                break;
            case 'ul':
                const ul = document.createElement('ul');
                const li = document.createElement('li');
                li.appendChild(fragment);
                ul.appendChild(li);
                range.insertNode(ul);
                break;
            case 'ol':
                const ol = document.createElement('ol');
                const oli = document.createElement('li');
                oli.appendChild(fragment);
                ol.appendChild(oli);
                range.insertNode(ol);
                break;
            case 'blockquote':
                const quote = document.createElement('blockquote');
                quote.appendChild(fragment);
                range.insertNode(quote);
                break;
            case 'link':
                const url = prompt('Enter URL:');
                if (url) {
                    const link = document.createElement('a');
                    link.href = url;
                    link.appendChild(fragment);
                    range.insertNode(link);
                }
                break;
            case 'code':
                const code = document.createElement('code');
                code.appendChild(fragment);
                range.insertNode(code);
                break;
        }
        
        // Clear selection and focus
        selection.removeAllRanges();
        this.noteContent.focus();
    }

    handleKeyboardShortcuts(e) {
        // Cmd/Ctrl + S to save
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            this.saveCurrentNote();
        }
        
        // Cmd/Ctrl + N for new note
        if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
            e.preventDefault();
            this.createNewNote();
        }
        
        // Cmd/Ctrl + B for bold
        if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
            e.preventDefault();
            this.applyFormat('bold');
        }
        
        // Cmd/Ctrl + I for italic
        if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
            e.preventDefault();
            this.applyFormat('italic');
        }
        
        // Escape to go back to welcome screen
        if (e.key === 'Escape' && this.currentNoteId) {
            this.showWelcomeScreen();
        }
        
        // Enter to create new line, Shift+Enter for new paragraph
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            document.execCommand('insertParagraph', false, null);
        }
    }

    renderNoteList() {
        this.noteList.innerHTML = '';
        
        if (this.notes.length === 0) {
            this.noteList.innerHTML = '<div class="note-item" style="color: #787774; font-style: italic;">No notes yet</div>';
            return;
        }
        
        this.notes.forEach(note => {
            
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.dataset.noteId = note.id;
            
            const icon = document.createElement('span');
            icon.className = 'note-item-icon';
            icon.innerHTML = note.published ? '<i class="fas fa-globe"></i>' : '<i class="fas fa-file-alt"></i>';
            
            const title = document.createElement('span');
            title.textContent = note.title || 'Untitled';
            title.className = 'note-title';
            
            const date = document.createElement('span');
            date.className = 'note-date';
            date.textContent = note.published ? this.formatDate(note.publishedAt) : this.formatDate(note.updatedAt);
            
            noteElement.appendChild(icon);
            noteElement.appendChild(title);
            noteElement.appendChild(date);
            
            noteElement.addEventListener('click', () => this.openNote(note.id));
            
            this.noteList.appendChild(noteElement);
        });
        
        // Update active state if there's a current note
        if (this.currentNoteId) {
            this.updateNoteListSelection(this.currentNoteId);
        }
    }

    updateNoteListSelection(noteId) {
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-note-id="${noteId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    showWelcomeScreen() {
        this.welcomeScreen.style.display = 'flex';
        this.noteEditor.style.display = 'none';
        this.currentNoteId = null;
        this.currentNoteTitle.textContent = 'Welcome';
        this.hideDeleteButton();
        this.hidePublishButton();
        
        // Clear any active selection
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    showEditor() {
        this.welcomeScreen.style.display = 'none';
        this.noteEditor.style.display = 'flex';
        this.noteContent.focus();
    }

    showDeleteButton() {
        this.deleteBtn.style.display = 'block';
    }

    hideDeleteButton() {
        this.deleteBtn.style.display = 'none';
    }

    showPublishButton() {
        this.publishBtn.style.display = 'block';
    }

    hidePublishButton() {
        this.publishBtn.style.display = 'none';
    }

    showSaveIndicator() {
        const originalText = this.saveBtn.innerHTML;
        this.saveBtn.innerHTML = '<i class="fas fa-check"></i>';
        this.saveBtn.style.color = '#4caf50';
        
        setTimeout(() => {
            this.saveBtn.innerHTML = originalText;
            this.saveBtn.style.color = '';
        }, 1000);
    }

    showPublishIndicator() {
        const originalText = this.publishBtn.innerHTML;
        this.publishBtn.innerHTML = '<i class="fas fa-check"></i> Published!';
        this.publishBtn.style.backgroundColor = '#4caf50';
        
        setTimeout(() => {
            this.publishBtn.innerHTML = originalText;
            this.publishBtn.style.backgroundColor = '';
        }, 2000);
    }

    showSavingIndicator() {
        if (!this.saveBtn.querySelector('.saving-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'saving-indicator';
            indicator.textContent = 'Saving...';
            indicator.style.cssText = 'font-size: 11px; color: #787774; margin-left: 8px;';
            this.saveBtn.appendChild(indicator);
        }
    }

    hideSavingIndicator() {
        const indicator = this.saveBtn.querySelector('.saving-indicator');
        if (indicator) {
            indicator.remove();
        }
    }



    // Utility methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    getNotePreview(content) {
        const div = document.createElement('div');
        div.innerHTML = content;
        const text = div.textContent || div.innerText || '';
        return text.substring(0, 100) + (text.length > 100 ? '...' : '');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
}); 