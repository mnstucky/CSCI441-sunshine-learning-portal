const { getBadges } = require("../model/db.js");

async function getBadgeInfo(studentid) {
  const userBadges = await getBadges(studentid);
  const badgeResults = [];

  for(badge of userBadges) {
    badgeResults.push({badgeicon: badge.badgetype, 
      badgetitle: badge.trackname});
  }
  
  //console.log(badgeResults);
  return badgeResults;
}

exports.getBadgeInfo = getBadgeInfo;
