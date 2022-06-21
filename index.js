const API_URL = 'https://api.github.com';

let usernameForSave;
let reponameForSave;

$(document).ready(() => {
    // disable the download button
    document.getElementById("download").disabled = true;

    // action on generate
    $('#generate').click(() => submitData($('#url-input').val(), $('#styles').val()));

    // action on download
    $('#download').click(() => downloadImage());
});

/**
 * get the data from the user and generate the photo
 * 
 * @param {string} repoTokens the username and repo name
 * @param {string} theme the theme name
 * @example repoTokens: 'oneill19/social-preview-generator'; theme: 'tokyo-night'
 */
function submitData(repoTokens, theme) {
    // check if user inserted all values
    if (!repoTokens || !theme) {
        alert('Please enter url and theme')
        return;
    }

    // split the tokens to username and repo name
    const [username, reponame] = getUrlTokens(repoTokens);

    // if the user url is not valid
    if (!username || !reponame) {
        alert('Invalid url');
        return;
    }

    // save the username and reponame for image name
    usernameForSave = username.toLowerCase();
    reponameForSave = reponame.toLowerCase();

    // generate the url for fetching data
    const repoUrl = `${API_URL}/repos/${username}/${reponame}`;

    // fetch the data and generate image
    fetchData(repoUrl, theme);
}

/**
 * split the tokens
 * 
 * @param {string} repoTokens the user tokens
 * @returns array of username and repo name
 * @example input: 'oneill19/social-preview-generator'; output: ['oneill19', 'social-preview-generator'] 
 */
function getUrlTokens(repoTokens) {
    return repoTokens.split("/");
}

/**
 * async function to get the data with gihub api
 * 
 * @param {string} repoUrl the repository api url
 * @param {string} theme the theme selected
 */
async function fetchData(repoUrl, theme) {
    // fetch data
    const repoData = await fetch(repoUrl, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    }).then(response => {
        // if the request succeed
        if (response.ok) {
            return response.json();
        }
        else {
            alert('Error in fetching data');
        }
    }).catch(err => {
        console.log(err);
        alert('Error in fetching data');
    });

    // generate the image div with the data from the request
    generateImage(repoData.owner.login, repoData.owner.avatar_url, repoData.name, repoData.description, repoData.stargazers_count, theme);
}

/**
 * generate the image div
 * 
 * @param {string} username the repository owner username
 * @param {string} userImage the repository owner image
 * @param {string} repoName the repository name
 * @param {string} description the repository description
 * @param {string} stars the repository number of stars
 * @param {string} theme the selected theme
 */
function generateImage(username, userImage, repoName, description, stars, theme) {
    // create the card div
    let imgCard = createCardElement(username, userImage, repoName, description, stars, theme);

    // empty the div that contains the card
    $('#img').empty();

    // add the card
    $('#img').append(imgCard);

    // enable the download button for the card
    document.getElementById("download").disabled = false;
}

/**
 * create the card div, style by the theme selected
 * 
 * @param {string} username the repository owner username
 * @param {string} userImage the repository owner image
 * @param {string} repoName the repository name
 * @param {string} description the repository description
 * @param {string} stars the repository number of stars
 * @param {string} theme the selected theme
 * @returns div of the card
 */
function createCardElement(username, userImage, repoName, description, stars, theme) {
    // create the div that contains all the data
    let elem = createElementWithClass('div', `img-card ${theme}`);

    // create the head div of the card
    let head = createCardHead(stars);

    // create the content div of the card
    let content = createCardContent(username, repoName, description, theme);

    // create the footer div of the card
    let footer = createCardFooter(username, userImage);

    // append the head, content and footer the the parent element
    elem.append(head, content, footer);

    // return the element
    return elem;
}

/**
 * create the header of the card
 * 
 * @param {string} stars the repository number of stars
 * @returns card header div
 */
function createCardHead(stars) {
    // create the div that contains the elements of the card head
    let head = createElementWithClass('div', 'card-head');

    // create the MacOS style buttons div
    let buttons = createElementWithClass('div', 'buttons');
    let red = createElementWithClass('div', 'red');
    let yellow = createElementWithClass('div', 'yellow');
    let green = createElementWithClass('div', 'green');
    buttons.append(red, yellow, green);

    // create the number of stars div
    let star = createElementWithClass('div', 'stars');
    let numOfStars = document.createElement('span');
    numOfStars.textContent = stars;
    let starIcon = createElementWithClass('i', 'far fa-star');
    star.append(numOfStars, starIcon);

    // append the buttons and star to the parent element
    head.append(buttons, star);

    // return the head div
    return head;
}

/**
 * create the content of the card, styled by the theme selected
 * 
 * @param {string} username the repository owner username
 * @param {string} repoName the repository name
 * @param {string} description the repository description
 * @param {string} theme the selected theme
 * @returns card content div
 */
function createCardContent(username, repoName, description, theme) {
    // create the div that contains the elements of the card content
    let content = createElementWithClass('div', 'card-content');

    // create the title of the content div, the username and the repository name
    let title = createElementWithClass('div', 'title');
    let usernameSpan = createElementWithClass('span', `${theme}-username`);
    usernameSpan.textContent = `${username} / `;
    let repoNameSpan = createElementWithClass('span', `${theme}-reponame`);
    repoNameSpan.textContent = repoName;
    title.append(usernameSpan, repoNameSpan);

    // create the description div
    let descriptionDiv = createElementWithClass('div', 'description');
    let descriptionSpan = createElementWithClass('span', `${theme}-description`);
    descriptionSpan.textContent = description;
    descriptionDiv.append(descriptionSpan);

    // append the title and description to the parent element
    content.append(title, descriptionDiv);

    // return the content div
    return content;
}

/**
 * create the footer of the card
 * 
 * @param {string} username the repository owner username
 * @param {string} userImage the repository owner image
 * @returns card footer div
 */
function createCardFooter(username, userImage) {
    // create the div that contains the elements of the card footer
    let footer = createElementWithClass('div', 'card-footer');

    // create the profile image div
    let profileDiv = createElementWithClass('div', 'profile-img');
    let profileImage = createElementWithClass('img', 'profile');
    profileImage.src = userImage;
    profileImage.alt = username;
    profileDiv.append(profileImage);

    // append the profile image to the parent element
    footer.append(profileDiv);

    // return the footer div
    return footer;
}

/**
 * generic funtion to create an element with a class
 * 
 * @param {string} tag the element tag
 * @param {string} tagClass the element class
 * @returns element with class
 * @example input: 'div', 'img'; output: <div class="img"></div>
 */
function createElementWithClass(tag, tagClass) {
    // create the element
    let elem = document.createElement(tag);

    // add the class
    elem.className = tagClass;

    // return the element
    return elem;
}

/**
 * download the card div as png image using dom-to-image and FileSave.js libraries
 */
function downloadImage() {
    // get the div of the card div
    let elem = document.getElementById('img');

    // convert to blob and download as png
    domtoimage.toBlob(elem).then(blob => {
        window.saveAs(blob, `${usernameForSave}.${reponameForSave}.png`);
    });
}