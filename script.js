
// things to do
// Allow search field to search for multiple words too. // verify this with others

// now it is working for multiple words but I want it to search the words in order as we type
// ask for a better way to remove <p> tag

// make a button to refresh.




function setup() {

  let container=document.querySelector(".episodes-container");
  let search=document.querySelector("#search"); // Search Box 
  let dropDown=document.querySelector("#episodes"); //Drop Down menu
  let refreshButton=document.querySelector(".refresh-button");

  refreshButton.addEventListener("click",function(){

    location.reload();
  })

  // const allEpisodes = getAllEpisodes();
  let allEpisodes;


  fetch("https://api.tvmaze.com/shows/82/episodes")
  .then(function(response)
  {
    return response.json();
  })
  .then(function(data)
  {
    allEpisodes=data;

    // In this "for loop" we are creating episodes from objects and adding them to the webpage.
    for(let i=0;i<allEpisodes.length;i++)
    {
      let epi=createEpisodeFromObject(allEpisodes[i]);
      container.appendChild(epi);
    }
    // As soon as we enter something in searchBox, this function will be called and page will be updated.
    search.addEventListener("keyup",function(event){
      event.preventDefault();
      let keyword=search.value;
      if(event.keyCode==13) // this is for pressing enter button.
      searchAndUpdate(keyword,allEpisodes);
    })

    // Calling this function will create the dropDown menu with 73 episodes.
    dropDownMenu(allEpisodes);

    // this event listener is for the select drop down menu
    // it will find the item and display it
    dropDown.addEventListener("change",function()
    {
      let searchValue= dropDown.value.split(" ");
      searchAndUpdate(searchValue[0],allEpisodes); // we search only with episode number to be sure while searching so that we get exactly one episode displayed
    });

  })
  .catch(function(error)
  {
    console.log("Error")
  })
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

function removeAllChild(parent)
{
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);    
  }
}

function dropDownMenu(allEpisodes)
{
  let dropDownBox=document.querySelector("#episodes");

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

window.onload = setup;





// {
//   id: 4952,
//   url:
//     "http://www.tvmaze.com/episodes/4952/game-of-thrones-1x01-winter-is-coming",
//   name: "Winter is Coming",
//   season: 1,
//   number: 1,
//   airdate: "2011-04-17", 
//   airtime: "21:00",        
//   airstamp: "2011-04-18T01:00:00+00:00", xxxx
//   runtime: 60,
//   image: {
//     medium:
//       "http://static.tvmaze.com/uploads/images/medium_landscape/1/2668.jpg",
//     original:
//       "http://static.tvmaze.com/uploads/images/original_untouched/1/2668.jpg"
//   },
//   summary:
//     "<p>Lord Eddard Stark, ruler of the North, is summoned to court by his old friend, King Robert Baratheon, to serve as the King's Hand. Eddard reluctantly agrees after learning of a possible threat to the King's life. Eddard's bastard son Jon Snow must make a painful decision about his own future, while in the distant east Viserys Targaryen plots to reclaim his father's throne, usurped by Robert, by selling his sister in marriage.</p>",
//   _links: {
//     self: {
//       href: "http://api.tvmaze.com/episodes/4952"
//     }
//   }
// }