const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formbtn = itemForm.querySelector("button");

let IsEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  resetUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  // console.log(newItem);

  //Validate Input Form

  if (newItem === "" || newItem === " ") {
    alert("Please add an Item");
    return;
  }

  //check for edit mode
  if (IsEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    IsEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("Item is already exists!");
      return;
    }
  }

  //create item to DOM
  addItemToDOM(newItem);

  //Add item to Local Storage

  addItemToStorage(newItem);

  resetUI();

  itemInput.value = "";
}

// Create List item
function addItemToDOM(item) {
  const li = document.createElement("li");
  const textNode = document.createTextNode(item);
  li.appendChild(textNode);

  const button = document.createElement("button");
  button.className = "remove-item btn-link text-red";

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-xmark";

  button.appendChild(icon);

  li.appendChild(button);
  itemList.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  //Add new item to storage
  itemsFromStorage.push(item);

  //Convert to JSON string and set to local storage

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}
// Check duplicate items

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

// Update items
function setItemToEdit(item) {
  IsEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formbtn.innerHTML = '<i class = "fa-solid fa-pen"></i>   Update Item';
  formbtn.style.background = "#228B22";
  itemInput.value = item.textContent;
}

// Remove Items from the List

function removeItem(item) {
  if (confirm("Are you sure?")) {
    //Remove item from DOM
    item.remove();

    //Remove item from storage

    removeItemFromStorage(item.textContent);
    resetUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
  if (confirm("This will clear all items are you sure?")) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    //clear from local storage
    localStorage.removeItem("items");
  }
  resetUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function resetUI() {
  itemInput.value = "";

  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  formbtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formbtn.style.background = "#333";
  IsEditMode = false;
}

//initialize app

function init() {
  //Event Listner

  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  resetUI();
}

init();
