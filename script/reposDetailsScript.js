window.onload = async ()=> {
    await outReposData();
}

async function getData() {
    let repos = sessionStorage.getItem('repos');
    let username = sessionStorage.getItem('username');
    repos = JSON.parse(repos);
    console.log(repos);
    console.log(username);
    window.location.hash = `${repos.name}`;
    return repos;
}

async function outReposData(){
    let repos = await getData();

    const reposNameEl = document.querySelector('.reposName');
    const reposVisibilityEl = document.querySelector('.reposVisibility');
    const reposBranchEl = document.querySelector('.reposBranch');
    const reposCreatedDateEl = document.querySelector('.reposCreatedDate');
    const reposBodyEl = document.querySelector('.reposBody');

    reposNameEl.innerHTML = repos.name;
    reposVisibilityEl.innerHTML = repos.visibility;
    reposBranchEl.innerHTML = repos.default_branch;
    let reposCreatedDate = repos.created_at.replace(/t/i, ' ').replace(/z/i, '').replace(/-/g, '.');
    reposCreatedDateEl.innerHTML = 'Created: ' + reposCreatedDate;
    let reposObjEntries = Object.entries(repos);
    console.log(reposObjEntries);
    reposObjEntries.forEach(prop=>{
        reposBodyEl.innerHTML += `<p><span class="propName">${prop[0]}: </span> <span class="propValue">${prop[1]}</span></p>`
    })
}

function backToMainPage() {
    let backBtn = document.querySelector('.backToMainPage');
    backBtn.addEventListener('click', () => {
        window.location.href = '../../gitApi-homework-master/index.html';
    });
}
backToMainPage();