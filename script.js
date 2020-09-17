// things to do 
// Remove p tags from text, make a function for it.
// Change display id to make it working
// Make search compatible for shows as well.

// When a show is clicked we take it's id and then go and print episodes. change this with only image or header.
// then we will be able to use readmore button.


// these variables are made global so that when there values are changed then
// it can be reflected to the event listeners present in setup function. 
// Here we are giving them some initial value so that our page does not start empty when it is open for the first time.

var episodeDataBase="";
let container=document.querySelector(".episodes-container");
// createPageWithEpisodes(container,episodeDataBase);
// let readMoreButton=document.createElement("BUTTON");

function setup() {
 
  let dropDownEpisodes=document.querySelector("#episodes"); //Drop Down menu for episodes
  let dropDownShowMenu=document.querySelector("#shows"); // Drop down menu for shows
  let refreshButton=document.querySelector(".refresh-button");


  refreshButton.addEventListener("click",function(){

    location.reload();
  })
  // Taking all the shows in the variable allShows
  let allShows=getAllShows();
  dropDownShows(allShows);
  createInitialPage(allShows);
 

  // As soon as a show is selected we go and display episodes of that show.
  dropDownShowMenu.addEventListener("change",function()
  {
    createPageFromShow(dropDownShowMenu.value , allShows);
  });

  // this event listener is for the select drop down menu of episodes.
  // it will find the item and display it
  dropDownEpisodes.addEventListener("change",function()
  {
    let searchValue= dropDownEpisodes.value.split(" ");
    searchAndUpdate(searchValue[0],episodeDataBase); // we search only with episode number to be sure while searching so that we get exactly one episode displayed
  });
  
}


// readmore will not work because everyshow has same id
// mke it work for the pressed button by giving them different id by numbering them.
// function readMore() {
//   var dots = document.getElementById("dots");
//   var moreText = document.getElementById("more");
//   var btnText = document.getElementById("read-more-button");

//   if (dots.style.display === "none") {
//     dots.style.display = "inline";
//     btnText.innerHTML = "Read more";
//     moreText.style.display = "none";
//   } else {
//     dots.style.display = "none";
//     btnText.innerHTML = "Read less";
//     moreText.style.display = "inline";
//   }
// }


// this function fetches data and call another function  makeCastTeam with the fetched Data.
//ShowId will be used to append the created the castTeam into show using this ID
//ObjectId will be used to create the API link to fetch data. 
function createCasteTeamForShow(objectID,showID)
{
  let URL="https://api.tvmaze.com/shows/"+objectID+"?embed=cast";

  fetch(URL)
    .then(function(response){
      return response.json()
    })
    .then(function(show){
       makeCastTeam(show,showID);
    })
    .catch(function(error){
      console.log(error)
    })
}

//This function will create div element for cast team and when the button is clicked it will append it and remove it if pressed again.

function makeCastTeam(showObject,showID)
{

  let show=document.getElementById(showID);
  let castTeamContainer=document.createElement("div");
  let castButton=document.createElement("BUTTON");
  castButton.innerHTML="CAST TEAM";
  castButton.setAttribute("class","cast-button");

  castTeamContainer.setAttribute("class","cast-team-container")
  castTeamContainer.setAttribute("id",showObject.id);
  castTeamContainer.style.visibility="visible";

  let embeddedArray=showObject._embedded.cast;

  for(let i=0;i<embeddedArray.length;i++)
  {
    if(embeddedArray[i])
    {
      let actor=document.createElement("div");//contains image and name of actor.
      let castImage=document.createElement("IMG");
      let castName=document.createElement("p");

      actor.setAttribute("class","actor");
      castImage.setAttribute("class","cast-image");
      castName.setAttribute("class","cast-name");

      let characterName=embeddedArray[i].character.name;
      let realName=embeddedArray[i].person.name;
      let source=embeddedArray[i].person.image;
      if(source)
        castImage.src=source.medium;

      let finalName=realName+"(as "+characterName+")"
      castName.textContent=finalName;
      actor.appendChild(castName);
      actor.appendChild(castImage);
      castTeamContainer.appendChild(actor);
    }
    show.appendChild(castButton);
  }

  castButton.addEventListener("click",function(){

    if(show.contains(castTeamContainer))
    {
      castButton.textContent="CAST TEAM"
      show.removeChild(show.lastChild);
    }
    else
    {
      castButton.textContent="HIDE ^";
      show.appendChild(castTeamContainer);
    }
  })
}




function createInitialPage(allShows)
{
  let forShow=true;
  let allEpisodes=" ";
  activateSearch(allEpisodes,allShows,forShow);

  for(let i=0;i<allShows.length;i++)
  {
    if(i!=50) // because at index 50 image url is not defined in show.js file.
      createShowPreview(allShows[i],i);
  }
}

// This function is called when we click on a show on the initial page.
// When it is called it takes the id of the clicked show and creates the page for that show by displaying it's episodes.
function clickedShow(clicked)
{
  let allShows=getAllShows();
  clicked=Number(clicked);


  createPageFromShow(clicked+1, allShows); // here we have clicked +1 because here value of clicked is 
  // starting form 0 but our function createPageFromShow is designed to start form 1, 
  // so in order to start from 1 we did +1
}


// This function creates a show from one object. We intake index so that we can give specific id to every show.
function createShowPreview(showObject,id)
{
  let show=document.createElement("div");
  let showTitle=document.createElement("p");

  // We are setting the onclick of every show so that we can get the id and use the id of the show 
  // when it is clicked.
  // clickedShow is a function We created to get the id of the clicked show and use it.
  //uncomment this line
  showTitle.setAttribute('onclick', "clickedShow(this.id)");
  
  let descriptionAndRating=document.createElement("div");
  let showDescription=document.createElement("div");
  let showImage=document.createElement("img");
  let showText=document.createElement("p");
  
  // this function will fetch the data for cast team and then return the cast team as a html tag.
  // createCasteTeamForShow(showObject.id);

  // let castButton=document.createElement("BUTTON");
  // every caste button should have one id for each show.
  
  let ratingBox=document.createElement("div");
  let ratingList=document.createElement("ul");

  let rating=document.createElement("li");
  let genre=document.createElement("li");
  let status=document.createElement("li");
  let runtime=document.createElement("li");


  show.setAttribute("class", "show");
  show.setAttribute("id", id);
  showTitle.setAttribute("id", id);
  showTitle.setAttribute("class", "show-title");
  descriptionAndRating.setAttribute("class", "description-and-rating");
  showDescription.setAttribute("class","show-description");
  showImage.setAttribute("class","show-image");
  showText.setAttribute("class","show-text");
  ratingBox.setAttribute("class","rating-box");
  ratingList.setAttribute("class","rating-list");

  let showGenre=" ";

    showTitle.textContent=showObject.name;
    showImage.src=showObject.image.medium;

    // this function will add span tag in the text which will be then used for read more and read less button
    // showText.innerHTML=addSpanAtLimit(showObject.summary);
    showText.innerHTML=showObject.summary;
    
    rating.textContent=`Rated:${showObject.rating.average}`;

    for(let j=0;j<showObject.genres.length ; j++)
    {
      showGenre += " "+ showObject.genres[j]
    }
    genre.textContent=`Genre:${showGenre}`;


    status.textContent=`Status:${showObject.status}`;
    runtime.textContent=`Runtime:${showObject.runtime}`;


    showDescription.appendChild(showImage);
    showDescription.appendChild(showText);
    // showDescription.appendChild(readMoreButton);
  
    ratingList.appendChild(rating);
    ratingList.appendChild(genre);
    ratingList.appendChild(status);
    ratingList.appendChild(runtime);
  
    ratingBox.appendChild(ratingList);
  
    descriptionAndRating.appendChild(showDescription);
    descriptionAndRating.appendChild(ratingBox);
  
    show.appendChild(showTitle);
    show.appendChild(descriptionAndRating);

    container.appendChild(show);
    createCasteTeamForShow(showObject.id,id);
}







function createPageFromShow(showSelected,allShows)
{

  showSelected=String(showSelected);//Converting it to string to make sure it works perfectly in further steps.(in order to make split functioning without any hassle).
  let showNameAsArray= showSelected.split(" ");
  let container=document.querySelector(".episodes-container");
  // let displayNumber=document.querySelector(".number-of-episodes");

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
      activateSearch(allEpisodes," ",false);
    })
    .catch(function(error){
      console.log(error)
    })

}








function activateSearch(allEpisodes,allShows,forShow)
{
  let search=document.querySelector("#search"); // Search Box

  search.addEventListener("keyup",function(event){
  event.preventDefault();
  let keyword=search.value;
  if(event.keyCode==13) // this is for pressing enter button.
  searchAndUpdate(keyword,allEpisodes,forShow,allShows);//give allShows
  })
}






//This function will add a span tag at the limit in the description, then we can use that span for read more and read les button.
function addSpanAtLimit(paragraph)
{
	let limit=20;// 20 words
	let textArr=paragraph.split(" ");

	if(textArr.length<limit)
	{
		return paragraph;
	}

	let startingSpan=["<span id='dots'>...</span><span id='more'>"];
	let endingSpan=["</span>"]

	textArr.splice(limit, 0, startingSpan[0]);
	textArr.splice(textArr.length, 0, endingSpan[0]);

	let finaltext="";

	for(let i=0;i<textArr.length;i++)
	{
		finaltext+=textArr[i]+" ";
	}

	return finaltext;
}








function createPageWithEpisodes(container,allEpisodes)
{
  let displayNumber=document.querySelector(".display-episodes");
  displayNumber.textContent=`Displaying ${allEpisodes.length}/${allEpisodes.length}`;
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
//forShow is a boolean variable telling us if the search if for show, if it is true then we search for shows otherwise for episodes.
function searchAndUpdate(keyword,allEpisodes,forShow,allShows)
{
  let arrayOfKeywords=keyword.split(" ");
  for(let i=0;i<arrayOfKeywords.length;i++)
  {
    searchWord(arrayOfKeywords[i],allEpisodes,forShow,allShows);
  }
}







// This function will search the keyword in the database and update the page
function searchWord(keyword,allEpisodes,forShow,allShows)
{
  let container=document.querySelector(".episodes-container");
  let counter=0;
  let displayNumber=document.querySelector(".display-episodes");
  // as soon as we enter a value to search we will empty the page.
  removeAllChild(container);
  let title=" ";
  let description=" ";


  let currentSearchList;
  if(forShow)
  {
    currentSearchList=allShows;
  }
  else{
    currentSearchList=allEpisodes;
  }

  for(let i=0;i<currentSearchList.length-1;i++)
  {
    if(!forShow) // for episodes
    {
      let ssn=allEpisodes[i].season;
      let epi=allEpisodes[i].number;

      if(ssn<10)
        ssn="0"+ssn;
      if(epi<10)
        epi="0"+epi;

      // title is made up of name and episode number and season number.
       title= allEpisodes[i].name + " "+"S"+ssn+"E"+epi;
       description = allEpisodes[i].summary;
    }
    else
    {
      title=allShows[i].name;
      description=allShows[i].summary;
    }
    // searchElement is a function that returns true or false depending on, 
    // if keyWord is found in the given title or description.
    let found = searchElement(keyword,title,description); 

    if(found) // if found then add it to the page.
    {
      if(forShow && i!=50) // because at index 50 image url is not defined in show.js file.
      {
        createShowPreview(allShows[i],i);
      }
      else if(!forShow){

        let epi=createEpisodeFromObject(allEpisodes[i]);
        container.appendChild(epi);
      }
      counter++; // Number of episodes containing Keyword.
    }
  }
  displayNumber.textContent=`Displaying ${counter}/${currentSearchList.length}`;
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