let reposTable = document.getElementById('table_repos');
let usersTable = document.getElementById('table_users');

async function getReposData() {

  const query = 'q=created:>2021-09-01&sort=stargazers_count&order=desc';

  await fetch(`https://api.github.com/search/repositories?${query}`)
    .then(response => response.json())
    .then(data => {
      var repos = data.items.slice(0, 5);
      showReposTable(repos);
    })
    .catch(error => console.log(error));
}

async function getUsersData() {

  let usersArray = [];

  const query = 'q=created:2020-01-01..2020-12-31&sort=followers&order=desc';

  const userDataURL = `https://api.github.com/users/`;

  await fetch(`https://api.github.com/search/users?${query}`)
    .then(response => response.json())
    .then(data => {

      var users = data.items.slice(0, 5);

      users.forEach(async (user) => {
        await fetch(userDataURL + user.login)
          .then(response => response.json())
          .then(data => {
            usersArray.push({ id: data.id, login: data.login, avatar_url: data.avatar_url, followers: data.followers });
          })
          .catch(error => console.log(error));
        usersArray.sort((a, b) => a.followers > b.followers && -1 || 1)
        showUsersTable(usersArray);
      });
    })
    .catch(error => console.log(error));
  setTimeout(() => getUsersData(), 120000);
}

getReposData();
getUsersData();

function showReposTable(repos) {

  let tab =
    `<div class="table-row">
      <div class="table-head heading"><strong>ID</strong></div>
      <div class="table-head heading"><strong>Name</strong></div>
      <div class="table-head heading"><strong>Description</strong></div>
      <div class="table-head heading"><strong>Stars</strong></div>
    </div>`;

  for (let r of repos) {
    tab += `<div class="table-row"> 
  <div class="table-cell">${r.id} </div>
  <div class="table-cell">${r.name}</div>
  <div class="table-cell">${r.description}</div> 
  <div class="table-cell">${r.stargazers_count}</div>          
</div>`;
  }

  reposTable.innerHTML = tab;
}

function showUsersTable(users) {
  let tab =
    `<div class="table-row">
      <div class="table-head heading">ID</div>
      <div class="table-head heading">Login</div>
      <div class="table-head heading">Avatar image</div>
      <div class="table-head heading">Number of followers</div>
    </div>`;

  for (let u of users) {
    tab += `<div class="table-row"> 
  <div class="table-cell">${u.id} </div>
  <div class="table-cell">${u.login}</div>
  <div class="table-cell"><img width=50px height=50px src="${u.avatar_url}"/></div> 
  <div class="table-cell">${u.followers}</div>          
</div>`;
  }

  usersTable.innerHTML = tab;
}

function updateReposData() {
  getReposData();
}
