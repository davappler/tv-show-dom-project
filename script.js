
// these variables are made global so that when there values are changed then
// it can be reflected to the event listeners present in setup function. 
// Here we are giving them some initial value so that our page does not start empty when it is open for the first time.

var episodeDataBase=getAllEpisodes();
let container=document.querySelector(".episodes-container");
createPageWithEpisodes(container,episodeDataBase);


function setup() {

  let search=document.querySelector("#search"); // Search Box 
  let dropDownEpisodes=document.querySelector("#episodes"); //Drop Down menu for episodes
  let dropDownShowMenu=document.querySelector("#shows"); // Drop down menu for shows
  let refreshButton=document.querySelector(".refresh-button");

  refreshButton.addEventListener("click",function(){

    location.reload();
  })
  // Taking all the shows in the variable allShows
  let allShows=getAllShows();
  dropDownShows(allShows);


  // As soon as a show is selected we go and display episodes of that show.
  dropDownShowMenu.addEventListener("change",function()
  {
    createPageFromShow(dropDownShowMenu.value , allShows);
  });



  // As soon as we enter something in searchBox, this function will be called and page will be updated.
  search.addEventListener("keyup",function(event){
    event.preventDefault();
    let keyword=search.value;
    if(event.keyCode==13) // this is for pressing enter button.
    searchAndUpdate(keyword,episodeDataBase);
  })

  // this event listener is for the select drop down menu of episodes.
  // it will find the item and display it
  dropDownEpisodes.addEventListener("change",function()
  {
    let searchValue= dropDownEpisodes.value.split(" ");
    searchAndUpdate(searchValue[0],episodeDataBase); // we search only with episode number to be sure while searching so that we get exactly one episode displayed
  });

}



function createPageFromShow(showSelected,allShows)
{
  let showNameAsArray= showSelected.split(" ");
  let container=document.querySelector(".episodes-container");

  removeAllChild(container);

    let index   =  showNameAsArray[0];
    index       =  Number(index); // since it will be a string here it is converted to number.
    index       =  index-1; // since index is starting from 1 in the drop Down menu we need to subtract 1 in order to use it for the array.
    
    let show    =  allShows[index]; // show is the object
    let SHOW_ID =  show.id;

    let URL="https://api.tvmaze.com/shows/"+SHOW_ID+"/episodes";

    // Here we are fetching the data from the URL of the show. 
    fetch(URL)
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      let allEpisodes=data;
      episodeDataBase=data; // We are modifying it here so that event listeners in setup function stay updated as well.
      createPageWithEpisodes(container,allEpisodes);
    })
    .catch(function(error){
      console.log("ERROR")
    })
}


function createPageWithEpisodes(container,allEpisodes)
{
  for(let i=0;i<allEpisodes.length;i++)
    {
      let epi=createEpisodeFromObject(allEpisodes[i]);
      container.appendChild(epi);
    }
    // Calling this function will create the dropDown menu with total episodes.
    dropDownMenu(allEpisodes);
}




function createEpisodeFromObject(episodeObj)
{
  let episodeBox= document.createElement("div");
  let title=document.createElement("A");
  let image=document.createElement("img");
  let description=document.createElement("p");

  episodeBox.setAttribute("id", episodeObj.id);
  episodeBox.setAttribute("class", "episode-design");

  let titleSsn;
  let titleEpi;
  if(episodeObj.season<10)
    titleSsn=  "0"+episodeObj.season
  else
    titleSsn=episodeObj.season;

  if(episodeObj.number<10)
   titleEpi= "0"+episodeObj.number;
  else
    titleEpi=episodeObj.number;

  title.textContent=episodeObj.name + " S" + titleSsn+"E"+titleEpi;
  title.href=episodeObj.url;
  title.target="_blank";
  title.setAttribute("class","episode-title");

  image.setAttribute("class","episode-image");
  image.src=episodeObj.image.original;
  image.alt=`Episode ${episodeObj.name}`;

  description.setAttribute("class","description");
  description.textContent=episodeObj.summary.replace("<p>","");
  description.textContent=description.textContent.replace("</p>","");

  episodeBox.appendChild(title);
  episodeBox.appendChild(image);
  episodeBox.appendChild(description);
  
  return episodeBox;

}



function dropDownMenu(allEpisodes)
{
  let dropDownBox=document.querySelector("#episodes");

  removeAllChild(dropDownBox);

  for(let i=0;i<allEpisodes.length;i++)
  {
    let ssn=allEpisodes[i].season;
    let epi=allEpisodes[i].number;

    if(ssn<10)
      ssn="0"+ssn;
    if(epi<10)
      epi="0"+epi;

    // title is made up of name and episode number and season number.
    let title=  "S"+ssn+"E"+epi + " -"+allEpisodes[i].name;
    let option=document.createElement("OPTION");
    option.value= title;
    option.text= title;
    dropDownBox.appendChild(option);
    
  }
}




function removeAllChild(parent)
{
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);    
  }
}






function dropDownShows(allShows)
{
  let dropDownContainer=document.querySelector("#shows");

  for(let i=0;i<allShows.length;i++)
  {
    let title=String(i+1) + " ) " + allShows[i].name;
    let option=document.createElement("OPTION");
    option.value= title;
    option.text= title;
    dropDownContainer.appendChild(option);
  }
}







//This function is used to search.
function searchAndUpdate(keyword,allEpisodes)
{
  let arrayOfKeywords=keyword.split(" ");
  for(let i=0;i<arrayOfKeywords.length;i++)
  {
    searchWord(arrayOfKeywords[i],allEpisodes);
  }
}




// This function will search the keyword in the database and update the page
function searchWord(keyword,allEpisodes)
{
  let container=document.querySelector(".episodes-container");
  let counter=0;
  let displayNumber=document.querySelector(".number-of-episodes");
  // as soon as we enter a value to search we will empty the page.
  removeAllChild(container);

  for(let i=0;i<allEpisodes.length;i++)
  {
    let ssn=allEpisodes[i].season;
    let epi=allEpisodes[i].number;

    if(ssn<10)
      ssn="0"+ssn;
    if(epi<10)
      epi="0"+epi;

    // title is made up of name and episode number and season number.
     let title= allEpisodes[i].name + " "+"S"+ssn+"E"+epi;
     let description = allEpisodes[i].summary;

    // searchElement is a function that returns true or false depending on, 
    // if keyWord is found in the given title or description.
    let found = searchElement(keyword,title,description); 

    if(found) // if found then add it to the page
    {
      counter++; // Number of episodes containing Keyword.
      let epi=createEpisodeFromObject(allEpisodes[i]);
      container.appendChild(epi);
    }
  }

  displayNumber.textContent=`Displaying ${counter}/73`;
}






// A boolean function which returns either true or false. 
// returns true if title or description contain the given keyword.
function searchElement( keyword, title, description)
{
  // transforming them to lowercase so that search is not case sensitive.
  keyword=keyword.toLowerCase();
  title=title.toLowerCase();
  description=description.toLowerCase();

  if(title.includes(keyword)  || description.includes(keyword))
   return true;

  return false;
}


window.onload = setup;