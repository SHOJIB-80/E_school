// Simple student storage using localStorage
const STORAGE_KEY = 'students_list_v1';

function loadStudents(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function saveStudents(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderTable(){
  const tbody = document.getElementById('studentsTableBody');
  const students = loadStudents();
  tbody.innerHTML = '';
  students.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.section)}</td>
      <td>${escapeHtml(s.roll)}</td>
      <td>${escapeHtml(s.group)}</td>
      <td><button class="btn btn-sm btn-danger" data-index="${i}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(m){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m];
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('studentForm');
  const tbody = document.getElementById('studentsTableBody');

  renderTable();

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const section = document.getElementById('section').value.trim();
    const roll = document.getElementById('roll').value.trim();
    const group = document.getElementById('group').value.trim();
    if(!name || !section || !roll || !group) return;
    const students = loadStudents();
    students.push({name, section, roll, group});
    saveStudents(students);
    form.reset();
    renderTable();
  });

  tbody.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-index]');
    if(!btn) return;
    const idx = Number(btn.getAttribute('data-index'));
    const students = loadStudents();
    students.splice(idx,1);
    saveStudents(students);
    renderTable();
  });

  document.getElementById('clearAll').addEventListener('click', ()=>{
    if(!confirm('Clear all student entries?')) return;
    saveStudents([]);
    renderTable();
  });
});
