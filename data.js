/*
  data.js — ALL of the editable content for the exhibit lives here.
  ----------------------------------------------------------------------
  This is the ONE file you need to touch to change wording, add a scene,
  or move a hotspot. The display code in app.js never has to change.

  How it is organized:
    SESSIONS = an array of "sessions" (one per game).
      Each session has:
        id     — a short unique slug used internally
        game   — the game's name (shown on the session tab)
        scenes — an array of scenes belonging to that game.

      Each scene has:
        id       — a short unique slug
        title    — the scene's headline
        intro    — the one-line introduction shown above the image
        image    — the relative path to the image (keep the real file
                   extension so the path always matches the saved file)
        hotspots — an array of clickable markers.

      Each hotspot has:
        title — the bold label shown at the top of its popup
        text  — the full annotation revealed when the marker is clicked
        x     — horizontal position as a PERCENT of the image width (0–100)
        y     — vertical position as a PERCENT of the image height (0–100)

  Because x/y are percentages, the markers stay glued to the right spot
  no matter how large or small the image is drawn on screen.

  To reposition a marker: nudge its x/y numbers.
  To add a scene: copy a { ... } scene block and edit it.
  To add a whole game: copy a { ... } session block and edit it.
*/

const SESSIONS = [
  // =====================================================================
  // SESSION 1 — Assassin's Creed Odyssey  (the paper's core case study)
  // =====================================================================
  {
    id: "odyssey",
    game: "Assassin's Creed Odyssey",
    // meta = the per-game info bar shown at the bottom of the page.
    meta: {
      released: "2018 (Ubisoft)",
      copiesSold: "Over 10 million",
      context:
        "Set during the Peloponnesian War (431–404 BCE), the decades-long struggle for hegemony between Athens and Sparta. Ubisoft built the world alongside historians and archaeologists, reconstructing the sanctuaries, cities, and monuments of classical Greece from ancient sources such as Pausanias and Plutarch — and from recent scholarship like the “Gods in Color” research on ancient polychromy.",
    },
    scenes: [
      {
        id: "odeon",
        title: "The Odeon of Pericles",
        intro:
          "Climbing the Acropolis toward the Parthenon, you pass a building that looks wrong — too foreign, too angular, too Eastern. Nobody told you to study it. But you noticed.",
        image: "images/odeon-pericles.webp",
        hotspots: [
          {
            title: "The roofline",
            text:
              "Sloped from a single peak, said to imitate the captured tent of the Persian king Xerxes (Pausanias). You read “foreign” before you read a single word.",
            x: 50,
            y: 18,
          },
          {
            title: "The pillars",
            text:
              "A forest of more than ninety internal columns. Plutarch describes it crowded with seats and pillars; Vitruvius claims it was roofed with masts taken from defeated Persian ships.",
            x: 61,
            y: 43,
          },
          {
            title: "The placement",
            text:
              "Set right beside the Theater of Dionysus, deliberately strange among Athenian marble. Walking past it teaches what no caption did — this was a victory monument dressed as a building.",
            x: 12,
            y: 30,
          },
        ],
      },
      {
        id: "statues",
        title: "Painted Statues",
        intro:
          "Everyone “knows” Greek statues are white marble. The game quietly tells you otherwise.",
        image: "images/painted-statues.webp",
        hotspots: [
          {
            title: "The paint",
            text:
              "Key statues and temples appear pigmented — bright, patterned, alive — drawn straight from the “Gods in Color” exhibition that toured 2003–2015.",
            x: 22,
            y: 48,
          },
          {
            title: "Why it matters",
            text:
              "Antiquity was loud with color. The Neoclassical revival sold us the white-marble myth. The game smuggles real, recent scholarship into a blockbuster.",
            x: 71,
            y: 38,
          },
          {
            title: "The payoff",
            text:
              "When you meet this fact later in a lecture, it won’t be new — you already absorbed it climbing a temple. That’s modern research inserting itself into pop culture.",
            x: 22,
            y: 82,
          },
        ],
      },
    ],
  },

  // =====================================================================
  // SESSION 2 — Red Dead Redemption 2  (two scenes, switchable)
  // =====================================================================
  {
    id: "rdr2",
    game: "Red Dead Redemption 2",
    meta: {
      released: "2018 (Rockstar Games)",
      copiesSold: "Roughly 77 million",
      context:
        "Set in 1899, at the closing of the American frontier. The game stages the tension between a vanishing wilderness and an industrializing, urbanizing nation as railroads, cities, and federal power press in on the open range. Its detailed environment is dense enough that players have been shown to learn to identify real fauna simply by playing (Crowley et al.).",
    },
    scenes: [
      {
        id: "wilderness",
        title: "The Wilderness",
        intro: "No quest asks you to learn the landscape. You learn it anyway.",
        image: "images/rdr2-wilderness.jpg",
        hotspots: [
          {
            title: "The fauna",
            text:
              "In an actual study (Crowley et al.), players measurably learned to identify in-game animals — a world built for entertainment teaching ecology by accident.",
            x: 78,
            y: 60,
          },
          {
            title: "The scale",
            text:
              "The sheer emptiness is the argument. You feel the size of a continent that isn’t fenced yet.",
            x: 28,
            y: 24,
          },
          {
            title: "The vanishing frontier",
            text:
              "It’s 1899, and the open range is closing as you ride across it. The wilderness isn’t backdrop — it’s an elegy you absorb by moving through it.",
            x: 57,
            y: 70,
          },
        ],
      },
      {
        id: "saint-denis",
        title: "Saint-Denis",
        intro:
          "Ride from the wilderness into Saint-Denis and the game makes its argument without a line of dialogue.",
        image: "images/rdr2-saint-denis.jpg",
        hotspots: [
          {
            title: "The density",
            text:
              "Streetcars, gaslights, crowds, factories. The “Western” suddenly looks like a modern industrial city.",
            x: 53,
            y: 83,
          },
          {
            title: "The contrast",
            text:
              "Set this beside the wilderness scene and you have the whole thesis of the era — the frontier didn’t just close, it was replaced.",
            x: 24,
            y: 40,
          },
          {
            title: "Modernity arriving",
            text:
              "This is no mythic West of saloons and gunfights. It’s a port city, industrializing whether the cowboy likes it or not.",
            x: 10,
            y: 13,
          },
        ],
      },
    ],
  },

  // =====================================================================
  // SESSION 3 — Assassin's Creed IV: Black Flag  (one scene)
  // =====================================================================
  {
    id: "black-flag",
    game: "Assassin's Creed IV: Black Flag",
    meta: {
      released: "2013 (Ubisoft)",
      copiesSold:
        "Around 15 million (the best-selling game in the Assassin's Creed franchise)",
      context:
        "Set in the Caribbean during the early-eighteenth-century “Golden Age of Piracy,” amid competing Spanish, British, and French colonial empires. Beneath the pirate fantasy sits the real infrastructure of Atlantic empire — maritime trade routes, colonial port cities, naval power, and the slave economy that underwrote them.",
    },
    scenes: [
      {
        id: "caribbean",
        title: "The Colonial Caribbean",
        intro:
          "A pirate fantasy, sure. But sail it and you’re moving through an empire being built.",
        image: "images/havana-cathedral.webp",
        hotspots: [
          {
            title: "The sea as highway",
            text:
              "The Caribbean is one enormous trade network of ports, cargo, and sea lanes. Maritime commerce is the real engine of the world you’re playing in.",
            x: 15,
            y: 73,
          },
          {
            title: "The colonial grid",
            text:
              "Havana, Kingston, Nassau — rival powers carving up the New World. You absorb the geography of empire just by navigating it.",
            x: 50,
            y: 37,
          },
          {
            title: "Underneath the adventure",
            text:
              "Naval power, slavery, and extraction sit beneath the swashbuckling. The world quietly teaches what early-modern Atlantic colonization actually looked like.",
            x: 78,
            y: 80,
          },
        ],
      },
    ],
  },
];
