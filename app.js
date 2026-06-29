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
  // The popup is ALWAYS shown as a single box centered over the image,
  // in the same fixed position no matter which marker was clicked. This
  // guarantees it can never be clipped at an edge on any screen size.
  function openCallout(figure, dot, hotspot) {
    var callout = document.createElement("div");
    callout.className = "callout";

    // An explicit close (X) button in the corner.
    var close = document.createElement("button");
    close.className = "callout-close";
    close.setAttribute("aria-label", "Close");
    close.textContent = "×"; // ×
    callout.appendChild(close);

    var h3 = document.createElement("h3");
    h3.textContent = hotspot.title;
    var p = document.createElement("p");
    p.textContent = hotspot.text;
    callout.appendChild(h3);
    callout.appendChild(p);

    // Clicking the box itself (including the X) dismisses it.
    callout.addEventListener("click", function (event) {
      event.stopPropagation();
      closeAllCallouts();
    });

    figure.appendChild(callout);
    dot.setAttribute("aria-expanded", "true");
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
