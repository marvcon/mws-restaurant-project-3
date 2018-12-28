import DBHelper from "./dbhelper";
import dbPromise from "./dbpromise";

function handleClick() {
  const restaurantId = this.dataset.id;
  const fav = this.getAttribute('aria-pressed') == 'true';
  const url = `${DBHelper.API_URL}/restaurants/${restaurantId}/?is_favorite=${!fav}`;
  const PUT = {method: 'PUT'};

  return fetch(url, PUT).then(response => {
    if (!response.ok) return Promise.reject("Unable to list restaurant as favorite.");
    return response.json();
  }).then(updatedRestaurant => {
    // update restaurant on idb
    dbPromise.putRestaurants(updatedRestaurant, true);
    // change state of toggle button
    this.setAttribute('aria-pressed', !fav);
  });
}


export default function favoriteButton(restaurant) {
  const button = document.createElement('button');
  button.innerHTML = "&#x2605;"; // this is the star symbol in hex code
  button.className = "fav";  
  button.dataset.id = restaurant.id; // store restaurant id in dataset for later
  button.setAttribute('aria-label', `List ${restaurant.name} as a favorite`);
  button.setAttribute('aria-pressed', restaurant.is_favorite);
  button.onclick = handleClick;

  return button;
}