let editingNoteId = null;

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const datetimeInput = document.getElementById("datetime");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    tabContents.forEach((tc) => tc.classList.remove("active"));
    document.getElementById(tab.dataset.tab).classList.add("active");

    if (tab.dataset.tab === "saved") renderSavedNotes();
    if (tab.dataset.tab === "deleted") renderDeletedNotes();
  });
});

function getNotes() {
  return JSON.parse(localStorage.getItem("notes") || "[]");
}
function getDeletedNotes() {
  return JSON.parse(localStorage.getItem("deletedNotes") || "[]");
}
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function saveNote() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const datetime = datetimeInput.value || new Date().toISOString();
  if (!title || !content) return alert("Title and content required");

  const notes = getNotes();

  if (editingNoteId !== null) {
    notes[editingNoteId] = { title, content, datetime };
    editingNoteId = null;
  } else {
    notes.push({ title, content, datetime });
  }

  saveToLocalStorage("notes", notes);
  titleInput.value = "";
  contentInput.value = "";
  datetimeInput.value = "";
  alert("Note saved!");
}

function renderSavedNotes() {
  const container = document.getElementById("saved");
  container.innerHTML = "";
  const notes = getNotes();
  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note-item";
    noteDiv.innerHTML = `
          <h3>${note.title}</h3>
          <small>${new Date(note.datetime).toLocaleString()}</small>
          <p>${note.content}</p>
          <div class="actions">
  <button class="action-btn edit-btn" onclick="editNote(${index})">Edit</button>
  <button class="action-btn delete-btn" onclick="deleteNote(${index})">Delete</button>
</div>

        `;
    container.appendChild(noteDiv);
  });
}

function renderDeletedNotes() {
  const container = document.getElementById("deleted");
  container.innerHTML = "";
  const notes = getDeletedNotes();
  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note-item";
    noteDiv.innerHTML = `
          <h3>${note.title}</h3>
          <small>${new Date(note.datetime).toLocaleString()}</small>
          <p>${note.content}</p>
          <button class="action-btn restore-btn" onclick="restoreNote(${index})">Restore</button>
        `;
    container.appendChild(noteDiv);
  });
}

function editNote(index) {
  const notes = getNotes();
  const note = notes[index];
  titleInput.value = note.title;
  contentInput.value = note.content;
  datetimeInput.value = note.datetime;
  editingNoteId = index;
  tabs[0].click(); // go to Write tab
}

function deleteNote(index) {
  const notes = getNotes();
  const deleted = getDeletedNotes();
  deleted.push(notes[index]);
  notes.splice(index, 1);
  saveToLocalStorage("notes", notes);
  saveToLocalStorage("deletedNotes", deleted);
  renderSavedNotes();
}

function restoreNote(index) {
  const notes = getNotes();
  const deleted = getDeletedNotes();
  notes.push(deleted[index]);
  deleted.splice(index, 1);
  saveToLocalStorage("notes", notes);
  saveToLocalStorage("deletedNotes", deleted);
  renderDeletedNotes();
}
