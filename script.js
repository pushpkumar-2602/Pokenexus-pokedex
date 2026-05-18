const poke_container = document.getElementById('poke-container');
const searchInput = document.getElementById('search');
const themeToggle = document.getElementById('theme-toggle');
const filterContainer = document.getElementById('type-filters');

const pokemon_count = 151;

let allPokemon = [];

const typeColors = {
    fire: '#ff4422',
    grass: '#77cc55',
    electric: '#ffcc33',
    water: '#3399ff',
    ground: '#ddbb55',
    rock: '#bbaa66',
    fairy: '#ee99ee',
    poison: '#aa5599',
    bug: '#aabb22',
    dragon: '#7766ee',
    psychic: '#ff5599',
    flying: '#8899ff',
    fighting: '#bb5544',
    normal: '#aaaa99',
    ice: '#66ccff',
    ghost: '#6666bb',
    dark: '#775544',
    steel: '#aaaabb'
};

/* INIT */

async function init() {
    createTypeFilters();
    await fetchPokemons();

    searchInput.addEventListener('input', handleSearch);

    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('light-mode');
    });
}

/* FETCH */

async function fetchPokemons() {

    for(let i = 1; i <= pokemon_count; i++) {
        await getPokemon(i);
    }
}

async function getPokemon(id) {

    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const res = await fetch(url);

    const data = await res.json();

    allPokemon.push(data);

    createPokemonCard(data);
}

/* CARD */

function createPokemonCard(pokemon) {

    const pokemonEl = document.createElement('div');

    pokemonEl.classList.add('pokemon');

    const name =
        pokemon.name.charAt(0).toUpperCase() +
        pokemon.name.slice(1);

    const id = pokemon.id.toString().padStart(3, '0');

    const poke_types =
        pokemon.types.map(type => type.type.name);

    const typesHTML = poke_types.map(type => {

        return `
            <span
                class="type-badge"
                style="background:${typeColors[type]}"
            >
                ${type}
            </span>
        `;
    }).join('');

    const image =
        pokemon.sprites.other['official-artwork']
        .front_default;

    pokemonEl.innerHTML = `
        <div class="img-container">
            <img src="${image}" alt="${name}">
        </div>

        <div class="info">

            <span class="number">
                #${id}
            </span>

            <h3 class="name">
                ${name}
            </h3>

            <div class="types">
                ${typesHTML}
            </div>

        </div>
    `;

    poke_container.appendChild(pokemonEl);
}

/* FILTERS */

function createTypeFilters() {

    Object.keys(typeColors).forEach(type => {

        const button = document.createElement('button');

        button.classList.add('filter-btn');

        button.textContent = type.toUpperCase();

        button.addEventListener('click', () => {

            document
                .querySelectorAll('.filter-btn')
                .forEach(btn =>
                    btn.classList.remove('active')
                );

            button.classList.add('active');

            filterPokemon(type);
        });

        filterContainer.appendChild(button);
    });
}

function filterPokemon(type) {

    poke_container.innerHTML = '';

    if(type === 'all') {

        allPokemon.forEach(pokemon => {
            createPokemonCard(pokemon);
        });

        return;
    }

    const filtered = allPokemon.filter(pokemon =>

        pokemon.types.some(
            t => t.type.name === type
        )
    );

    filtered.forEach(pokemon => {
        createPokemonCard(pokemon);
    });
}

/* SEARCH */

function handleSearch(e) {

    const value = e.target.value.toLowerCase();

    poke_container.innerHTML = '';

    const filtered = allPokemon.filter(pokemon =>

        pokemon.name.includes(value) ||

        pokemon.id.toString().includes(value)
    );

    filtered.forEach(pokemon => {
        createPokemonCard(pokemon);
    });
}

init();