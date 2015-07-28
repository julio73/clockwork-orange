/*global window, Snap */
window.onload = function () {
  'use strict';
  var scene, padding, canvas, hours, hoursNums, hoursX, hoursY, hourTSpans,
    faceH, faceW, spacing, markings, markingsPath, gaps, hand, handX,
    WF1, time, movement, displayFn, currentFace;

  hoursNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  faceW = 720; // 6! (factorial)
  faceH = faceW / 6;
  padding = 20;
  scene = new Snap(faceW + padding * 4, faceH + padding * 2).attr({id: "scn"});
  canvas = scene
    .rect(padding, padding, faceW + 2 * padding, faceH)
    .attr({fill: '#FFF'});
  hoursY = faceH - padding * 2;
  hoursX = padding * 2;
  spacing = faceW / 12;
  markingsPath = "M" + [hoursX, hoursY + 30, hoursX, hoursY] + "m-5,0,10,0";
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
  markings = scene.path(markingsPath).attr({stroke: "#000"});

  // And group them as the main watch face
  WF1 = scene.group(hours, markings);

  // Then add a clipping mask
  scene.group(canvas, WF1).attr({
    clip: scene
      .rect(padding * 1.5, padding * 1.5, faceW + padding, faceH - padding * 1.5)
  });

  // Initialize updater
  function initializeUpdater() {
    // Initial time value
    var d = new Date(),
      t = [d.getHours(), d.getMinutes(), d.getSeconds()],
      t_display = d.toLocaleTimeString(),
      t_anchor = (t[0] % 12 <= 6) ? "start" : "end",
      newHandX = hoursX + spacing * ((t[0] % 12) + (t[1] / 60)),
      t_posx = newHandX + (t_anchor === "start" ? 10 : -10); // temp fix
    // Set initial hand and time location
    hand = scene
      .line(newHandX, padding * 1.5, newHandX, faceH)
      .attr({
        fill: "none",
        stroke: "#f40",
        strokeWidth: 1
      });
    time = scene
      .text(t_posx, padding * 2.5, t_display)
      .attr({
        fontFamily: "Courier New",
        fontSize: "15px",
        textAnchor: t_anchor,
        fill: "#f40"
      });
    // Launch updater
    function updater() {
      var new_d = new Date();
      if (d.getSeconds() !== new_d.getSeconds()) {
        d = new_d;
        t = [d.getHours(), d.getMinutes(), d.getSeconds()];
        t_display = d.toLocaleTimeString();
        t_anchor = (t[0] % 12 <= 6) ? "start" : "end";
        newHandX = hoursX + spacing * ((t[0] % 12) + (t[1] / 60));
        t_posx = newHandX + (t_anchor === "start" ? 10 : -10);
        window.requestAnimationFrame(function () {
          time.node.innerHTML = t_display;
          if (handX !== newHandX) {
            time.attr({
              x: t_posx,
              textAnchor: t_anchor
            });
            handX = newHandX;
            hand.attr({'x1': handX, 'x2': handX});
          }
          updater();
        });
      } else {
        window.requestAnimationFrame(updater);
      }
    }
    window.requestAnimationFrame(updater);
  }

  // Start clock
  initializeUpdater();

  // Group hand & time
  movement = scene.group(hand, time);

  // Display functions for each face
  displayFn = {
    // Number of registered faces
    registered: 2,
    // Hide WF1
    0: function () {
      Snap.animate(1, 0, function (val) {
        WF1.node.style.opacity = val;
      }, 100);
    },
    // Reveal WF1
    1: function () {
      Snap.animate(0, 1, function (val) {
        WF1.node.style.opacity = val;
      }, 100);
    }
  };

  // Then cycle thru faces on movement click
  currentFace = 1;
  movement.click(function () {
    currentFace = (currentFace + 1) % displayFn.registered;
    displayFn[currentFace]();
  });


};