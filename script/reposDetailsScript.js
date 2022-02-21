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

async function outReposData() {
    //use const
    let repos = await getData();

    const reposNameEl = document.querySelector('.reposName');
    const reposVisibilityEl = document.querySelector('.reposVisibility');
    const reposBranchEl = document.querySelector('.reposBranch');
    const reposCreatedDateEl = document.querySelector('.reposCreatedDate');
    const reposBodyEl = document.querySelector('.reposBody');

    //use destructuring 
    reposNameEl.innerHTML = repos.name;
    reposVisibilityEl.innerHTML = repos.visibility;
    reposBranchEl.innerHTML = repos.default_branch;
    let reposCreatedDate = repos.created_at.replace(/t/i, ' ').replace(/z/i, '').replace(/-/g, '.');
    reposCreatedDateEl.innerHTML = 'Created: ' + reposCreatedDate;
    let reposObjEntries = Object.entries(repos);
    console.log(reposObjEntries);
    //const arr = [1,2]
    //const [one, two] = arr
    reposObjEntries.forEach(([key, value])=>{
        reposBodyEl.innerHTML += `<p><span class="propName">${key}: </span> <span class="propValue">${value}</span></p>`
    })
}

//it's just a link?
function backToMainPage() {
    let backBtn = document.querySelector('.backToMainPage');
    backBtn.addEventListener('click', () => {
        window.location.href = '../../gitApi-homework-master/index.html';
    });
}
backToMainPage();
