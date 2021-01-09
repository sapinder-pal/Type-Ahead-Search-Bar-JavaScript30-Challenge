const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

let places, matchedPlaces;

document.addEventListener("DOMContentLoaded", async () => {
	places = await fetchData();

	const suggestions = document.querySelector(".suggestions");

	// listen for change in input
	document.querySelector(".search-bar")
		.addEventListener("input", 
			e => handleChange(e.target, suggestions)
		);
});


async function fetchData() {
	try {
		return await fetch(endpoint)
			.then(res => res.json())
			.then(obj => obj);
	} 
	catch(err) {
		console.error(err);
		alert("An unknown error occurred! Please open the console for more info.");
	}
}

function handleChange(searchBar, suggestions) {
	if(searchBar.value) {
		const matchedPlaces = findMatches(searchBar.value);

		// create <li> nodes for matchedPlaces
		const listItems = matchedPlaces.map(place =>
					getListItemHTML(place, searchBar.value)
		);
		
		suggestions.innerHTML = listItems.join("");
		return;
	}
	// if searchBar is empty
	suggestions.innerHTML = "";
}


function findMatches(input) {
	return (
		places.filter(place => {
			const regExp = new RegExp(input, "gi");

			// find either city or state should match
			return place.city.match(regExp) || place.state.match(regExp);
		})
)}


function getListItemHTML(place, input) {
	// for highlighting the substring that matches the input
	const regExp = new RegExp(input, "gi");
	const spanHighlight = `<span class="highlight">${input}</span>`;

	// replace substring with highlighted one
	const city = place.city.replace(regExp, spanHighlight);
	const state = place.state.replace(regExp, spanHighlight);

	return `<li>
		<span>${city}, ${state}</span>
		<span class="population">${formatPopulation(place.population)}</span>
	</li>`;
}

function formatPopulation(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}