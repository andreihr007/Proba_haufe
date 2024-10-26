let budgetPerGuest = 10; // Buget per invitat
let remainingBudget = parseFloat(localStorage.getItem('remainingBudget')) || 0; // Inițializăm bugetul rămas

function updateBudget() {
  const totalGuests = document.querySelectorAll('.guest-name').length;
  const budgetRemaining = totalGuests * budgetPerGuest;

  // Actualizăm variabila globală remainingBudget
  remainingBudget = budgetRemaining;
  document.getElementById('budget-remaining').innerText = remainingBudget;
}

function addGuestToList(guest, isLoaded = false) {
  const guestList = document.getElementById('dynamic-guest-list');
  if (Array.from(guestList.querySelectorAll('.guest-name')).map(div => div.innerText).includes(guest)) {
    alert("Invitatul există deja în listă!");
    return;
  }

  const guestDiv = document.createElement('div');
  guestDiv.className = 'guest-item';

  const guestNameDiv = document.createElement('span');
  guestNameDiv.className = 'guest-name';
  guestNameDiv.innerText = guest;

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-button';
  removeButton.innerText = 'Elimină';
  removeButton.onclick = () => {
    guestList.removeChild(guestDiv);
    saveSelections();
    updateBudget(); // Actualizăm bugetul după eliminarea unui invitat
  };

  guestDiv.appendChild(guestNameDiv);
  guestDiv.appendChild(removeButton);
  guestList.appendChild(guestDiv);

  if (!isLoaded) {
    saveSelections();
    updateBudget(); // Actualizăm bugetul după adăugarea unui invitat nou
  }
}

function loadSelections() {
  const guests = JSON.parse(localStorage.getItem('guests')) || [];
  guests.forEach(guest => addGuestToList(guest, true));

  // Încărcăm și afișăm bugetul rămas salvat
  const savedRemainingBudget = parseFloat(localStorage.getItem('remainingBudget'));
  if (!isNaN(savedRemainingBudget)) {
    remainingBudget = savedRemainingBudget;
    document.getElementById('budget-remaining').innerText = remainingBudget;
  } else {
    updateBudget();
  }
  document.getElementById('data').value = localStorage.getItem('selectedDate') || '';
  document.getElementById('time').value = localStorage.getItem('selectedTime') || '';
  document.getElementById('location').value = localStorage.getItem('selectedLocation') || '';
}

function saveSelections() {
  const guests = Array.from(document.querySelectorAll('.guest-name')).map(div => div.innerText);
  localStorage.setItem('guests', JSON.stringify(guests));
  localStorage.setItem('selectedDate', document.getElementById('data').value);
  localStorage.setItem('selectedTime', document.getElementById('time').value);
  localStorage.setItem('selectedLocation', document.getElementById('location').value);
  localStorage.setItem('remainingBudget', remainingBudget);
  localStorage.setItem('selectedDate', selectedDate);

}

document.getElementById('deduct-button').onclick = function () {
  const deductAmount = parseFloat(document.getElementById('deduct-amount').value);
  if (!isNaN(deductAmount) && deductAmount > 0) {
    if (deductAmount > remainingBudget) {
      alert("Sumă prea mare pentru a scădea din bugetul rămas!");
    } else {
      remainingBudget -= deductAmount;
      document.getElementById('budget-remaining').innerText = remainingBudget;
      localStorage.setItem('remainingBudget', remainingBudget); // Salvăm bugetul actualizat
      document.getElementById('deduct-amount').value = ''; // Resetăm câmpul de input
    }
  } else {
    alert("Te rog introdu o sumă validă!");
  }
};

window.onload = function () {
  loadSelections();
  document.getElementById('finalizeaza').onclick = saveSelections;
  updateBudget();
};
