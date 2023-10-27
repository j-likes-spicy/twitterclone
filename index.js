import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const tweetInput = document.getElementById("tweet-input");
const feed = document.getElementById("feed");

/* Event listener function on the entire DOM to scan for "likes", "retweets", "replies", or interaction with the tweet button */
document.addEventListener("click", (e) => {
  if (e.target.dataset.like) {
    likeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    retweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    replyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    buttonClick();
  }
});
/* This function handles the heart icon on the dataset corresponding to the UUID */
const likeClick = (item) => {
  const targetItem = tweetsData.filter((element) => {
    return element.uuid === item;
  })[0];

  if (targetItem.isLiked) {
    targetItem.likes--;
  } else {
    targetItem.likes++;
  }

  targetItem.isLiked = !targetItem.isLiked;
  render();
};

/* This function handles the retweet icon on the dataset corresponding to the UUID */
const retweetClick = (item) => {
  const targetItem = tweetsData.filter((element) => {
    return element.uuid === item;
  })[0];

  if (targetItem.isRetweeted) {
    targetItem.retweets--;
  } else {
    targetItem.retweets++;
  }

  targetItem.isRetweeted = !targetItem.isRetweeted;
  render();
};

/* This function toggles the replies between visible and invisible */
const replyClick = (item) => {
  console.log(item);
  document.getElementById(`replies-${item}`).classList.toggle("hidden");
};

/* This function listens for input within the textarea and on the button. Also, this will unshift new posts to the top of the page */
const buttonClick = () => {
  if (tweetInput.value.trim() !== "") {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
};

const getFeedContent = (dataToRender) => {
  let feedContent = "";
  let feedReplies = "";

  for (let item of dataToRender) {
    if (item.replies.length > 0) {
      for (let reply of item.replies) {
        feedReplies += `
            <div class="tweet-reply">
            <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
                </div>
        </div>
            `;
      }
    }

    feedContent += `
    
    <div class="tweet">
    <div class="tweet-inner">
        <img src="${item.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${item.handle}</p>
            <p class="tweet-text">${item.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${
                  item.uuid
                }"></i>
                    ${item.replies.length}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-heart ${
                  item.isLiked ? "liked" : ""
                }" data-like="${item.uuid}"></i>
                    ${item.likes}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${
                  item.isRetweeted ? "retweeted" : ""
                }" data-retweet="${item.uuid}"></i>
                    ${item.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${item.uuid}">
        ${feedReplies}
    </div>   
</div>

    `;
  }
  return feedContent;
};

// Function to render or reload content to the DOM
const render = () => {
  feed.innerHTML = getFeedContent(tweetsData);
};

feed.innerHTML = getFeedContent(tweetsData);
