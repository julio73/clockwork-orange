/**
 * Clockwork-orange
 * Copyright (C) 2015 Julio Maniratunga
 * Powered by Snap.svg 0.4.1
 */
/*global window, Snap */
window.onload = function () {
  'use strict';
  var scene, canvas, watch, WF1, timer, movement, displayFn, currentFace;

  // Setup the watch
  watch = {
    wdt: 720,   // width: 6! (factorial)
    hgt: 120,   // height: wdt / 6
    pad: 20,    // padding: hgt / 6 
    canvas: null,
    bkgrd: '#FFF' // background color
  };

  // Setup canvas
  canvas = {
    view: null,
    x1: watch.pad,
    y1: watch.pad,
    x2: 2 * watch.pad + watch.wdt,
    y2: watch.hgt
  };

  // Base the scene on watch 
  scene = new Snap(watch.wdt + watch.pad * 4, watch.hgt + watch.pad * 2)
                .attr({id: "scn"});

  // Put the canvas on the scene
  canvas.view = scene
    .rect(canvas.x1, canvas.y1, canvas.x2, canvas.y2)
    .attr({fill: watch.bkgrd});

  // Prepping movement
  movement = {
    hand: {
      view: null,
      x: null,
      y: null,
      hgt: null,
      nextx: null,
      dashSize: 2,
      attribs: {
        stroke: "#f40",
        fill: "none",
        strokeWidth: 1
      }
    },
    clock: {
      view: null,
      anchor: null,
      x: null,
      y: null,
      attribs: {
        fontFamily: "Courier New",
        fontSize: "15px",
        fontWeight: 500,
        fill: "#f40",
        textAnchor: "start"
      }
    }
  };

  // Prepping first watch face
  WF1 = {
    mask: null,
    markings: {
      view: null,
      path: "",
      stroke: "#000",
      measure: function (hour) {
        var posx = WF1.hours.x + (watch.wdt / 12) * hour,
          posy = WF1.hours.y + 30;
        return {
          posx: posx,
          posy: posy,
          first: "M" + [posx, posy - 15, posx, posy],
          full: "M" + [posx, posy - 15, posx, posy]
            + "M" + [posx - (watch.wdt / 72), posy - 3,
                     posx - (watch.wdt / 72), posy]
            + "M" + [posx - (watch.wdt / 72) * 2, posy - 3,
                     posx - (watch.wdt / 72) * 2, posy]
            + "M" + [posx - (watch.wdt / 72) * 3, posy - 9,
                     posx - (watch.wdt / 72) * 3, posy]
            + "M" + [posx - (watch.wdt / 72) * 4, posy - 3,
                     posx - (watch.wdt / 72) * 4, posy]
            + "M" + [posx - (watch.wdt / 72) * 5, posy - 3,
                     posx - (watch.wdt / 72) * 5, posy]
        };
      }
    },
    hours: {
      view: null,
      tspans: null,
      nums: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      x: watch.pad * 2,
      y: watch.hgt - watch.pad * 1.5,
      attribs: {
        fontFamily: "Courier New",
        fontSize: "20px",
        textAnchor: "middle"
      }
    }
  };

  // Display some hours with WF1
  WF1.hours.view = scene.text(WF1.hours.x, WF1.hours.y, WF1.hours.nums)
    .attr(WF1.hours.attribs);

  // Evenly space out the hours and add the markings for WF1
  WF1.hours.tspans = WF1.hours.view.selectAll("tspan");
  WF1.hours.nums.forEach(function (hour, index) {
    var measurements = WF1.markings.measure(hour);
    // Select tspan hour and move it into place
    WF1.hours.tspans[index].attr({x: measurements.posx});
    // Build markings path as as well
    if (index === 0) {
      WF1.markings.setup += measurements.first;
    } else {
      WF1.markings.setup += measurements.full;
    }
  });
  // Add the markings
  WF1.markings.view =
    scene.path(WF1.markings.setup).attr({stroke: WF1.markings.stroke});

  timer = {
    date : {
      current: null,
      next: null
    },
    millis: null,
    seconds: null,
    minutes: null,
    hours: null,
    update: function () {
      timer.date.current = timer.date.next;
      timer.hours = timer.date.current.getHours();
      timer.minutes = timer.date.current.getMinutes();
      timer.seconds = timer.date.current.getSeconds();
      timer.millis = timer.date.current.getMilliseconds();
    },
    timestamp: function () {
      return timer.date.current.toLocaleTimeString();
    }
  };
  // Initialize movement display
  function movementInit() {
    // Initial the next time value
    timer.date.next = new Date();
    // Update the rest of the timer
    timer.update();
    // Initialize hand
    movement.hand.nextx = watch.pad * 2
      + (watch.wdt / 12) * ((timer.hours % 12) + (timer.minutes / 60));
    movement.hand.x = movement.hand.nextx;
    movement.hand.y = watch.pad;
    movement.hand.hgt = watch.hgt;
    movement.hand.attribs['stroke-dasharray'] =
      [movement.hand.hgt - movement.hand.dashSize, movement.hand.dashSize];
    // Initialize clock
    movement.clock.anchor = (timer.hours % 12 <= 6) ? "start" : "end";
    movement.clock.y = watch.pad * 2.5;
    movement.clock.x = movement.hand.nextx
      + (movement.clock.anchor === "start" ? 1 : -1) * (watch.pad / 2);
    // Set initial hand and time location
    movement.hand.view = scene
      .line(movement.hand.x, movement.hand.y,
            movement.hand.x, movement.hand.y + movement.hand.hgt)
      .attr(movement.hand.attribs);
    movement.clock.attribs.textAnchor = movement.clock.anchor;
    movement.clock.view = scene
      .text(movement.clock.x, movement.clock.y, timer.timestamp())
      .attr(movement.clock.attribs);
  }
  movementInit();

  // Setup movement updater
  function movementUpdater() {
    timer.date.next = new Date();
    if (Math.abs(timer.date.next.getMilliseconds() - timer.millis) > 125) {
      // Repaint stroke offset (8fps)
      movement.hand.view.attr({
        'stroke-dashoffset': -movement.hand.hgt
          * ((timer.seconds / 60) + (timer.millis / 60000))
      });
      // Repaint clock and hand (1fps)
      if (timer.date.next.getSeconds() !== timer.seconds) {
        // Update clock
        movement.clock.anchor = (timer.hours % 12 <= 6) ? "start" : "end";
        movement.clock.x = movement.hand.nextx
          + (movement.clock.anchor === "start" ? 1 : -1) * (watch.pad / 2);
        movement.clock.view.node.innerHTML = timer.timestamp();
        movement.clock.view.attr({
          x: movement.clock.x,
          textAnchor: movement.clock.anchor
        });
        // Update hand
        movement.hand.nextx = watch.pad * 2
          + (watch.wdt / 12) * ((timer.hours % 12) + (timer.minutes / 60));
        if (movement.hand.x !== movement.hand.nextx) {
          movement.hand.x = movement.hand.nextx;
          movement.hand.view.attr({
            x1: movement.hand.x,
            x2: movement.hand.x
          });
        }
      }
      // Save current changes on timer
      timer.update();
    }
    // Request next update
    window.requestAnimationFrame(movementUpdater);
  }
  window.requestAnimationFrame(movementUpdater);

  // Display functions for each face
  displayFn = {
    // Number of registered faces
    registered: 2,
    0: function () {
      Snap.animate(0, 1, function displayWF0(val) {
        // Move in large view
        movement.clock.view.attr({
          fontSize: 15 * (1 + val) + 'px',
          fontWeight: movement.clock.attribs.fontWeight + (200 * val),
          y: movement.clock.y + 70 * val
        });
        movement.hand.view.attr({
          strokeWidth: movement.hand.attribs.strokeWidth + (3 * val)
        });
        // Hide WF1's hours and markings
        WF1.hours.view.attr({
          opacity: 1 - val,
          y: WF1.hours.y + 30 * val
        });
        WF1.markings.view.attr({
          opacity: 1 - val,
          'stroke-dasharray': 20,
          'stroke-dashoffset': -20 * val
        });
      }, 160);
    },
    1: function () {
      Snap.animate(0, 1, function displayWF1(val) {
        // Move out large view
        movement.clock.view.attr({
          fontSize: 15 * (2 - val) + 'px',
          fontWeight: movement.clock.attribs.fontWeight + (200 * (1 - val)),
          y: movement.clock.y + 70 * (1 - val)
        });
        movement.hand.view.attr({
          strokeWidth: movement.hand.attribs.strokeWidth + (3 * (1 - val))
        });
        // Show WF1's hours and markings
        WF1.hours.view.attr({
          opacity: val,
          y: WF1.hours.y + 30 * (1 - val)
        });
        WF1.markings.view.attr({
          opacity: val,
          'stroke-dasharray': 20,
          'stroke-dashoffset': -20 * (1 - val)
        });
      }, 160);
    }
  };

  // Then cycle through faces on scene click
  currentFace = 1; // WF1
  scene.click(function displayNextFace() {
    currentFace = (currentFace + 1) % displayFn.registered;
    displayFn[currentFace]();
  });

};