"use strict";

let pageSize = 1;
let currentPage = 1;
let userRepos;
const baseUserUrl = `https://api.github.com/users/Jakub-C-7`;
const repoImages = [{
    "name": "DeMon-Tutoring",
    "src": "images/demontutoring.png"
  },
  {
    "name": "ModuleSelectionTool",
    "src": "images/moduleselectiontool.png"
  },
  {
    "name": "RPG-Game",
    "src": "images/rpggame.png"
  },
  {
    "name": "Telemetry-Data-Processing",
    "src": "images/telemetrydataprocessing.png"
  },
  {
    "name": "UNItySocialPlatform",
    "src": "images/unity.png"
  }
];

//Menu Toggler --------------------
menuToggler.addEventListener('click', ev => {
  menu.classList.toggle('open');
  menuToggler.classList.toggle('open');
  document.body.classList.toggle('locked');
});

for (const e of document.querySelectorAll('nav a')) {
  e.addEventListener('click', ev => {
    menuToggler.classList.remove('open');
    menu.classList.remove('open');
    document.body.classList.remove('locked');
  });
}

//Search --------------------
myQuery.addEventListener('input', ev => {

  for (const result of document.querySelectorAll('.hidden')) {
    result.classList.remove('hidden');
  }

  const allSections = Array.from(document.querySelectorAll('main > section > article'));

  const filteredSections = allSections.filter(section => {
    const name = section.dataset.name;
    return !name.includes(myQuery.value);
  });

  for (const section of filteredSections) {
    section.classList.add('hidden');
  }
});

//Contact Me Form --------------------
const checkConfirmation = (ev) => {
  if (myEmail.value != myConfirmation.value) {
    myConfirmation.setCustomValidity("This is awkward... but those don't match!");
  } else {
    myConfirmation.setCustomValidity('');
  }
};

myConfirmation.addEventListener('input', checkConfirmation);
myEmail.addEventListener('input', checkConfirmation);

function get_action() {
  return form_action;
}

contact.addEventListener('submit', ev => {
  contact.action = get_action();
  contact.reset();
});

//Github API --------------------
async function getUrl(url) {
  const response = await fetch(url);
  return response.json();
}

async function getUserObjects() {
  const myObjects = await getUrl(baseUserUrl);
  const publicRepoCount = document.getElementById('count');
  publicRepoCount.textContent = `I've worked on and created some fun projects in
  the past and currently have ${myObjects.public_repos} public repositories,
  check them out below!`;
}

function clearResults() {
  while (repositories.firstChild) {
    repositories.firstChild.remove();
  }
}

async function loadProject() {
  clearResults();
  const result = await getUrl(`${baseUserUrl}/repos`);
  userRepos = result || [];
  nPages.textContent = Math.ceil(userRepos.length / pageSize);
  const currentObject = userRepos.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  insertRepositories(currentObject);
  pageIndicator.textContent = currentPage;
}

async function loadAllProjects() {
  clearResults();
  const result = await getUrl(`${baseUserUrl}/repos`);
  userRepos = result || [];
  insertRepositories(result);
}

async function buildArticleFromData(obj) {
  const article = document.getElementById("repositories");
  const repoContainer = document.createElement('section');
  const title = document.createElement('a');
  const description = document.createElement('p');
  const image = document.createElement('img');
  const imgRecord = repoImages.find(i => i.name == obj.name);

  title.textContent = obj.name;
  title.href = obj.html_url;
  title.target = "_blank";
  title.rel = "noopener noreferrer";
  description.textContent = obj.description;
  repoContainer.classList.add("repoContainer");
  repoContainer.id = obj.name;

  repoContainer.appendChild(title);
  repoContainer.appendChild(description);
  article.appendChild(repoContainer);
  image.alt = `Image for project ${obj.name}`;
  image.src = imgRecord.src;

  repoContainer.appendChild(image);
};

async function getRepoLanguages(obj) {
  const languages = await getUrl(obj.languages_url);
  buildLanguages(languages, obj.name);
}

function buildLanguages(obj, id) {
  const repoContainer = document.getElementById(id);
  const language = document.createElement('p');
  language.textContent = "Languages:"
  Object.keys(obj).forEach(e => {
    language.textContent += ` ${e} |`
  });
  repoContainer.appendChild(language);
}

async function insertRepositories(objects) {
  const results = await Promise.all(objects.map(buildArticleFromData));
  objects.forEach(getRepoLanguages);
}


function nextProject() {
  currentPage += 1;
  const nPages = Math.ceil(userRepos.length / pageSize);
  if (currentPage > nPages) {
    currentPage = 1;
  }
  loadProject();
}

function prevProject() {
  currentPage -= 1;
  const nPages = Math.ceil(userRepos.length / pageSize);
  if (currentPage < 1) {
    currentPage = nPages;
  }
  loadProject();
}

prev.addEventListener('click', prevProject);
next.addEventListener('click', nextProject);

getUserObjects();

function adjustRepositoryLayout(x) {
  if (x.matches) {
    loadProject();
  } else {
    loadAllProjects();
  }
}

const x = window.matchMedia("(max-width: 750px)");
adjustRepositoryLayout(x);
x.addListener(adjustRepositoryLayout);
