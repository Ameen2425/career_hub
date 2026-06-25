/**
 * CareerLaunch Hub - Notes System Logic
 */

const NotesSystem = {
  notes: [],
  editingNoteId: null,
  searchQuery: '',

  init() {
    this.loadNotes();
    this.bindEvents();
    this.renderNotes();
  },

  loadNotes() {
    this.notes = App.getNotes();
  },

  bindEvents() {
    // Open Add Modal
    document.getElementById('add-note-btn')?.addEventListener('click', () => {
      this.openAddModal();
    });

    // Close Modal
    document.getElementById('modal-close')?.addEventListener('click', () => {
      this.closeModal();
    });
    document.getElementById('cancel-note-btn')?.addEventListener('click', () => {
      this.closeModal();
    });

    // Save Note Form Submit
    document.getElementById('note-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveNote();
    });

    // Search input listener
    document.getElementById('notes-search')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderNotes();
    });
  },

  renderNotes() {
    const pinnedContainer = document.getElementById('pinned-notes-grid');
    const regularContainer = document.getElementById('regular-notes-grid');
    const pinnedSection = document.getElementById('pinned-section');
    const regularSection = document.getElementById('regular-section');
    const emptyState = document.getElementById('notes-empty-state');

    if (!pinnedContainer || !regularContainer) return;

    pinnedContainer.innerHTML = '';
    regularContainer.innerHTML = '';

    // Filter notes by search query
    const filtered = this.notes.filter(note => 
      note.title.toLowerCase().includes(this.searchQuery) ||
      note.content.toLowerCase().includes(this.searchQuery) ||
      note.category.toLowerCase().includes(this.searchQuery)
    );

    if (filtered.length === 0) {
      pinnedSection.style.display = 'none';
      regularSection.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    const pinnedNotes = filtered.filter(n => n.isPinned);
    const regularNotes = filtered.filter(n => !n.isPinned);

    // Render Pinned Section
    if (pinnedNotes.length > 0) {
      pinnedSection.style.display = 'block';
      pinnedNotes.forEach(note => {
        pinnedContainer.appendChild(this.createNoteCard(note));
      });
    } else {
      pinnedSection.style.display = 'none';
    }

    // Render Regular Section
    if (regularNotes.length > 0) {
      regularSection.style.display = 'block';
      regularNotes.forEach(note => {
        regularContainer.appendChild(this.createNoteCard(note));
      });
    } else {
      // If we have search results but only pinned, hide regular section
      regularSection.style.display = 'none';
    }
  },

  createNoteCard(note) {
    const card = document.createElement('div');
    card.className = `glass-card note-card ${note.isPinned ? 'pinned' : ''}`;
    card.setAttribute('data-id', note.id);

    const pinText = note.isPinned ? '📌' : '📍';
    const dateFormatted = App.formatDate(note.lastModified);
    const catClass = note.category.toLowerCase().replace('/', '');

    card.innerHTML = `
      <div class="note-card-top">
        <div class="note-card-header">
          <h3 class="note-card-title">${this.escapeHTML(note.title)}</h3>
          <button class="note-pin-btn" onclick="NotesSystem.togglePin(${note.id})" title="${note.isPinned ? 'Unpin' : 'Pin'} Note">${pinText}</button>
        </div>
        <div class="note-card-content">${this.escapeHTML(note.content)}</div>
      </div>
      <div class="note-card-footer">
        <span class="note-date">Edited ${dateFormatted}</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="note-badge ${catClass}">${note.category}</span>
          <div class="note-actions">
            <button class="note-action-btn" onclick="NotesSystem.openEditModal(${note.id})" title="Edit Note">✏️</button>
            <button class="note-action-btn" onclick="NotesSystem.deleteNote(${note.id})" title="Delete Note">🗑️</button>
          </div>
        </div>
      </div>
    `;

    return card;
  },

  openAddModal() {
    this.editingNoteId = null;
    document.getElementById('modal-title').textContent = 'Create New Note';
    document.getElementById('note-title-input').value = '';
    document.getElementById('note-content-input').value = '';
    document.getElementById('note-category-select').value = 'Interview';
    
    document.getElementById('note-modal').classList.add('open');
    document.getElementById('note-title-input').focus();
  },

  openEditModal(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return;

    this.editingNoteId = id;
    document.getElementById('modal-title').textContent = 'Edit Personal Note';
    document.getElementById('note-title-input').value = note.title;
    document.getElementById('note-content-input').value = note.content;
    document.getElementById('note-category-select').value = note.category;

    document.getElementById('note-modal').classList.add('open');
    document.getElementById('note-title-input').focus();
  },

  closeModal() {
    document.getElementById('note-modal').classList.remove('open');
    this.editingNoteId = null;
  },

  saveNote() {
    const titleVal = document.getElementById('note-title-input').value.trim();
    const contentVal = document.getElementById('note-content-input').value.trim();
    const catVal = document.getElementById('note-category-select').value;

    if (!titleVal || !contentVal) {
      App.showToast('Please fill out both title and content fields.', 'warning');
      return;
    }

    if (this.editingNoteId === null) {
      // Create new note
      const newNote = {
        id: Date.now(),
        title: titleVal,
        content: contentVal,
        category: catVal,
        isPinned: false,
        lastModified: new Date().toISOString()
      };
      this.notes.unshift(newNote);
      App.trackPerformanceEvent('noteCreated');
      App.showToast('Note created successfully!', 'success');
    } else {
      // Update existing note
      const idx = this.notes.findIndex(n => n.id === this.editingNoteId);
      if (idx !== -1) {
        this.notes[idx].title = titleVal;
        this.notes[idx].content = contentVal;
        this.notes[idx].category = catVal;
        this.notes[idx].lastModified = new Date().toISOString();
        App.showToast('Note updated successfully!', 'success');
      }
    }

    App.saveNotes(this.notes);
    this.closeModal();
    this.renderNotes();
  },

  deleteNote(id) {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      this.notes = this.notes.filter(n => n.id !== id);
      App.saveNotes(this.notes);
      this.renderNotes();
      App.showToast('Note deleted', 'info');
    }
  },

  togglePin(id) {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx !== -1) {
      this.notes[idx].isPinned = !this.notes[idx].isPinned;
      App.saveNotes(this.notes);
      this.renderNotes();
      App.showToast(this.notes[idx].isPinned ? 'Note pinned!' : 'Note unpinned', 'success');
    }
  },

  escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

document.addEventListener('DOMContentLoaded', () => NotesSystem.init());
// Bind window variables for direct HTML onclick triggers
window.NotesSystem = NotesSystem;
