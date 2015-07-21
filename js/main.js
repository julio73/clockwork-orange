/*global window, Snap */
window.onload = function () {
  'use strict';
  var scene, padding, canvas, hours, hoursNums, hoursX, hoursY, hourTSpans,
    faceH, faceW, midX, spacing, markings, markingsPath, gaps, hand, movable,
    watchFace;

  hoursNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  faceW = 720; // 6! (factorial)
  faceH = faceW / 6;
  padding = 20;
  scene = new Snap(faceW + padding * 4, faceH + padding * 2).attr({id: "#scn"});
  canvas = scene
    .rect(padding, padding, faceW + 2 * padding, faceH)
    .attr({fill: '#FFF'});
  hoursY = faceH - padding * 2;
  hoursX = padding * 2;
  midX = hoursX + faceW / 2;
  spacing = faceW / 12;
  markingsPath = "";
  gaps = {
    0: 0,
    1: spacing / 6,
    2: spacing * 2 / 6,
    3: spacing * 3 / 6,
    4: spacing * 4 / 6,
    5: spacing * 5 / 6
  };

  // Display some hours
  hours = scene.text(hoursX, hoursY, hoursNums).attr({
    fontFamily: "Courier New",
    fontSize: "20px",
    textAnchor: "middle"
  });

  // Evenly space out the hours and build marking path
  hourTSpans = hours.selectAll("tspan");
  hoursNums.forEach(function (hour, index) {
    var posx = hoursX + spacing * hour;
    // Select hour and move it
    hourTSpans[index].attr({x: posx});
    // Build marking path
    markingsPath
      += "M" + [posx - gaps[0], hoursY + 15, posx - gaps[0], hoursY + 30]
      + "M" + [posx - gaps[1], hoursY + 27, posx - gaps[1], hoursY + 30]
      + "M" + [posx - gaps[2], hoursY + 27, posx - gaps[2], hoursY + 30]
      + "M" + [posx - gaps[3], hoursY + 21, posx - gaps[3], hoursY + 30]
      + "M" + [posx - gaps[4], hoursY + 27, posx - gaps[4], hoursY + 30]
      + "M" + [posx - gaps[5], hoursY + 27, posx - gaps[5], hoursY + 30];
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
    .line(midX, padding, midX, faceH + padding)
    .attr({
      fill: "none",
      stroke: "#f40",
      strokeWidth: 1
    });

  // And group them under the watch face
  movable = scene.group(hours, markings);
  watchFace = scene.group(canvas, movable, hand);

  // Then add a clipping mask
  watchFace.attr({
    clip: scene.rect(padding * 2, padding * 2, faceW, faceH - padding * 2)
  });

};
