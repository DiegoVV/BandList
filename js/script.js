if (window.location.pathname == "/index.html") {
    var bandList = [];
    var albumList = [];
    var currentList = [];
    var request = new XMLHttpRequest();

    request.open('GET', 'https://iws-recruiting-bands.herokuapp.com/api/bands', true);

    request.onload = function () {
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            data.forEach(band =>
                //console.log(band)
                bandList.push(band)
            ); //name ; image ; genre ; biography ; numPlays ; albums [ ] ; biography ; id
            currentList = bandList;
            display(currentList);
        } else {
            console.log("Error retrieving request for bands");
        }
    }

    request.send();
    
    var request2 = new XMLHttpRequest();

    request2.open('GET', 'https://iws-recruiting-bands.herokuapp.com/api/albums', true);

    request2.onload = function () {
        let data = JSON.parse(this.response);

        if (request2.status >= 200 && request2.status < 400) {
            data.forEach(album => {
                albumList.push(album);
            }); //band (id) ; id ; image ; name ; releasedDate
        } else {
            console.log("Error retrieving request for albums");
        }
    }

    request2.send();

}

function display(list) {
    document.getElementById("bandListing").innerHTML = "";
    list.forEach(item => {
        let band = document.createElement("a");
        band.setAttribute("href", "javascript:bandPage('" + item.id + "')");
        
        let bandImage = document.createElement("IMG");
        bandImage.src = item.image;
        bandImage.setAttribute("onerror", "this.src='img/no_results.png'") // If image doesn't load, displays no_results.png as image
        bandImage.setAttribute("class", "roundImage");
        
        let bandName = document.createElement("P");
        bandName.textContent = item.name;
        bandName.setAttribute("class", "title");
        //let br = document.createElement("BR");
        
        let bandPlays = document.createElement("P");
        bandPlays.textContent = item.numPlays + "  plays";
        bandPlays.setAttribute("class", "plays");
        
        let line = document.createElement("HR");
        band.appendChild(bandImage);
        band.appendChild(bandName);
        //band.appendChild(br);
        band.appendChild(bandPlays);
        band.appendChild(line);
        document.getElementById("bandListing").appendChild(band);
    })
}

function dropdownMenu() {
    document.getElementById("myDropdown").setAttribute("style", "display: block;");
}

function bandPage(band) {
    // Clean Top Bar
    let topBar = document.getElementById("topBar");
    topBar.innerHTML = "";
    topBar.setAttribute("class", "topBar semitransparent");
    let backButton = document.createElement("A");
    backButton.setAttribute("href", "javascript:back()");
    let arrowIcon = document.createElement("I");
    arrowIcon.setAttribute("class", "fa fa-arrow-left");
    backButton.appendChild(arrowIcon);
    let isobarLogo = document.createElement("IMG");
    isobarLogo.setAttribute("src", "img/logo.png");
    isobarLogo.setAttribute("alt", "Isobar.fm");
    isobarLogo.setAttribute("class", "center");
    topBar.appendChild(backButton);
    topBar.appendChild(isobarLogo);
    
    // Clean Main Window
    let mainWindow = document.getElementById("main");
    mainWindow.innerHTML = "";
    
    let pageInfo = new XMLHttpRequest();

    // id should be hidden using MD5, which would require a search function among the bands
    pageInfo.open('GET', 'https://iws-recruiting-bands.herokuapp.com/api/bands/' + band, true);

    pageInfo.onload = function () {
        let currentBand = JSON.parse(this.response);

        let bandBackground = document.createElement("IMG");
        bandBackground.setAttribute("src", currentBand.image);
        bandBackground.setAttribute("class", "background");
        mainWindow.appendChild(bandBackground);

        let bandName = document.createElement("P");
        bandName.textContent = currentBand.name;
        bandName.setAttribute("class", "bandTitle");
        mainWindow.appendChild(bandName);

        let bandInfo = document.createElement("DIV");
        bandInfo.setAttribute("class", "bandInfo");
        let bandGenre = document.createElement("P");
        bandGenre.textContent = currentBand.genre;
        let bandAvatar = document.createElement("IMG");
        bandAvatar.setAttribute("src", currentBand.image);
        bandAvatar.setAttribute("class", "roundImage bandAvatar");
        let bandPlays = document.createElement("P");
        bandPlays.textContent = currentBand.numPlays + " plays";
        bandPlays.setAttribute("class", "floatRight");
        bandInfo.appendChild(bandGenre);
        bandInfo.appendChild(bandPlays);
        mainWindow.appendChild(bandInfo);
        mainWindow.appendChild(bandAvatar);
        
        let bandBiography = document.createElement("P");
        bandBiography.innerHTML = currentBand.biography;
        bandBiography.setAttribute("class", "biography");
        let HR = document.createElement("HR");
        HR.setAttribute("class", "lineBeforeAlbum");
        mainWindow.appendChild(bandBiography);
        mainWindow.appendChild(HR);
        
        let albunsTitle = document.createElement("P");
        albunsTitle.innerHTML = "Albuns";
        albunsTitle.setAttribute("class", "title albumTitle");
        mainWindow.appendChild(albunsTitle);
        
        
        let albumSection = document.createElement("DIV");
        albumSection.setAttribute("class", "albuns");
        currentBand.albums.forEach(album => { // IMPORTANT: if user clicks too quickly on a band, albuns have not loaded yet, and this doesn't work
            let albumObject = albumList.find(x => x.id === album);
            let albumCover = document.createElement("IMG");
            albumCover.setAttribute("src", albumObject.image);
            albumSection.appendChild(albumCover);
        });
        mainWindow.appendChild(albumSection);
    }
    pageInfo.send();
}

function compareName(a, b) {
    
    const bandA = a.name.toUpperCase();
    const bandB = b.name.toUpperCase();
    let comparison = 0;
    if (bandA > bandB) {
        comparison = 1;
    } else if (bandA < bandB) {
        comparison = -1;
    }
    return comparison;
}

function comparePlays(a, b) {
    
    const bandA = a.numPlays;
    const bandB = b.numPlays;
    let comparison = 0;
    if (bandA > bandB) {
        comparison = -1;
    } else if (bandA < bandB) {
        comparison = 1;
    }
    return comparison;
}

function search() {
    
    let searchInput = document.getElementById("searchInput");
    let searchResults = [];
    //console.log(searchInput.value);
    filter = searchInput.value.toUpperCase();
    for (i = 0; i < bandList.length; i++) {
        a = bandList[i].name;
        if (a.toUpperCase().indexOf(filter) > -1) {
            searchResults.push(bandList[i]);
        }
    }
    if (searchResults.length > 0) {
        if (searchResults.length == bandList.length) {
            document.getElementById("resultsAmountText").innerHTML = " ";
        } else {
            document.getElementById("resultsAmountText").innerHTML = '&nbsp;' + '&nbsp;' + searchResults.length + ' resultados';
        }
        currentList = searchResults;
        display(currentList);
    } else {
        document.getElementById("resultsAmountText").innerHTML = " ";
        document.getElementById("bandListing").innerHTML = "";
        let noResults = document.createElement("P");
        noResults.textContent = "Sem resultados...";
        noResults.setAttribute("class", "noResultText");
        let noResultsImg = document.createElement("IMG");
        noResultsImg.src = "img/no_results.png";
        noResultsImg.setAttribute("class", "noResult");
        noResults.appendChild(noResultsImg);
        document.getElementById("bandListing").appendChild(noResults);
    }
}

function order(type) {
    
    if (type > 0) { // alphabetical
        display(currentList.sort(compareName));
    } else { // by popularity
        display(currentList.sort(comparePlays));
    }
}

function back() {
    
    location.reload();
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropdownBtn')) {
        document.getElementById("myDropdown").setAttribute("style", "display: none;");
    }
}