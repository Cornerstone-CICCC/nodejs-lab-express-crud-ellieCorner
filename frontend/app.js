const API_URL = "http://localhost:3500/employees";

const getEmployees = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Failed to get employees: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error getting employees:", error);
    alert("Failed to get employees");
    return [];
  }
};

const getEmployeeById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Failed to get employee: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error getting employee:", error);
    alert("Failed to get employee");
    return null;
  }
};

const addEmployee = async (event) => {
  event.preventDefault();

  const firstname = document.getElementById("addFirstname").value;
  const lastname = document.getElementById("addLastname").value;
  const age = document.getElementById("addAge").value;
  const isMarried = document.getElementById("addIsMarried").checked;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstname, lastname, age, isMarried }),
    });

    if (!res.ok) {
      throw new Error(`Failed to add employee: ${res.statusText}`);
    }

    const data = await res.json();
    alert(`Employee ${data.firstname} ${data.lastname} added successfully!`);

    document.getElementById("addEmployeeForm").reset();

    loadEmployees();
  } catch (error) {
    console.error("Error adding employee:", error);
    alert("Failed to add employee");
  }
};

const updateEmployee = async (event) => {
  event.preventDefault();

  const id = document.getElementById("editEmployeeId").value;
  const firstname = document.getElementById("editFirstname").value;
  const lastname = document.getElementById("editLastname").value;
  const age = document.getElementById("editAge").value;
  const isMarried = document.getElementById("editIsMarried").checked;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstname, lastname, age, isMarried }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update employee: ${res.statusText}`);
    }

    const data = await res.json();
    alert(`Employee ${data.firstname} ${data.lastname} updated successfully!`);

    document.getElementById("editEmployeeForm").reset();

    loadEmployees();
  } catch (error) {
    console.error("Error updating employee:", error);
    alert("Failed to update employee");
  }
};

const deleteEmployee = async (id, name) => {
  if (!confirm(`Are you sure you want to delete ${name}?`)) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete employee: ${res.statusText}`);
    }

    alert(`Employee ${name} deleted successfully!`);

    loadEmployees();

    const viewSection = document.getElementById("viewSection");
    viewSection.innerHTML =
      '<p class="no-data">No employee selected. Use the View button or search to display employee information.</p>';
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert("Failed to delete employee");
  }
};

const searchEmployees = async () => {
  const searchInput = document.getElementById("searchInput").value.trim();

  if (!searchInput) {
    alert("Please enter a first name to search");
    return;
  }

  try {
    const res = await fetch(
      `${API_URL}/search?firstname=${encodeURIComponent(searchInput)}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to search employees: ${res.statusText}`);
    }

    const data = await res.json();
    displaySearchResults(data);
  } catch (error) {
    console.error("Error searching employees:", error);
    alert("Failed to search employees");
  }
};

const displaySearchResults = (employees) => {
  const viewSection = document.getElementById("viewSection");

  if (employees.length === 0) {
    viewSection.innerHTML =
      '<p class="no-data">No employees found with that name.</p>';
    return;
  }

  let html = "<h3>Search Results:</h3>";
  employees.forEach((employee) => {
    html += `
      <div class="employee-detail">
        <p><strong>First name:</strong> ${employee.firstname}</p>
        <p><strong>Last name:</strong> ${employee.lastname}</p>
        <p><strong>Age:</strong> ${employee.age}</p>
        <p><strong>Married:</strong> ${employee.isMarried ? "Yes" : "No"}</p>
      </div>
    `;
  });

  viewSection.innerHTML = html;
};

const viewEmployee = async (id) => {
  const employee = await getEmployeeById(id);

  if (!employee) {
    return;
  }

  const viewSection = document.getElementById("viewSection");
  viewSection.innerHTML = `
    <h3>Employee Details:</h3>
    <div class="employee-detail">
      <p><strong>First name:</strong> ${employee.firstname}</p>
      <p><strong>Last name:</strong> ${employee.lastname}</p>
      <p><strong>Age:</strong> ${employee.age}</p>
      <p><strong>Married:</strong> ${employee.isMarried ? "Yes" : "No"}</p>
    </div>
  `;
};

const editEmployee = async (id) => {
  const employee = await getEmployeeById(id);

  if (!employee) {
    return;
  }

  document.getElementById("editEmployeeId").value = employee.id;
  document.getElementById("editFirstname").value = employee.firstname;
  document.getElementById("editLastname").value = employee.lastname;
  document.getElementById("editAge").value = employee.age;
  document.getElementById("editIsMarried").checked = employee.isMarried;

  document
    .getElementById("editEmployeeForm")
    .scrollIntoView({ behavior: "smooth" });
};

const loadEmployees = async () => {
  const employees = await getEmployees();
  const employeeList = document.getElementById("employeeList");

  if (employees.length === 0) {
    employeeList.innerHTML = '<p class="no-data">No employees found.</p>';
    return;
  }

  let html = "";
  employees.forEach((employee) => {
    html += `
      <div class="employee-item">
        <h3>${employee.firstname} ${employee.lastname}</h3>
        <p><strong>Age:</strong> ${employee.age}</p>
        <p><strong>Married:</strong> ${employee.isMarried ? "Yes" : "No"}</p>
        <div class="employee-actions">
          <button class="btn-secondary" onclick="viewEmployee('${
            employee.id
          }')">View</button>
          <button class="btn-warning" onclick="editEmployee('${
            employee.id
          }')">Edit</button>
          <button class="btn-danger" onclick="deleteEmployee('${
            employee.id
          }', '${employee.firstname} ${employee.lastname}')">Delete</button>
        </div>
      </div>
    `;
  });

  employeeList.innerHTML = html;
};

document.addEventListener("DOMContentLoaded", () => {
  loadEmployees();
});
