window.onload = async ()=>{
    if (sessionStorage.getItem('username')){
        let username = sessionStorage.getItem('username');
        const searchUserField = document.querySelector('.userNameInp');
        searchUserField.value = username;
        userName = username;
        await showUser(username);
    }
};

const searchBtn = document.querySelector('.searchBtn');
let userName = '';
searchBtn.addEventListener('click', async () => {
    const searchUserField = document.querySelector('.userNameInp');
    userName = searchUserField.value
    if (userName) {
        await showUser(userName);
    }
});

async function getUser(username) {
    const user = await fetch(`https://api.github.com/users/${username}`);
    const userDATA = user.json();
    return userDATA;
}

async function getUserRepos(username) {
    const repos = await fetch(`https://api.github.com/users/${username}/repos?per_page=999`);
    const reposDATA = repos.json();
    return reposDATA;
}

async function getTopReposList(username) {
    let reposList = await getUserRepos(username);
    console.log(reposList);
    let topReposList = [];
    for (let i = 0; i < reposList.length; i++) {
        if (reposList[i].stargazers_count > 0 && topReposList.length < 10) {
            topReposList.push(reposList[i]);
        }
    }

    for (let i = 0; i < reposList.length; i++) {
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
        userLocationEl.style.display = 'none';
    } else {
        userLocationEl.style.display = 'block';
    }
    if (!user.blog) {
        userBlogEl.style.display = 'none';
    } else {
        userBlogEl.style.display = 'block';
    }

    await showUserRepos(username);

    console.log(user);
}

async function showUserRepos(username) {
    window.location.hash = `${username}`;

    let reposList = await getTopReposList(username);

    const reposListEl = document.querySelector('.reposListOut');
    const reposEl = document.querySelectorAll('.repos');
    if (reposEl.length > 0){
        for (let i=0; i<reposEl.length; i++){
            reposEl[i].remove();
        }
    }

    for (const repos of reposList) {
        let reposUpdateDate = repos.updated_at;
        reposUpdateDate = reposUpdateDate.replace(/t/i, ' ').replace(/z/i, '').replace(/-/g, '.');

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

    const reposLangOutEl = document.querySelectorAll('.reposLangOut');
    for (let i = 0; i < reposLangOutEl.length; i++) {
        const langBadgeEl = reposLangOutEl[i].querySelector('.langBadge');
        if (reposLangOutEl[i].textContent == 'JavaScript'){
            langBadgeEl.style.backgroundColor = '#ffdd00';
        } else if (reposLangOutEl[i].textContent == 'HTML') {
            langBadgeEl.style.backgroundColor = '#e34c26';
        } else if (reposLangOutEl[i].textContent == 'CSS') {
            langBadgeEl.style.backgroundColor = '#563d7c';
        } else if (reposLangOutEl[i].textContent == 'TypeScript') {
            langBadgeEl.style.backgroundColor = '#2b7489';
        } else if (reposLangOutEl[i].textContent == 'null'){
            reposLangOutEl[i].style.display = 'none';
        } else {
            langBadgeEl.style.backgroundColor = '#939292';
        }
    }

    console.log(reposList);
}

async function toReposDetailsPage(id) {
    let reposList = await getTopReposList(userName);
    let currentRepos;
    reposList.forEach(repos=>{
        if(repos.id == id){
            currentRepos = repos;
        }
    })
    currentRepos = JSON.stringify(currentRepos);
    sessionStorage.setItem('username', userName);
    sessionStorage.setItem('repos', currentRepos);
    window.location.href = '../gitApi-homework-master/reposDetails.html';
}