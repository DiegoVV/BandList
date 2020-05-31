var bandList = [];
var currentList = [];
var request = new XMLHttpRequest();

request.open('GET', 'https://iws-recruiting-bands.herokuapp.com/api/bands', true);

request.onload = function() {
    let data = JSON.parse(this.response);

    data.forEach(band => 
        //console.log(band)
        bandList.push(band)
    ); //name ; image ; genre ; biography ; numPlays ; albums [ ] ; biography ; id
    currentList = bandList;
    display(currentList);
}

request.send();

function display(list){
    //console.log(bandList);
    document.getElementById("bandListing").innerHTML = "";
    list.forEach( item => {
        let band = document.createElement("a");
        let bandImage = document.createElement("IMG");
        bandImage.src = item.image;
        /*if(item.image){                       //Check if image loaded properly
            bandImage.src = item.image;
        } else{
            bandImage.src = "img/no_results.png";            
        }*/
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
        //console.log(bandImage);
    })
}

function dropdownMenu() {
    document.getElementById("myDropdown").setAttribute("style", "display: block;");
}

function bandPage(id){
    let pageInfo = new XMLHttpRequest();
    // id should be hidden using MD5, which would require a search function among the bands
    pageInfo.open('GET', 'https://iws-recruiting-bands.herokuapp.com/api/bands/' + id, true);

    pageInfo.onload = function() {
        let data = JSON.parse(this.response);
        console.log(data);

        /*data.forEach(band => 
            //console.log(band)
            searchResult.push(band)
        ); //name ; image ; genre ; biography ; numPlays ; albums [ ] ; biography ; id

        display(searchResult);*/
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
    if(searchResults.length > 0){
        if(searchResults.length == bandList.length){
            document.getElementById("resultsAmountText").innerHTML  = " ";            
        } else{
            document.getElementById("resultsAmountText").innerHTML  = '&nbsp;' + '&nbsp;' + searchResults.length + ' resultados';            
        }
        currentList = searchResults;
        display(currentList);
    } else {
        document.getElementById("resultsAmountText").innerHTML  = " ";
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

function order(type){
    if(type > 0){ // alphabetical
        display(currentList.sort(compareName));
    } else { // by popularity
        display(currentList.sort(comparePlays));      
    }
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropdownBtn')) {
        document.getElementById("myDropdown").setAttribute("style", "display: none;");
    }
}