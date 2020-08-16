//You can edit ALL of the code here
// we have 73 episodes
function setup() {
  let container=document.querySelector(".episodes-container");
  console.log(container);
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  for(let i=0;i<allEpisodes.length;i++)
  {
  let epi=createEpisodeFromObject(allEpisodes[i]);
  container.appendChild(epi);
  }
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
  description.textContent=episodeObj.summary;

  episodeBox.appendChild(title);
  episodeBox.appendChild(image);
  episodeBox.appendChild(description);
  
  return episodeBox;

}

function makePageForEpisodes(episodeList) {

  // call a function for whole array, array has objects 
   
  // const rootElem = document.getElementById("episodes-container");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
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