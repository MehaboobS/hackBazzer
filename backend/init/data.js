const projects = [
    // 🧠 SOFTWARE PROJECTS
    {
      name: "Next.js",
      description: "The React Framework for Production",
      github: "https://github.com/vercel/next.js",
      demo: "https://nextjs.org",
      price: 599,
      category: "Software",
      image: "https://opengraph.githubassets.com/1/vercel/next.js"
    },
    {
      name: "React",
      description: "A JavaScript library for building user interfaces",
      github: "https://github.com/facebook/react",
      demo: "https://reactjs.org",
      price: 749,
      category: "Software",
      image: "https://opengraph.githubassets.com/1/facebook/react"
    },
    {
      name: "Vue.js",
      description: "The Progressive JavaScript Framework",
      github: "https://github.com/vuejs/vue",
      demo: "https://vuejs.org",
      price: 689,
      category: "Software",
      image: "https://opengraph.githubassets.com/1/vuejs/vue"
    },
    {
      name: "Svelte",
      description: "Cybernetically enhanced web apps",
      github: "https://github.com/sveltejs/svelte",
      demo: "https://svelte.dev",
      price: 560,
      category: "Software",
      image: "https://opengraph.githubassets.com/1/sveltejs/svelte"
    },
    {
      name: "Tailwind CSS",
      description: "A utility-first CSS framework",
      github: "https://github.com/tailwindlabs/tailwindcss",
      demo: "https://tailwindcss.com",
      price: 440,
      category: "Software",
      image: "https://opengraph.githubassets.com/1/tailwindlabs/tailwindcss"
    },
    {
      name: "Django",
      description: "The Web framework for perfectionists with deadlines",
      github: "https://github.com/django/django",
      demo: "https://www.djangoproject.com",
      price: 699,
      category: "Software",
      image: "https://opengraph.githubassets.com/1/django/django"
    },
    {
      name: "Flask",
      description: "A micro web framework written in Python",
      github: "https://github.com/pallets/flask",
      demo: "https://flask.palletsprojects.com",
      price: 530,
      category: "Software",
      image: "https://opengraph.githubassets.com/1/pallets/flask"
    },
    {
      name: "Bootstrap",
      description: "Popular framework for building responsive websites",
      github: "https://github.com/twbs/bootstrap",
      demo: "https://getbootstrap.com",
      price: 410,
      category: "Software",
      image: "https://opengraph.githubassets.com/1/twbs/bootstrap"
    },
  
    // ⚙️ HARDWARE PROJECTS
    {
      name: "Arduino",
      description: "Arduino IDE and core software",
      github: "https://github.com/arduino/Arduino",
      demo: "https://www.arduino.cc/en/software",
      price: 349,
      category: "Hardware",
      image: "https://opengraph.githubassets.com/1/arduino/Arduino"
    },
    {
      name: "ESPHome",
      description: "Control ESP devices with YAML configs",
      github: "https://github.com/esphome/esphome",
      demo: "https://esphome.io",
      price: 399,
      category: "Hardware",
      image: "https://opengraph.githubassets.com/1/esphome/esphome"
    },
    {
      name: "WLED",
      description: "Control WS2812B LED strips with ESP8266/ESP32",
      github: "https://github.com/Aircoookie/WLED",
      demo: "https://kno.wled.ge",
      price: 320,
      category: "Hardware",
      image: "https://opengraph.githubassets.com/1/Aircoookie/WLED"
    },
    {
      name: "Marlin Firmware",
      description: "Firmware for 3D printers based on the Arduino platform",
      github: "https://github.com/MarlinFirmware/Marlin",
      demo: "https://marlinfw.org",
      price: 699,
      category: "Hardware",
      image: "https://opengraph.githubassets.com/1/MarlinFirmware/Marlin"
    },
    {
      name: "KiCad",
      description: "A cross-platform electronics design automation suite",
      github: "https://github.com/KiCad/kicad-source-mirror",
      demo: "https://kicad.org",
      price: 899,
      category: "Hardware",
      image: "https://opengraph.githubassets.com/1/KiCad/kicad-source-mirror"
    },
    {
      name: "Tasmota",
      description: "Firmware for ESP8266 devices to be controlled via MQTT",
      github: "https://github.com/arendst/Tasmota",
      demo: "https://tasmota.github.io/docs",
      price: 370,
      category: "Hardware",
      image: "https://opengraph.githubassets.com/1/arendst/Tasmota"
    },
    {
      name: "Fritzing",
      description: "A tool to support designers and artists in creating electronics projects",
      github: "https://github.com/fritzing/fritzing-app",
      demo: "https://fritzing.org",
      price: 459,
      category: "Hardware",
      image: "https://opengraph.githubassets.com/1/fritzing/fritzing-app"
    },
    {
      name: "PlatformIO",
      description: "Open source ecosystem for IoT development",
      github: "https://github.com/platformio/platformio-core",
      demo: "https://platformio.org",
      price: 540,
      category: "Hardware",
      image: "https://opengraph.githubassets.com/1/platformio/platformio-core"
    },
  
    // 🎨 MISCELLANEOUS PROJECTS
    {
      name: "FreeCodeCamp",
      description: "Learn to code for free",
      github: "https://github.com/freeCodeCamp/freeCodeCamp",
      demo: "https://www.freecodecamp.org",
      price: 0,
      category: "Miscellaneous",
      image: "https://opengraph.githubassets.com/1/freeCodeCamp/freeCodeCamp"
    },
    {
      name: "Awesome Lists",
      description: "Curated lists of awesome topics",
      github: "https://github.com/sindresorhus/awesome",
      demo: "https://awesome.re",
      price: 0,
      category: "Miscellaneous",
      image: "https://opengraph.githubassets.com/1/sindresorhus/awesome"
    },
    {
      name: "Public APIs",
      description: "A collective list of free APIs for development",
      github: "https://github.com/public-apis/public-apis",
      demo: "https://public-apis.io",
      price: 0,
      category: "Miscellaneous",
      image: "https://opengraph.githubassets.com/1/public-apis/public-apis"
    },
    {
      name: "Developer Roadmap",
      description: "Roadmap to becoming a developer",
      github: "https://github.com/kamranahmedse/developer-roadmap",
      demo: "https://roadmap.sh",
      price: 0,
      category: "Miscellaneous",
      image: "https://opengraph.githubassets.com/1/kamranahmedse/developer-roadmap"
    },
    {
      name: "30 Seconds of Code",
      description: "Short JavaScript code snippets",
      github: "https://github.com/30-seconds/30-seconds-of-code",
      demo: "https://www.30secondsofcode.org",
      price: 0,
      category: "Miscellaneous",
      image: "https://opengraph.githubassets.com/1/30-seconds/30-seconds-of-code"
    },
    {
      name: "Carbon",
      description: "Create and share beautiful code images",
      github: "https://github.com/carbon-app/carbon",
      demo: "https://carbon.now.sh",
      price: 199,
      category: "Miscellaneous",
      image: "https://opengraph.githubassets.com/1/carbon-app/carbon"
    },
    {
      name: "DevDocs",
      description: "API documentation browser for devs",
      github: "https://github.com/freeCodeCamp/devdocs",
      demo: "https://devdocs.io",
      price: 0,
      category: "Miscellaneous",
      image: "https://opengraph.githubassets.com/1/freeCodeCamp/devdocs"
    },
    {
      name: "GitHub Readme Stats",
      description: "Dynamically generated GitHub stats",
      github: "https://github.com/anuraghazra/github-readme-stats",
      demo: "https://github.com/anuraghazra/github-readme-stats",
      price: 0,
      category: "Miscellaneous",
      image: "https://opengraph.githubassets.com/1/anuraghazra/github-readme-stats"
    }
  ];
  

  module.exports=projects