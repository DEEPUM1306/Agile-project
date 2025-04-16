function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

function addCustomVehicle() {
  const customVehicleInput = document.getElementById('customVehicle');
  const vehicleTypeSelect = document.getElementById('vehicleType');
  let newType = customVehicleInput.value.trim();

  if (newType) {
    newType = sanitizeInput(newType);

    // Check for duplicates
    const exists = Array.from(vehicleTypeSelect.options).some(
      option => option.value.toLowerCase() === newType.toLowerCase()
    );

    if (exists) {
      alert('This vehicle type already exists.');
      return;
    }

    const option = document.createElement('option');
    option.value = newType;
    option.textContent = newType;
    vehicleTypeSelect.appendChild(option);
    vehicleTypeSelect.value = newType;
    customVehicleInput.value = '';
    alert(`Vehicle type "${newType}" added and selected.`);
  } else {
    alert('Please enter a valid vehicle type.');
  }
}

function registerUser() {
  const username = document.getElementById('username').value;
  if (username) {
    document.getElementById('welcomeMessage').innerText = `Welcome, ${username}! Start tracking your mileage.`;
  } else {
    alert('Please enter your name.');
  }
}



// Fuel Entry and History Management
const history = [];
const ctx = document.getElementById('mileageChart').getContext('2d');
let mileageChart;

function updateChart() {
  const labels = history.map((_, index) => `Entry ${index + 1}`);
  const mileageData = history.map(entry => entry.mileage);

  if (mileageChart) mileageChart.destroy();
  mileageChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Mileage (mpg)',
        data: mileageData,
        borderColor: 'blue',
        fill: false
      }]
    }
  });
}

// Add Fuel Entry
document.getElementById('trackerForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const distance = parseFloat(document.getElementById('distance').value);
  const fuel = parseFloat(document.getElementById('fuel').value);
  const vehicleType = document.getElementById('vehicleType').value;

  if (distance > 0 && fuel > 0 && vehicleType) {
    const mileage = (distance / fuel).toFixed(2);
    history.push({ distance, fuel, mileage, vehicleType });
    updateTable();
    updateChart();
  } else {
    alert('Please enter valid values for distance, fuel, and vehicle type.');
  }
});

function updateTable() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';

  history.forEach((entry, index) => {
    const row = `<tr>
      <td>${entry.vehicleType}</td>
      <td>${entry.distance}</td>
      <td>${entry.fuel}</td>
      <td>${entry.mileage}</td>
      <td><button onclick="deleteEntry(${index})">Delete</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function deleteEntry(index) {
  history.splice(index, 1);
  updateTable();
  updateChart();
}

// Reset All Data
function resetData() {
  history.length = 0;
  updateTable();
  updateChart();
  document.getElementById('welcomeMessage').innerText = '';
  document.getElementById('username').value = '';
  document.getElementById('distance').value = '';
  document.getElementById('fuel').value = '';
  document.getElementById('vehicleType').value = '';
}

// Generate CSV Report
function generateReport() {
  let csvContent = 'Vehicle Type,Distance,Fuel,Mileage\n';
  history.forEach(entry => {
    csvContent += `${entry.vehicleType},${entry.distance},${entry.fuel},${entry.mileage}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mileage_report.csv';
  a.click();
}

// Dark Mode Styling
const darkModeStyle = document.createElement('style');
darkModeStyle.innerHTML = `
  .dark-mode {
    background-color: #121212;
    color: white;
  }
  .dark-mode button {
    background-color: #333;
    color: white;
  }
`;
document.head.appendChild(darkModeStyle);
