/* =====================================================================
   app.js — all the display & interaction logic.
   ---------------------------------------------------------------------
   This file reads the SESSIONS array from data.js and turns it into the
   interactive exhibit. You should rarely need to edit this file — to
   change wording, images, or hotspot positions, edit data.js instead.

   The whole thing is driven by two numbers we keep track of:
     currentSession — which game tab is active
     currentScene   — which scene within that game is active
   Whenever either changes, we re-draw the screen.
   ===================================================================== */

(function () {
  "use strict";

  // Grab the empty containers that index.html set up for us.
  var sessionTabs = document.getElementById("session-tabs");
  var sceneTabs = document.getElementById("scene-tabs");
  var stage = document.getElementById("stage");
  var infoBar = document.getElementById("info-bar");

  // Our two pieces of "where are we" state.
  var currentSession = 0;
  var currentScene = 0;

  // ===================================================================
  // 1. SESSION TABS — one button per game.
  // ===================================================================
  function renderSessionTabs() {
    sessionTabs.innerHTML = "";
    SESSIONS.forEach(function (session, i) {
      var btn = document.createElement("button");
      btn.textContent = session.game;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", i === currentSession ? "true" : "false");
      btn.addEventListener("click", function () {
        currentSession = i;
        currentScene = 0; // reset to the first scene of the newly chosen game
        renderAll();
      });
      sessionTabs.appendChild(btn);
    });
  }

  // ===================================================================
  // 2. SCENE TABS — only shown when a game has more than one scene
  //    (e.g. Red Dead Redemption 2's Wilderness vs. Saint-Denis).
  // ===================================================================
  function renderSceneTabs() {
    sceneTabs.innerHTML = "";
    var scenes = SESSIONS[currentSession].scenes;

    // A single-scene game needs no sub-tabs, so we leave the row empty.
    if (scenes.length < 2) return;

    scenes.forEach(function (scene, i) {
      var btn = document.createElement("button");
      btn.textContent = scene.title;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", i === currentScene ? "true" : "false");
      btn.addEventListener("click", function () {
        currentScene = i;
        renderScene(); // only the scene changes, so just redraw that part
        renderSceneTabs();
      });
      sceneTabs.appendChild(btn);
    });
  }

  // ===================================================================
  // 3. THE SCENE — title, intro, image, and clickable hotspots.
  // ===================================================================
  function renderScene() {
    var scene = SESSIONS[currentSession].scenes[currentScene];
    stage.innerHTML = "";

    // -- Heading: title + one-line intro --
    var head = document.createElement("div");
    head.className = "scene-head";
    var h2 = document.createElement("h2");
    h2.textContent = scene.title;
    var intro = document.createElement("p");
    intro.className = "scene-intro";
    intro.textContent = scene.intro;
    head.appendChild(h2);
    head.appendChild(intro);
    stage.appendChild(head);

    // -- The image frame (markers are positioned inside this) --
    var figure = document.createElement("div");
    figure.className = "scene-figure";

    var img = document.createElement("img");
    img.src = scene.image;
    img.alt = scene.title;
    figure.appendChild(img);

    // -- One marker per hotspot --
    scene.hotspots.forEach(function (hotspot, index) {
      var dot = document.createElement("button");
      dot.className = "hotspot";
      dot.textContent = index + 1; // numbered 1, 2, 3...
      dot.setAttribute("aria-expanded", "false");
      dot.setAttribute(
        "aria-label",
        "Hotspot " + (index + 1) + ": " + hotspot.title
      );
      // Percentage coordinates from data.js keep markers aligned at any size.
      dot.style.left = hotspot.x + "%";
      dot.style.top = hotspot.y + "%";

      // Clicking a marker toggles its popup open or closed.
      dot.addEventListener("click", function (event) {
        event.stopPropagation(); // don't let the click bubble up and self-dismiss
        var isOpen = dot.getAttribute("aria-expanded") === "true";
        closeAllCallouts();
        if (!isOpen) openCallout(figure, dot, hotspot);
      });

      figure.appendChild(dot);
    });

    stage.appendChild(figure);

    // -- A gentle nudge so the reveal feels discoverable --
    var hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent =
      "Click the numbered markers to reveal what the scene teaches.";
    stage.appendChild(hint);
  }

  // ===================================================================
  // 4. CALLOUTS — the little popup shown when a hotspot is clicked.
  // ===================================================================
  function openCallout(figure, dot, hotspot) {
    var callout = document.createElement("div");
    callout.className = "callout";

    var h3 = document.createElement("h3");
    h3.textContent = hotspot.title;
    var p = document.createElement("p");
    p.textContent = hotspot.text;
    callout.appendChild(h3);
    callout.appendChild(p);

    // Add it first (hidden) so we can measure its real size, then we work
    // out a position that keeps the whole box inside the viewport.
    callout.style.visibility = "hidden";
    callout.style.left = "0px";
    callout.style.top = "0px";
    figure.appendChild(callout);

    positionCallout(figure, dot, hotspot, callout);

    callout.style.visibility = "visible";
    dot.setAttribute("aria-expanded", "true");
  }

  // Work out left/top (in pixels, inside the figure) for the popup so that
  // it never runs off any edge of the screen:
  //   • near the right edge  -> the box shifts left to stay on screen
  //   • near the top edge    -> the box opens below the marker
  //   • near the bottom edge -> the box opens above the marker
  //   • always clamped so it can't spill past the left or right edge
  function positionCallout(figure, dot, hotspot, callout) {
    var figW = figure.clientWidth;
    var figH = figure.clientHeight;
    var cw = callout.offsetWidth;
    var ch = callout.offsetHeight;
    var r = dot.offsetWidth / 2; // marker radius
    var gap = 14; // breathing room between marker and box
    var edge = 8; // keep at least this far from any edge

    // Marker centre, in pixels relative to the figure.
    var mx = (hotspot.x / 100) * figW;
    var my = (hotspot.y / 100) * figH;

    // Where the figure currently sits in the viewport — lets us clamp the
    // box against the actual window, which matters most on phones.
    var rect = figure.getBoundingClientRect();

    // ---- Horizontal: centre on the marker, then clamp on screen ----
    var left = mx - cw / 2;
    var minLeft = Math.max(edge, edge - rect.left); // never past left edge
    var maxLeft = Math.min(
      figW - cw - edge,
      window.innerWidth - edge - cw - rect.left
    );
    if (maxLeft < minLeft) maxLeft = minLeft; // box wider than space: pin left
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    // ---- Vertical: prefer ABOVE; flip BELOW if there isn't room ----
    var aboveTop = my - r - gap - ch;
    var belowTop = my + r + gap;
    var roomAbove = rect.top + aboveTop >= edge; // fits above within viewport
    var below = !roomAbove;
    var top = below ? belowTop : aboveTop;
    if (below) callout.classList.add("below");

    // Last-resort clamp so the box is always fully visible vertically.
    var minTop = edge - rect.top;
    var maxTop = window.innerHeight - edge - ch - rect.top;
    if (top < minTop) top = minTop;
    if (maxTop > minTop && top > maxTop) top = maxTop;

    // ---- Point the arrow back at the marker, even after nudging ----
    var arrowX = mx - left;
    arrowX = Math.max(14, Math.min(cw - 14, arrowX));
    callout.style.setProperty("--arrow-left", arrowX + "px");

    callout.style.left = left + "px";
    callout.style.top = top + "px";
  }

  // Remove every open popup and reset every marker to "closed".
  function closeAllCallouts() {
    var open = document.querySelectorAll(".callout");
    open.forEach(function (node) {
      node.parentNode.removeChild(node);
    });
    var dots = document.querySelectorAll('.hotspot[aria-expanded="true"]');
    dots.forEach(function (dot) {
      dot.setAttribute("aria-expanded", "false");
    });
  }

  // Clicking anywhere that ISN'T a marker dismisses the popup.
  document.addEventListener("click", closeAllCallouts);
  // Pressing Escape also closes it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllCallouts();
  });
  // A popup's position is measured against the window, so close any open
  // one if the window is resized to avoid it ending up misaligned.
  window.addEventListener("resize", closeAllCallouts);

  // ===================================================================
  // 5. PER-GAME INFO BAR — light metadata + historical context for the
  //    currently selected game (the content lives in data.js as `meta`).
  // ===================================================================
  function renderInfoBar() {
    var meta = SESSIONS[currentSession].meta;
    infoBar.innerHTML = "";
    if (!meta) return; // a game without metadata simply shows nothing

    var wrap = document.createElement("div");
    wrap.className = "wrap";

    // Game name
    var name = document.createElement("div");
    name.className = "info-game";
    name.textContent = SESSIONS[currentSession].game;
    wrap.appendChild(name);

    // Released / Copies sold stat block
    var stats = document.createElement("dl");
    stats.className = "info-stats";
    stats.appendChild(statBlock("Released", meta.released));
    stats.appendChild(statBlock("Copies sold", meta.copiesSold));
    wrap.appendChild(stats);

    // Historical context paragraph
    var context = document.createElement("p");
    context.className = "info-context";
    var label = document.createElement("span");
    label.className = "info-label";
    label.textContent = "Historical context";
    context.appendChild(label);
    context.appendChild(document.createTextNode(meta.context));
    wrap.appendChild(context);

    infoBar.appendChild(wrap);
  }

  // Small helper that builds one <dt>/<dd> pair for the stat block.
  function statBlock(term, value) {
    var div = document.createElement("div");
    var dt = document.createElement("dt");
    dt.textContent = term;
    var dd = document.createElement("dd");
    dd.textContent = value;
    div.appendChild(dt);
    div.appendChild(dd);
    return div;
  }

  // ===================================================================
  // 6. DRAW EVERYTHING (used on first load and when the game changes).
  // ===================================================================
  function renderAll() {
    renderSessionTabs();
    renderSceneTabs();
    renderScene();
    renderInfoBar();
  }

  // Kick things off once the page is ready.
  renderAll();
})();
