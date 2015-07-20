/*global window, Snap */
window.onload = function () {
  'use strict';
  var scene, hours, hourText, hourPosY, faceWidth, spacing, markingsPath,
    intervals, watchFace, midPointX, hand;

  scene = new Snap().attr({id: "#scene"});
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  faceWidth = 720;
  spacing = faceWidth / hours.length;

  // Display some hours
  hourPosY = 100;
  hourText = scene.text(0, hourPosY, hours).attr({
    font: "300 24px Courier New",
    textAnchor: "middle"
  });

  // Evenly space out the hours and build marking path
  markingsPath = "";
  intervals = {
    0: 0,
    1: spacing / 6,
    2: spacing * 2 / 6,
    3: spacing * 3 / 6,
    4: spacing * 4 / 6,
    5: spacing * 5 / 6
  };
  hours.forEach(function (hour, index) {
    var posx = spacing * hour;
    // Select hour and move it
    hourText.select("tspan:nth-child(" + (index + 1) + ")")
      .attr({x: posx});
    // Build marking path
    markingsPath += "M" + [posx - intervals[0], hourPosY + 15, posx - intervals[0], hourPosY + 30]
      + "M" + [posx - intervals[1], hourPosY + 27, posx - intervals[1], hourPosY + 30]
      + "M" + [posx - intervals[2], hourPosY + 27, posx - intervals[2], hourPosY + 30]
      + "M" + [posx - intervals[3], hourPosY + 21, posx - intervals[3], hourPosY + 30]
      + "M" + [posx - intervals[4], hourPosY + 27, posx - intervals[4], hourPosY + 30]
      + "M" + [posx - intervals[5], hourPosY + 27, posx - intervals[5], hourPosY + 30];
  });

  // Add the markings and group them with hours under the watch face
  watchFace = scene.group(
    hourText,
    scene.path(markingsPath)
      .attr({
        fill: "none",
        stroke: "#000",
        strokeWidth: 1
      })
  );

  // Adding watch hand
  midPointX = faceWidth / 2;
  hand = scene.line(midPointX, 0, midPointX, 400).attr({
    fill: "none",
    stroke: "red",
    strokeWidth: 1
  });

};