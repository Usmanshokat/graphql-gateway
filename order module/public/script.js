const form = document.getElementById("item-form");

const idInput = document.getElementById("item-id");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");

const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const tableBody = document.getElementById("items-table-body");

let itemsCache = [];

function resetForm() {
  form.reset();
  idInput.value = '';
  formTitle.textContent = 'Add New Item';
  submitBtn.textContent = 'Add Item';
  cancelBtn.hidden = true;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameValue = nameInput.value.trim();
    const descriptionValue = descriptionInput.value.trim();
    const idValue = idInput.value.trim();

    const isEdit = Boolean(idValue);

    const mutation = isEdit
      ? `
        mutation UpdateOrder($idValue: ID!, $nameValue: String!, $descriptionValue: String!) {
          updateOrder(
            id: $idValue
            name: $nameValue
            description: $descriptionValue
          ) {
            id
            name
            description
          }
        }
      `
      : `
        mutation CreateOrder($nameValue: String!, $descriptionValue: String!) {
          createOrder(
            name: $nameValue
            description: $descriptionValue
          ) {
            id
            name
            description
          }
        }
      `;

    console.log(nameValue, descriptionValue, idValue, "check values here");
    try {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: mutation,
          variables: isEdit
            ? { idValue, nameValue, descriptionValue }
            : { nameValue, descriptionValue }
        })
      });
      const result = await response.json();
      console.log(result);

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        return;
      }

      resetForm();
      fetchItems();
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} item:`, error);
    }
  });
}

// Render item
async function fetchItems() {
  const query = `
    query {
      items {
        id
        name
        description
      }
    }
  `;

  try {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    console.log(result);

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return;
    }

    itemsCache = result.data.items;
    renderItems(itemsCache);

  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

function renderItems(items) {
  tableBody.innerHTML = "";

  if (!items || items.length === 0) {
    tableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="3">No items yet.</td>
      </tr>
    `;
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description || ""}</td>
      <td>
        <div class="row-actions">
          <button class="btn-edit" data-id="${item.id}">
            Edit
          </button>
          <button class="btn-delete" data-id="${item.id}">
            Delete
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

fetchItems();

tableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  console.log(id, 'check id here');
  if (!id) return;

  if (e.target.classList.contains('btn-delete')) {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    const mutation = `
      mutation DeleteItem($idValue: ID!) {
        deleteItem(id: $idValue)
      }
    `;

    try {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: mutation,
          variables: { idValue: id }
        })
      });
      const result = await response.json();
      console.log(result);

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        return;
      }

      if (idInput.value === id) {
        resetForm();
      }
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  if (e.target.classList.contains('btn-edit')) {
    const item = itemsCache.find((i) => String(i.id) === String(id));
    if (!item) return;

    idInput.value = item.id;
    nameInput.value = item.name;
    descriptionInput.value = item.description || '';

    formTitle.textContent = 'Edit Item';
    submitBtn.textContent = 'Update Item';
    cancelBtn.hidden = false;
  }
});

cancelBtn.addEventListener('click', resetForm);
