// User module requires X-Service-Key, so the browser talks to the gateway instead
const GATEWAY_URL = "http://localhost:3000/graphql";

const loginCard = document.getElementById("login-card");
const loginForm = document.getElementById("login-form");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");

const sessionCard = document.getElementById("session-card");
const sessionInfo = document.getElementById("session-info");
const logoutBtn = document.getElementById("logout-btn");

const messageBox = document.getElementById("message");

const form = document.getElementById("item-form");

const idInput = document.getElementById("item-id");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const roleInput = document.getElementById("role");

const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const tableBody = document.getElementById("items-table-body");

let itemsCache = [];

// =========================
// HELPERS
// =========================

function getToken() {
  return localStorage.getItem("token");
}

function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
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
  const headers = {
    "Content-Type": "application/json"
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables })
  });

  const result = await response.json();
  console.log(result);

  // Gateway middleware errors (rate limit, invalid token) come as { error }
  if (result.error) {
    if (response.status === 401) {
      logout();
    }
    throw new Error(result.error);
  }

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

// =========================
// AUTH
// =========================

function renderSession() {
  const user = getCurrentUser();

  if (user) {
    loginCard.hidden = true;
    sessionCard.hidden = false;
    sessionInfo.innerHTML = `Logged in as <strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)}) <span class="role-badge">${escapeHtml(user.role)}</span>`;
  } else {
    loginCard.hidden = false;
    sessionCard.hidden = true;
    sessionInfo.textContent = "";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  itemsCache = [];
  renderSession();
  renderItems([], "Login as ADMIN to see users.");
  resetForm();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const mutation = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          name
          email
          role
        }
      }
    }
  `;

  try {
    const data = await graphqlRequest(mutation, {
      email: loginEmailInput.value.trim(),
      password: loginPasswordInput.value
    });

    localStorage.setItem("token", data.login.token);
    localStorage.setItem("user", JSON.stringify(data.login.user));

    loginForm.reset();
    renderSession();
    showMessage("Login successful", "success");
    fetchItems();
  } catch (error) {
    showMessage(error.message);
  }
});

logoutBtn.addEventListener("click", logout);

// =========================
// CREATE / UPDATE
// =========================

function resetForm() {
  form.reset();
  idInput.value = "";
  formTitle.textContent = "Add New User";
  submitBtn.textContent = "Add User";
  cancelBtn.hidden = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const idValue = idInput.value.trim();
  const isEdit = Boolean(idValue);

  const variables = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    role: roleInput.value
  };

  const mutation = isEdit
    ? `
      mutation UpdateUser($id: ID!, $name: String!, $email: String!, $password: String!, $role: UserRole) {
        updateUser(id: $id, name: $name, email: $email, password: $password, role: $role) {
          id
          name
          email
          role
        }
      }
    `
    : `
      mutation CreateUser($name: String!, $email: String!, $password: String!, $role: UserRole) {
        createUser(name: $name, email: $email, password: $password, role: $role) {
          id
          name
          email
          role
        }
      }
    `;

  if (isEdit) {
    variables.id = idValue;
  }

  try {
    await graphqlRequest(mutation, variables);

    showMessage(isEdit ? "User updated" : "User created", "success");
    resetForm();

    if (getToken()) {
      fetchItems();
    }
  } catch (error) {
    console.error(`Error ${isEdit ? "updating" : "creating"} user:`, error);
    showMessage(error.message);
  }
});

cancelBtn.addEventListener("click", resetForm);

// =========================
// LIST
// =========================

async function fetchItems() {
  if (!getToken()) {
    renderItems([], "Login as ADMIN to see users.");
    return;
  }

  const query = `
    query {
      users {
        id
        name
        email
        role
      }
    }
  `;

  try {
    const data = await graphqlRequest(query);
    itemsCache = data.users;
    renderItems(itemsCache);
  } catch (error) {
    console.error("Error fetching users:", error);
    renderItems([], error.message);
  }
}

function renderItems(items, emptyText = "No users yet.") {
  tableBody.innerHTML = "";

  if (!items || items.length === 0) {
    tableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">${escapeHtml(emptyText)}</td>
      </tr>
    `;
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.email)}</td>
      <td><span class="role-badge">${escapeHtml(item.role)}</span></td>
      <td>
        <div class="row-actions">
          <button class="btn-edit" data-id="${escapeHtml(item.id)}">Edit</button>
          <button class="btn-delete" data-id="${escapeHtml(item.id)}">Delete</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// =========================
// EDIT / DELETE
// =========================

tableBody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("btn-delete")) {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    hideMessage();

    const mutation = `
      mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
      }
    `;

    try {
      const data = await graphqlRequest(mutation, { id });

      if (!data.deleteUser) {
        showMessage("User not found");
        return;
      }

      if (idInput.value === id) {
        resetForm();
      }

      showMessage("User deleted", "success");
      fetchItems();
    } catch (error) {
      console.error("Error deleting user:", error);
      showMessage(error.message);
    }
  }

  if (e.target.classList.contains("btn-edit")) {
    const item = itemsCache.find((i) => String(i.id) === String(id));
    if (!item) return;

    idInput.value = item.id;
    nameInput.value = item.name;
    emailInput.value = item.email;
    passwordInput.value = "";
    roleInput.value = item.role;

    formTitle.textContent = "Edit User";
    submitBtn.textContent = "Update User";
    cancelBtn.hidden = false;
    passwordInput.focus();
  }
});

renderSession();
fetchItems();
