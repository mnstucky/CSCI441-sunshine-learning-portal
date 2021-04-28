const { getBadges,
        putBadge } = require("../model/db.js");

async function getBadgeInfo(studentid) {
  const userBadges = await getBadges(studentid);
  const badgeResults = [];

  for(badge of userBadges) {
    badgeResults.push({badgeicon: badge.badgetype, 
      badgetitle: badge.trackname});
  }
  
  return badgeResults;
}


// RICK adding badge code
async function addBadge(studentId, trackId, score) {

  let trackName = "";
  let badgeImage = "";  
  switch(Number(trackId)) {
    case 1:
      trackName = "Multiply Decimals";
      badgeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/240px-Eo_circle_green_checkmark.svg.png";
      break;
    case 2:
      trackName = "Divide Decimals";
      badgeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Eo_circle_cyan_checkmark.svg/240px-Eo_circle_cyan_checkmark.svg.png";
      break;
    case 3:
      trackName = "Multiply Fractions";
      badgeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Eo_circle_deep-orange_checkmark.svg/240px-Eo_circle_deep-orange_checkmark.svg.png";
      break;
    case 4:
      trackName = "Divide Fractions";
      badgeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Eo_circle_blue-grey_checkmark.svg/240px-Eo_circle_blue-grey_checkmark.svg.png";
      break;
    default:
      break;
  }

  await putBadge(studentId, Number(trackId), trackName, score, badgeImage);
}

exports.getBadgeInfo = getBadgeInfo;
exports.addBadge = addBadge;
