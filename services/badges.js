const { getBadges } = require("../model/db.js");

async function getBadgeInfo(studentid) {
  const getbadges = await getBadges(studentid);
  return {
      badgeicon: getbadges[0]?.badgetype,
      badgetitle: getbadges[0]?.trackname,
  }
}

exports.getBadgeInfo = getBadgeInfo;
