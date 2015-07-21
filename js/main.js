/*global window, Snap */
window.onload = function () {
  'use strict';
  var scene, canvas, hourPosX, hours, hourText, hourPosY, faceWidth, spacing,
    markings, markingsPath, hourTSpans, intervals, watchFace, midPointX, hand;


  scene = new Snap().attr({id: "#scene"});
  canvas = scene.rect(20, 20, 780, 180).attr({fill: '#FFF'});
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  faceWidth = 720;
  hourPosY = 100;
  hourPosX = 50;
  midPointX = faceWidth / 2 + hourPosX;
  spacing = faceWidth / hours.length;
  markingsPath = "";
  intervals = {
    0: 0,
    1: spacing / 6,
    2: spacing * 2 / 6,
    3: spacing * 3 / 6,
    4: spacing * 4 / 6,
    5: spacing * 5 / 6
  };

  // Display some hours
  hourText = scene.text(0, hourPosY, hours).attr({
    font: "300 24px Courier New",
    textAnchor: "middle"
  });

  // Evenly space out the hours and build marking path
  hourTSpans = hourText.selectAll("tspan");
  hours.forEach(function (hour, index) {
    var posx = spacing * hour;
    // Select hour and move it
    hourTSpans[index].attr({x: posx});
    // Build marking path
    markingsPath += "M" + [posx - intervals[0], hourPosY + 15, posx - intervals[0], hourPosY + 30]
      + "M" + [posx - intervals[1], hourPosY + 27, posx - intervals[1], hourPosY + 30]
      + "M" + [posx - intervals[2], hourPosY + 27, posx - intervals[2], hourPosY + 30]
      + "M" + [posx - intervals[3], hourPosY + 21, posx - intervals[3], hourPosY + 30]
      + "M" + [posx - intervals[4], hourPosY + 27, posx - intervals[4], hourPosY + 30]
      + "M" + [posx - intervals[5], hourPosY + 27, posx - intervals[5], hourPosY + 30];
  });

  // Add the markings 
  markings = scene.path(markingsPath)
    .attr({
      fill: "none",
      stroke: "#000",
      strokeWidth: 1
    });

  // Then the watch hand
  hand = scene
    .line(midPointX, hourPosY / 2, midPointX, hourPosY * 1.5)
    .attr({
      fill: "none",
      stroke: "red",
      strokeWidth: 1
    });

  // And group them under the watch face
  watchFace = scene.group(hourText, markings, hand);

};