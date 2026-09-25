// Served by the gateway itself, so relative URL works
const GRAPHQL_URL = "/graphql";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];
const USER_ROLES = ["USER", "ADMIN", "SUPER_ADMIN"];

// =========================
// MODULE CONFIG
// =========================
// Each tab describes its fields and GraphQL operations,
// so one set of form/table code handles every module.

const MODULES = {
  products: {
    title: "Products",
    singular: "Product",
    adminOnly: false,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true }
    ],
    columns: ["name", "description"],
    list: `query { products { id name description } }`,
    listKey: "products",
    create: `
      mutation ($name: String!, $description: String!) {
        createProduct(name: $name, description: $description) { id }
      }
    `,
    update: `
      mutation ($id: ID!, $name: String!, $description: String!) {
        updateProduct(id: $id, name: $name, description: $description) { id }
      }
    `,
    remove: `mutation ($id: ID!) { deleteProduct(id: $id) }`,
    removeKey: "deleteProduct"
  },

  orders: {
    title: "Orders",
    singular: "Order",
    adminOnly: false,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true }
    ],
    columns: ["name", "description"],
    list: `query { orders { id name description } }`,
    listKey: "orders",
    create: `
      mutation ($name: String!, $description: String!) {
        createOrder(name: $name, description: $description) { id }
      }
    `,
    update: `
      mutation ($id: ID!, $name: String!, $description: String!) {
        updateOrder(id: $id, name: $name, description: $description) { id }
      }
    `,
    remove: `mutation ($id: ID!) { deleteOrder(id: $id) }`,
    removeKey: "deleteOrder"
  },

  users: {
    title: "Users",
    singular: "User",
    adminOnly: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "role", label: "Role", type: "select", options: USER_ROLES }
    ],
    columns: ["name", "email", "role"],
    list: `query { users { id name email role } }`,
    listKey: "users",
    create: `
      mutation ($name: String!, $email: String!, $password: String!, $role: UserRole) {
        createUser(name: $name, email: $email, password: $password, role: $role) { id }
      }
    `,
    update: `
      mutation ($id: ID!, $name: String!, $email: String!, $password: String!, $role: UserRole) {
        updateUser(id: $id, name: $name, email: $email, password: $password, role: $role) { id }
      }
    `,
    remove: `mutation ($id: ID!) { deleteUser(id: $id) }`,
    removeKey: "deleteUser"
  }
};

// =========================
// DOM
// =========================

const messageBox = document.getElementById("message");

const sessionBox = document.getElementById("session");
const sessionName = document.getElementById("session-name");
const sessionEmail = document.getElementById("session-email");
const sessionRole = document.getElementById("session-role");
const logoutBtn = document.getElementById("logout-btn");

const authView = document.getElementById("auth-view");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const dashboard = document.getElementById("dashboard");
const readonlyNote = document.getElementById("readonly-note");

const formCard = document.getElementById("form-card");
const form = document.getElementById("item-form");
const idInput = document.getElementById("item-id");
const formFields = document.getElementById("form-fields");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const tableTitle = document.getElementById("table-title");
const tableHead = document.getElementById("table-head");
const tableBody = document.getElementById("table-body");
const refreshBtn = document.getElementById("refresh-btn");

let currentTab = "products";
let itemsCache = [];

// =========================
// HELPERS
// =========================

function getToken() {
  return localStorage.getItem("token");
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function isAdmin() {
  const user = getCurrentUser();
  return Boolean(user && ADMIN_ROLES.includes(user.role));
}

function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  messageBox.hidden = false;
}

function hideMessage() {
  messageBox.hidden = true;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function graphqlRequest(query, variables = {}) {
  const headers = { "Content-Type": "application/json" };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables })
  });

  const result = await response.json();

  // Middleware errors (rate limit, expired token) come back as { error }
  if (result.error) {
    if (response.status === 401) {
      logout();
    }
    throw new Error(result.error);
  }

  if (result.errors) {
    const error = result.errors[0];
    if (error.code === "UNAUTHENTICATED") {
      logout();
    }
    throw new Error(error.message);
  }

  return result.data;
}

// =========================
// AUTH
// =========================

document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const isLogin = tab.dataset.auth === "login";
    loginForm.hidden = !isLogin;
    registerForm.hidden = isLogin;
    hideMessage();
  });
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const mutation = `
    mutation ($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user { id name email role }
      }
    }
  `;

  try {
    const data = await graphqlRequest(mutation, {
      email: document.getElementById("login-email").value.trim(),
      password: document.getElementById("login-password").value
    });

    localStorage.setItem("token", data.login.token);
    localStorage.setItem("user", JSON.stringify(data.login.user));

    loginForm.reset();
    currentTab = "products";
    renderApp();
  } catch (error) {
    showMessage(error.message);
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const mutation = `
    mutation ($name: String!, $email: String!, $password: String!) {
      register(name: $name, email: $email, password: $password) { id }
    }
  `;

  try {
    await graphqlRequest(mutation, {
      name: document.getElementById("register-name").value.trim(),
      email: document.getElementById("register-email").value.trim(),
      password: document.getElementById("register-password").value
    });

    registerForm.reset();
    document.querySelector('.auth-tab[data-auth="login"]').click();
    showMessage("Account created. Please login.", "success");
  } catch (error) {
    showMessage(error.message);
  }
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  itemsCache = [];
  renderApp();
}

logoutBtn.addEventListener("click", () => {
  hideMessage();
  logout();
});

// =========================
// LAYOUT
// =========================

function renderApp() {
  const user = getCurrentUser();

  if (!user || !getToken()) {
    authView.hidden = false;
    dashboard.hidden = true;
    sessionBox.hidden = true;
    return;
  }

  authView.hidden = true;
  dashboard.hidden = false;
  sessionBox.hidden = false;

  sessionName.textContent = user.name;
  sessionEmail.textContent = user.email;
  sessionRole.textContent = user.role;
  sessionRole.className = `role-badge role-${user.role}`;

  const admin = isAdmin();

  // Hide admin-only tabs/sections for USER role (gateway enforces it too)
  document.querySelectorAll("[data-admin-only]").forEach((el) => {
    el.hidden = !admin;
  });
  readonlyNote.hidden = admin;

  if (MODULES[currentTab].adminOnly && !admin) {
    currentTab = "products";
  }

  switchTab(currentTab);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    hideMessage();
    switchTab(tab.dataset.tab);
  });
});

function switchTab(tabName) {
  currentTab = tabName;

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  const module = MODULES[tabName];
  tableTitle.textContent = module.title;

  buildForm(module);
  resetForm();
  renderTableHead(module);
  fetchItems();
}

// =========================
// FORM
// =========================

function buildForm(module) {
  formFields.innerHTML = module.fields
    .map((field) => {
      const required = field.required ? "required" : "";
      let input;

      if (field.type === "textarea") {
        input = `<textarea id="field-${field.name}" rows="3" placeholder="Enter ${field.label.toLowerCase()}" ${required}></textarea>`;
      } else if (field.type === "select") {
        const options = field.options
          .map((opt) => `<option value="${opt}">${opt}</option>`)
          .join("");
        input = `<select id="field-${field.name}">${options}</select>`;
      } else {
        input = `<input type="${field.type}" id="field-${field.name}" placeholder="Enter ${field.label.toLowerCase()}" ${required} />`;
      }

      return `
        <div class="form-group">
          <label for="field-${field.name}">${field.label}</label>
          ${input}
        </div>
      `;
    })
    .join("");
}

function getFieldInput(name) {
  return document.getElementById(`field-${name}`);
}

function resetForm() {
  const module = MODULES[currentTab];

  form.reset();
  idInput.value = "";
  formTitle.textContent = `Add New ${module.singular}`;
  submitBtn.textContent = `Add ${module.singular}`;
  cancelBtn.hidden = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const module = MODULES[currentTab];
  const id = idInput.value.trim();
  const isEdit = Boolean(id);

  const variables = {};
  module.fields.forEach((field) => {
    const value = getFieldInput(field.name).value;
    variables[field.name] = field.type === "password" ? value : value.trim();
  });

  if (isEdit) {
    variables.id = id;
  }

  submitBtn.disabled = true;

  try {
    await graphqlRequest(isEdit ? module.update : module.create, variables);

    showMessage(`${module.singular} ${isEdit ? "updated" : "created"}`, "success");
    resetForm();
    fetchItems();
  } catch (error) {
    showMessage(error.message);
  } finally {
    submitBtn.disabled = false;
  }
});

cancelBtn.addEventListener("click", resetForm);

// =========================
// TABLE
// =========================

function renderTableHead(module) {
  const headers = module.columns
    .map((col) => `<th>${escapeHtml(col)}</th>`)
    .join("");

  const actions = isAdmin() ? `<th class="actions-col">Actions</th>` : "";

  tableHead.innerHTML = `<tr>${headers}${actions}</tr>`;
}

function renderEmpty(text) {
  const colspan = MODULES[currentTab].columns.length + (isAdmin() ? 1 : 0);

  tableBody.innerHTML = `
    <tr class="empty-row">
      <td colspan="${colspan}">${escapeHtml(text)}</td>
    </tr>
  `;
}

async function fetchItems() {
  const tabAtRequest = currentTab;
  const module = MODULES[tabAtRequest];

  renderEmpty("Loading...");

  try {
    const data = await graphqlRequest(module.list);

    // User may have switched tabs while this was loading
    if (tabAtRequest !== currentTab) return;

    itemsCache = data[module.listKey];
    renderItems(module, itemsCache);
  } catch (error) {
    if (tabAtRequest !== currentTab) return;
    renderEmpty(error.message);
  }
}

function renderItems(module, items) {
  if (!items || items.length === 0) {
    renderEmpty(`No ${module.title.toLowerCase()} yet.`);
    return;
  }

  const admin = isAdmin();

  tableBody.innerHTML = items
    .map((item) => {
      const cells = module.columns
        .map((col) => {
          if (col === "role") {
            return `<td><span class="role-badge role-${escapeHtml(item.role)}">${escapeHtml(item.role)}</span></td>`;
          }
          return `<td>${escapeHtml(item[col])}</td>`;
        })
        .join("");

      const actions = admin
        ? `
          <td>
            <div class="row-actions">
              <button class="btn-edit" data-id="${escapeHtml(item.id)}">Edit</button>
              <button class="btn-delete" data-id="${escapeHtml(item.id)}">Delete</button>
            </div>
          </td>
        `
        : "";

      return `<tr>${cells}${actions}</tr>`;
    })
    .join("");
}

refreshBtn.addEventListener("click", () => {
  hideMessage();
  fetchItems();
});

// =========================
// EDIT / DELETE
// =========================

tableBody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  const module = MODULES[currentTab];

  if (e.target.classList.contains("btn-edit")) {
    const item = itemsCache.find((i) => String(i.id) === String(id));
    if (!item) return;

    hideMessage();
    idInput.value = item.id;

    module.fields.forEach((field) => {
      // Password is never returned by the API, so it must be re-entered
      getFieldInput(field.name).value = field.type === "password" ? "" : item[field.name] ?? "";
    });

    formTitle.textContent = `Edit ${module.singular}`;
    submitBtn.textContent = `Update ${module.singular}`;
    cancelBtn.hidden = false;
    formCard.scrollIntoView({ behavior: "smooth" });
  }

  if (e.target.classList.contains("btn-delete")) {
    const confirmed = confirm(`Are you sure you want to delete this ${module.singular.toLowerCase()}?`);
    if (!confirmed) return;

    hideMessage();

    try {
      const data = await graphqlRequest(module.remove, { id });

      if (!data[module.removeKey]) {
        showMessage(`${module.singular} not found`);
        return;
      }

      if (idInput.value === id) {
        resetForm();
      }

      showMessage(`${module.singular} deleted`, "success");
      fetchItems();
    } catch (error) {
      showMessage(error.message);
    }
  }
});

renderApp();
