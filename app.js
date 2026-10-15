(() => {
  "use strict";
  const STORAGE_KEY = "focusflow.tasks.v1";
  const $ = (id) => document.getElementById(id);
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const dateFromISO = (value) => {
    if (!value) return null;
    const [y,m,d] = value.split("-").map(Number);
    return new Date(y,m-1,d);
  };
  const formatDate = (value) => {
    const date = dateFromISO(value);
    if (!date) return "No deadline";
    if (value === todayISO()) return "Today";
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
    if (value === `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,"0")}-${String(tomorrow.getDate()).padStart(2,"0")}`) return "Tomorrow";
    return date.toLocaleDateString(undefined,{day:"numeric",month:"short"});
  };
  const escapeHTML = (str) => String(str ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const loadTasks = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(t => t && typeof t.id === "string" && typeof t.title === "string") : [];
    } catch { return []; }
  };
  let tasks = loadTasks();
  let currentFilter = "all";
  let toastTimer;
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    catch { showToast("Browser storage is full or unavailable."); }
  };
  const showToast = (message) => {
    $("toast").textContent = message; $("toast").classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2400);
  };
  const isOverdue = t => !t.completed && t.due && t.due < todayISO();
  const isDueToday = t => !t.completed && t.due === todayISO();
  const setGreeting = () => {
    const now = new Date();
    $("todayLabel").textContent = now.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}).toUpperCase();
    const hour = now.getHours();
    $("greeting").textContent = hour < 12 ? "Good morning." : hour < 17 ? "Make today count." : "Good evening.";
  };
  const updateStats = () => {
    const completed = tasks.filter(t=>t.completed).length;
    const percent = tasks.length ? Math.round(completed/tasks.length*100) : 0;
    $("progressPercent").textContent = `${percent}%`;
    $("progressBar").style.width = `${percent}%`;
    $("progressCaption").textContent = tasks.length ? (percent===100 ? "All tasks complete!" : percent>=60 ? "Great momentum" : "Keep going, you've got this") : "Let's get started";
    $("completedTotal").textContent = `${completed} completed`;
    $("taskTotal").textContent = `${tasks.length} total tasks`;
    $("dueToday").textContent = tasks.filter(isDueToday).length;
    $("overdue").textContent = tasks.filter(isOverdue).length;
    $("todayCount").textContent = tasks.filter(isDueToday).length;
  };
  const renderSubjects = () => {
    const select = $("subjectFilter");
    const previous = select.value;
    const subjects = [...new Set(tasks.map(t=>t.subject.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    select.innerHTML = '<option value="all">All subjects</option>' + subjects.map(s=>`<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join("");
    select.value = subjects.includes(previous) ? previous : "all";
  };
  const filteredTasks = () => {
    const subject = $("subjectFilter").value;
    return tasks.filter(t => {
      if (subject !== "all" && t.subject !== subject) return false;
      if (currentFilter === "today") return t.due === todayISO() && !t.completed;
      if (currentFilter === "upcoming") return !t.completed && t.due && t.due > todayISO();
      if (currentFilter === "completed") return t.completed;
      return true;
    }).sort((a,b) => Number(a.completed)-Number(b.completed) || (a.due||"9999").localeCompare(b.due||"9999") || ({high:0,medium:1,low:2}[a.priority] - {high:0,medium:1,low:2}[b.priority]));
  };
  const renderTasks = () => {
    const list = $("taskList");
    const items = filteredTasks();
    const titles = {all:["Your tasks","Keep your next steps clear and manageable."],today:["Today's tasks","Focus on what needs attention today."],upcoming:["Coming up","A quick look at what is ahead."],completed:["Completed tasks","Look how far you have come."]};
    $("listTitle").textContent = titles[currentFilter][0];
    $("listSubtitle").textContent = titles[currentFilter][1];
    list.innerHTML = items.map(t => {
      const dueClass = isOverdue(t) ? "deadline overdue" : "deadline";
      const dueLabel = isOverdue(t) ? `Overdue · ${formatDate(t.due)}` : formatDate(t.due);
      return `<article class="task-item ${t.completed?"is-complete":""}">
        <input class="task-check" type="checkbox" data-action="toggle" data-id="${escapeHTML(t.id)}" aria-label="Mark ${escapeHTML(t.title)} complete" ${t.completed?"checked":""}>
        <div><div class="task-title">${escapeHTML(t.title)}</div><div class="task-meta"><span class="subject-pill">${escapeHTML(t.subject)}</span><span class="priority ${escapeHTML(t.priority)}">${escapeHTML(t.priority[0].toUpperCase()+t.priority.slice(1))} priority</span><span class="${dueClass}">◷ ${escapeHTML(dueLabel)}</span></div>${t.notes?`<div class="task-meta">${escapeHTML(t.notes)}</div>`:""}</div>
        <div class="task-actions"><button class="mini-btn" data-action="edit" data-id="${escapeHTML(t.id)}" aria-label="Edit task" title="Edit">✎</button><button class="mini-btn" data-action="delete" data-id="${escapeHTML(t.id)}" aria-label="Delete task" title="Delete">×</button></div>
      </article>`;
    }).join("");
    $("emptyState").classList.toggle("show", items.length===0);
    list.style.display = items.length===0 ? "none" : "grid";
    $("emptyAdd").style.display = currentFilter === "completed" ? "none" : "inline-flex";
  };
  const renderWeek = () => {
    const today = dateFromISO(todayISO());
    const days = [];
    for(let offset=6;offset>=0;offset--){
      const d = new Date(today); d.setDate(today.getDate()-offset);
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      days.push({iso,label:d.toLocaleDateString(undefined,{weekday:"short"}).slice(0,2),count:tasks.filter(t=>t.completed && t.completedAt && t.completedAt.slice(0,10)===iso).length,isToday:offset===0});
    }
    const max = Math.max(1,...days.map(d=>d.count));
    $("weekChart").innerHTML = days.map(d=>`<div class="day-column"><div class="bar-wrap"><div class="day-bar ${d.isToday?"today":""}" title="${d.count} completed" style="height:${Math.max(5,d.count/max*100)}%"></div></div><span class="day-name">${d.label}</span></div>`).join("");
  };
  const render = () => { setGreeting(); updateStats(); renderSubjects(); renderTasks(); renderWeek(); };
  const openDialog = (task=null) => {
    $("taskForm").reset();
    $("taskId").value = task ? task.id : "";
    $("dialogTitle").textContent = task ? "Edit task" : "Create a task";
    $("taskName").value = task?.title || "";
    $("taskSubject").value = task?.subject || "";
    $("taskDate").value = task?.due || todayISO();
    $("taskPriority").value = task?.priority || "medium";
    $("taskNotes").value = task?.notes || "";
    $("taskDialog").showModal();
    $("taskName").focus();
  };
  const closeDialog = () => $("taskDialog").close();
  $("openAdd").addEventListener("click",()=>openDialog());
  $("emptyAdd").addEventListener("click",()=>openDialog());
  $("closeDialog").addEventListener("click",closeDialog);
  $("cancelDialog").addEventListener("click",closeDialog);
  $("taskDialog").addEventListener("click",e=>{if(e.target===$("taskDialog"))closeDialog();});
  $("taskForm").addEventListener("submit",e=>{
    e.preventDefault();
    const id = $("taskId").value;
    const existing = tasks.find(t=>t.id===id);
    const task = {id:id||`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:$("taskName").value.trim(),subject:$("taskSubject").value.trim(),due:$("taskDate").value,priority:$("taskPriority").value,notes:$("taskNotes").value.trim(),completed:existing?.completed||false,completedAt:existing?.completedAt||null,createdAt:existing?.createdAt||new Date().toISOString()};
    if(!task.title||!task.subject||!task.due){showToast("Please fill in the required fields.");return;}
    if(existing) tasks=tasks.map(t=>t.id===id?task:t); else tasks.push(task);
    save(); closeDialog(); render(); showToast(existing?"Task updated.":"Task added to your plan.");
  });
  $("taskList").addEventListener("change",e=>{
    const el=e.target.closest('[data-action="toggle"]'); if(!el)return;
    tasks=tasks.map(t=>t.id===el.dataset.id?{...t,completed:el.checked,completedAt:el.checked?new Date().toISOString():null}:t);
    save();render();showToast(el.checked?"Nice work — task completed!":"Task marked as incomplete.");
  });
  $("taskList").addEventListener("click",e=>{
    const btn=e.target.closest("[data-action]");if(!btn||btn.dataset.action==="toggle")return;
    const task=tasks.find(t=>t.id===btn.dataset.id);if(!task)return;
    if(btn.dataset.action==="edit")openDialog(task);
    if(btn.dataset.action==="delete"&&confirm(`Delete “${task.title}”?`)){tasks=tasks.filter(t=>t.id!==task.id);save();render();showToast("Task deleted.");}
  });
  document.querySelectorAll(".nav-link").forEach(btn=>btn.addEventListener("click",()=>{
    currentFilter=btn.dataset.filter;
    document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b===btn));
    renderTasks();
  }));
  $("subjectFilter").addEventListener("change",renderTasks);
  // Demo tasks appear only on a first visit; all are editable and deletable.
  if(!localStorage.getItem(STORAGE_KEY)){
    const t=todayISO();
    tasks=[
      {id:"demo-1",title:"Review cloud computing fundamentals",subject:"Cloud Computing",due:t,priority:"high",notes:"Revise IaaS, PaaS, SaaS and shared responsibility.",completed:false,completedAt:null,createdAt:new Date().toISOString()},
      {id:"demo-2",title:"Study VPCs and subnets",subject:"AWS Fundamentals",due:t,priority:"medium",notes:"Understand public vs private subnets.",completed:false,completedAt:null,createdAt:new Date().toISOString()},
      {id:"demo-3",title:"Practice 10 Python questions",subject:"Python",due:t,priority:"low",notes:"Focus on dictionaries and functions.",completed:false,completedAt:null,createdAt:new Date().toISOString()},
      {id:"demo-4",title:"Read yesterday's notes",subject:"Cloud Computing",due:t,priority:"low",notes:"",completed:true,completedAt:new Date().toISOString(),createdAt:new Date().toISOString()}
    ];
    save();
  }
  render();
})();