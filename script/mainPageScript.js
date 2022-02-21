window.onload = () => {
  if (sessionStorage.getItem('username')) {
    let username = sessionStorage.getItem('username');
    const searchUserField = document.querySelector('.userNameInp');
    searchUserField.value = username;
    userName = username;
    // we don't need await here
    showUser(username);
  }
};

const searchBtn = document.querySelector('.searchBtn');
let userName = '';
searchBtn.addEventListener('click', async () => {
  const searchUserField = document.querySelector('.userNameInp');
  userName = searchUserField.value;
  if (userName) {
    await showUser(userName);
  }
});

async function getUser(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const data = response.json();
  return data;
}

async function getUserRepos(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=999`,
  );
  const data = response.json();
  return data;
}

async function getTopReposList(username) {
  //list is a little redundant - you can name it just repos
  let reposList = await getUserRepos(username);
  //clean console.log
  console.log(reposList);
  //look at sort method in Array - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  let topReposList = [];
  //try to sort reposList and take first 10 elements
  //array.sort().slice(10)
  for (let i = 0; i < reposList.length; i++) {
    if (reposList[i].stargazers_count > 0 && topReposList.length < 10) {
      topReposList.push(reposList[i]);
    }
  }

  for (let i = 0; i < reposList.length; i++) {
    // don't use ==
    if (reposList[i].stargazers_count == 0 && topReposList.length < 10) {
      topReposList.push(reposList[i]);
    }
  }

  return topReposList;
}

async function showUser(username) {
  let user = await getUser(username);

  const userDataEl = document.querySelector('.userDataBlock');
  if (user) {
    userDataEl.style.display = 'block';
  }

  const userImgEl = document.querySelector('.userPhotoOut');
  const userNameEl = document.querySelector('.userNameOut');
  const userLoginEl = document.querySelector('.userLoginOut');
  const userBioEl = document.querySelector('.userBioOut');
  const followersEl = document.querySelector('.followers');
  const followingEl = document.querySelector('.following');
  const userLocationEl = document.querySelector('.userLocationOut');
  const userBlogEl = document.querySelector('.userBlogOut');
  userImgEl.src = user.avatar_url;
  userNameEl.textContent = user.name;
  userLoginEl.innerHTML = user.login;
  userBioEl.innerHTML = user.bio;
  followersEl.innerHTML = `${user.followers} followers `;
  followingEl.innerHTML = ` ${user.following} following`;
  userLocationEl.innerHTML = user.location;
  userBlogEl.href = user.blog;
  userBlogEl.innerHTML = user.blog;
  if (!user.location) {
    // use classes
    userLocationEl.style.display = 'none';
  } else {
    userLocationEl.style.display = 'block';
  }
  if (!user.blog) {
    userBlogEl.style.display = 'none';
  } else {
    userBlogEl.style.display = 'block';
  }

  showUserRepos(username);
  // clean console.log please
  console.log(user);
}

async function showUserRepos(username) {
  window.location.hash = `${username}`;

  let reposList = await getTopReposList(username);

  const reposListEl = document.querySelector('.reposListOut');
  // move to function removeRepos
  const reposEl = document.querySelectorAll('.repos');
  if (reposEl.length > 0) {
    for (let i = 0; i < reposEl.length; i++) {
      reposEl[i].remove();
    }
  }

  for (const repos of reposList) {
    let reposUpdateDate = repos.updated_at;
    //if you use regular expression write comments
    //try to use Data js - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    reposUpdateDate = reposUpdateDate
      .replace(/t/i, ' ')
      .replace(/z/i, '')
      .replace(/-/g, '.');
    //use destructuring
    //const {id, name, language, stargazers_count, html_url} = repos
    reposListEl.innerHTML += `
            <div class="repos">
                <div>
                    <a class="reposNameOut" onclick="toReposDetailsPage(${repos.id})">${repos.name}</a>
                    <p class="reposUpdateOut">Updated ${reposUpdateDate}</p>
                </div>
                <div>
                    <p class="reposLangOut"><span class="langBadge"></span>${repos.language}</p>
                    <p class="reposStarsOut">${repos.stargazers_count}</p>
                </div>                
                <a href=${repos.html_url} target="_blank" class="reposUrlOut">${repos.html_url}</a>
            </div>
        `;
  }
  const REPOS_LANGUAGES = {
    TypeScript: 'TypeScript',
    HTML: 'HTML',
    CSS: 'CSS',
    JavaScript: 'JavaScript',
    None: 'null',
  };
  //magic numbers - numbers without explaining what it is
  const reposLangOutEl = document.querySelectorAll('.reposLangOut');
  for (let i = 0; i < reposLangOutEl.length; i++) {
    const langBadgeEl = reposLangOutEl[i].querySelector('.langBadge');
    console.log('lang badge element ===> ', langBadgeEl);
    // use switch
    //TODO: rewrite to switch
    switch (reposLangOutEl[i].textContent) {
      case REPOS_LANGUAGES.HTML:
        langBadgeEl.style.backgroundColor = '#e34c26';
        break;
      case REPOS_LANGUAGES.JavaScript:
        langBadgeEl.style.backgroundColor = '#ffdd00';
        break;
      case REPOS_LANGUAGES.TypeScript:
        langBadgeEl.style.backgroundColor = '#2b7489';
        break;
      case REPOS_LANGUAGES.CSS:
        langBadgeEl.style.backgroundColor = '#563d7c';
        break;
      case REPOS_LANGUAGES.None:
        reposLangOutEl[i].style.display = 'none';
        break;
      default:
        langBadgeEl.style.backgroundColor = '#939292';
    }
  }

  console.log(reposList);
}

async function toReposDetailsPage(id) {
  let reposList = await getTopReposList(userName);
  let currentRepos;
  reposList.forEach((repo) => {
    if (repo.id == id) {
      currentRepos = repo;
    }
  });
  currentRepos = JSON.stringify(currentRepos);
  sessionStorage.setItem('username', userName);
  sessionStorage.setItem('repos', currentRepos);
  //TODO: look does it works local, github
  window.location.href = '../gitApi-homework-master/reposDetails.html';
}
