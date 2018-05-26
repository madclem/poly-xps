export default
{
    layout: {
        main: {
            size: [7, 7],
            grid: [
                "dreamy2",   "icon_boss",   "night_eyes",  "icon_catch", "cooking", "icon_deer", "dennis_and_gnasher",
                "icon_dog",  "starwars_fighter2",    "icon_glasses", "lego", "icon_mom",   "icosphere",   "handsup",
                "particles_stream",    "icon_julien",        "icosphere", "handsup", "ddd", "icon_twitter", "dreamy",
                "icon_contact",   "gumble",  "icon_twitter",   "sheriff_callie",    "icon_contact",   "trunk_santa",   "icon_github",
                "handsup",   "icosphere",   "plane_to_sphere",   "icon_address", "sleigher3000", "night_eyes","starwars_fighter1",
                "icon_boss", "starwars_fighter3",   "icon_catch",   "starwars_rebels",   "icon_deer",    "dennis_and_gnasher",   "icon_dog",
                "technosquid",   "icon_mom",    "starwars_arcade",   "icon_movie",   "danger_mouse",    "icon_rugby",    "dreamy2",
            ]
        },

        pro: {
            size: [4, 5],
            grid: [
                "cooking", "starwars_fighter2", "lego", "gumble",
                "sheriff_callie", "handsup", "sleigher3000", "lego_walker",
                "starwars_rebels", "dennis_and_gnasher", "danger_mouse", "starwars_fighter1",
                "spotbots", "starwars_fighter3", "starwars_arcade", "worst_witch",
                "music_maker", "dennis_and_gnasher", "handsup", "danger_mouse",
            ]
        },

        lab: {
            size: [4, 4],
            grid: [
                "ddd", "night_eyes", "icosphere", "dreamy",
                "trunk_santa", "plane_to_sphere", "sleigher3000", "technosquid",
                "trump", "dreamy2", "line_animation", "confettis",
                "night_eyes", "ddd", "trump", "particles_stream"
            ]
        },
        about: {
            size: [3, 4],
            grid: [
                "icon_boss", "icon_catch", "icon_deer",
                "icon_dog", "icon_glasses", "icon_mom",
                "icon_movie", "icon_twitter", "icon_julien",
                "icon_address", "icon_contact", "icon_github"
            ]
        }
    },

    data: {
        music_maker: {
            id: 'music_maker',
            title: 'Music Maker 🎶',
            images: ['paw_patrol_music_maker.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [0,0,0],
            team: {
                art: ['Tom Jennings'],
                dev: []
            },
            description: "We created three music toys for Nickelodeon and their leading pre-school brands. In addition to that we made a 'grey box' version so that Nick's editorial teams could easily produce new versions for other brands with a minimum of technical experience required. <br><br>TECH: WebGL, Pixi.js, Sono.js",
            client: "Nickelodeon",
            producer: "GOODBOY DIGITAL",
            date: "2017",
            link: "http://www.nickjr.co.uk/paw-patrol/games/paw-patrol-music-maker/",
            type: 'photo'
        },
        worst_witch: {
            id: 'worst_witch',
            title: 'The Worst Witch',
            images: ['worst-witch.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [0,0,0],
            team: {
                art: ['Many'],
                dev: ['Li Wen (lead)', 'Jordan Machado']
            },
            description: "Read the complete case study <a href='https://www.goodboydigital.com/case-study/the-worst-witch-magic-adventure' target='_blank'> here (by Goodboy) </a> :)  <br><br>TECH: 3D World, Pixi.js, WebGL",
            client: "CBBC",
            producer: "GOODBOY DIGITAL",
            date: "2017",
            link: "https://www.bbc.co.uk/cbbc/games/the-worst-witch-magic-adventure-game",
            type: 'photo'
        },
        spotbots: {
            id: 'spotbots',
            title: 'Spotbots',
            images: ['spotbots_switched_on.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [0,0,0],
            team: {
                art: ['Toby Sperring'],
                dev: []
            },
            description: "Let's get switched on! We developed 3 mini games for the pre-school brand Spotbots. <br><br>TECHS: Accessibility, Hexagonal Grid, HTML5, WebGL",
            client: "CBEEBIES",
            producer: "GOODBOY DIGITAL",
            date: "2016",
            link: "https://www.bbc.co.uk/cbeebies/games/spot-bots-switched-on",
            type: 'photo'
        },
        lego_walker: {
            id: 'lego_walker',
            title: 'Out of Step',
            images: ['lego_out_step.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [0,0,0],
            team: {
                art: ['John Denton'],
                dev: ['Mat Groves (lead)']
            },

            description: "Read the complete case study <a href='https://www.goodboydigital.com/case-study/out-of-step' target='_blank'> here (by Goodboy) </a> :)  <br><br>TECH: Pixi.js, WebGL",
            client: "LEGO",
            producer: "GOODBOY DIGITAL",
            date: "2017",
            link: "https://www.lego.com/assets/FranchiseSites/Portal/Out-Of-Step/v2/index.html",
            type: 'photo'
        },
        ddd: {
            id: 'ddd',
            title: 'DDD 2018',
            images: ['ddd-2018.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [194/255,82/255, 56/255],
            team: {
                art: ['<a href="http://suarjulien.com">Julien suard</a>'],
                dev: []
            },
            description: "Experiment for Design Digital Days 2018: Monolithic. A great opportunity to explore reflection's methods and water effect! <br><br>TECH: 3D, Poly.js, WebGL",
            client: "DDD",
            producer: "Experiment",
            date: "2018",
            link: "https://madclem.github.io/ddd-2018/",
            type: 'photo'
        },
        particles_stream: {
            id: 'particles_stream',
            title: 'Particles stream',
            images: ['particles_stream.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [0,0,0],
            team: {
                art: [],
                dev: []
            },
            description: "First particles using FBO \"ping pong\" and multitextures. Based on Wen's particles <a href='http://blog.bongiovi.tw/webgl-gpu-particle-stream/' target='_blank'>blog post</a> <br><br>TECH: Poly.js, WebGL",
            client: "",
            producer: "Experiment",
            date: "2018",
            link: "http://work.goodboydigital.com/experiments/clem/particles-stream/",
            type: 'photo'
        },
        handsup: {
            id: 'handsup',
            title: 'HANDS\'UP',
            images: [
                'handsup_001.jpg',
                'handsup_002.jpg',
                'handsup_003.jpg',
                'handsup_004.jpg',
                'handsup_005.jpg',
                'handsup_006.jpg',
                'handsup_007.jpg',
                'handsup_008.jpg',
                'handsup_009.jpg',
                'handsup_010.jpg',
                'handsup_011.jpg',
                'handsup_012.jpg',
                'handsup_013.jpg',
                'handsup_014.jpg',
                'handsup_015.jpg',
                'handsup_016.jpg',
                'handsup_017.jpg',
                'handsup_018.jpg',
                'handsup_019.jpg',
                'handsup_020.jpg',
                'handsup_021.jpg',
                'handsup_022.jpg',
                'handsup_023.jpg',
                'handsup_024.jpg',
                'handsup_025.jpg',
                'handsup_026.jpg',
                'handsup_027.jpg',
                'handsup_028.jpg',
                'handsup_029.jpg',
                'handsup_030.jpg',
                'handsup_031.jpg',
                'handsup_032.jpg',
                'handsup_033.jpg',
                'handsup_034.jpg',
                'handsup_035.jpg',
            ],
            color: false,
            codeColor: [],
            colorGradient: [58/255, 107/255,173/255],
            team: {
                art: ['John Denton'],
                dev: ['Mat Groves']
            },
            description: "\"Liberty Global Appathon\" multiplayer game that we had the chance to develop for the Metrological TV boxes. \"Hands down\" the funniest game we ever did at Goodboy! <br><br>TECH: Websocket, Raspberry PI, Node.js, Pixi.js, WebGL.",
            client: "Metrological",
            producer: "Goodboy Digital",
            date: "2017",
            link: "",
            type: 'photo'
        },

        technosquid: {
            id: 'technosquid',
            title: 'TECHNOSQUID',
            images: [
                'img001.jpg',
                'img002.jpg',
                'img003.jpg',
                'img004.jpg',
                'img005.jpg',
                'img006.jpg',
                'img007.jpg',
                'img008.jpg',
                'img009.jpg',
                'img010.jpg',
                'img011.jpg',
                'img012.jpg',
                'img013.jpg',
                'img014.jpg',
            ],
            color: false,
            codeColor: [],
            colorGradient: [0,0,0],
            team: {
                art: [],
                dev: []
            },
            description: "Musical Experiment (probably broken since the latest Chrome updates) <br><br>TECH: HTML5, WebGL",
            client: "",
            producer: "EXPERIMENT",
            date: "2017",
            link: "http://work.goodboydigital.com/experiments/clem/technosquid/",
            type: 'photo'
        },
        night_eyes: {
            id: 'night_eyes',
            title: 'NIGHT EYE',
            images: ['night-eye.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['Bert'],
                dev: ['<a href="" target="_blank">Wen</a>']
            },
            description: "Opening of the Christmas Experiment (2016 edition) with my friend Wen! Explore the night forest, manipulate the elements and frolic with the light creatures.  Check out our <a href=\"http://blog.bongiovi.tw/case-study-night-eye/\">VR and reflection (Wen)</a> and <a href=\"https://medium.com/@mad_clem/night-eyes-case-study-19eb54068379\">line drawing and animation (me)</a> case studies. <br><br>TECH: 3D, VR, Alfrid.js (Wen's WebGL tool).",
            client: "",
            producer: "CHRISTMAS EXPERIMENT",
            date: "2016",
            link: "http://work.goodboydigital.com/night-eyes/",
            type: 'photo'
        },
        icosphere: {
            id: 'icosphere',
            title: 'ICOSPHERE',
            images: [
                'blob_001.jpg',
                'blob_002.jpg',
                'blob_003.jpg',
                'blob_004.jpg',
                'blob_005.jpg',
                'blob_006.jpg',
                'blob_007.jpg',
                'blob_008.jpg',
                'blob_009.jpg',
                'blob_010.jpg',
                'blob_011.jpg',
                'blob_012.jpg',
                'blob_013.jpg',
                'blob_014.jpg',
                'blob_015.jpg',
                'blob_016.jpg',
                'blob_017.jpg',
                'blob_018.jpg',
                'blob_019.jpg',
                'blob_020.jpg',
                'blob_021.jpg',
                'blob_022.jpg',
                'blob_023.jpg',
                'blob_024.jpg',
                'blob_025.jpg',
                'blob_026.jpg',
                'blob_027.jpg',
                'blob_028.jpg',
                'blob_029.jpg',
                'blob_030.jpg',
                'blob_031.jpg',
            ],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "Icosphere geometry, a nice different way to draw a sphere! (see <a href=\"http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html\"> article</a>). <br><br>TECH: WebGL",
            client: "",
            producer: "EXPERIMENT",
            date: "2017",
            link: "http://work.goodboydigital.com/experiments/clem/icosphere/",
            type: 'photo'
        },
        plane_to_sphere: {
            id: 'plane_to_sphere',
            title: 'PLANE TO SPHERE',
            images: ['plane_to_sphere.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['<a href="http://suarjulien.com">Julien suard</a>', 'John Denton'],
                dev: ['Mat Groves', 'Li Wen']
            },
            description: "Transform a plane geometry into a sphere geometry. An idea from Wen to teach me WebGL basics. <br><br>TECH: WebGL",
            client: "",
            producer: "EXPERIMENT",
            date: "2017",
            link: "http://work.goodboydigital.com/codevember/clem/02/",
            type: 'photo'
        },
        starwars_arcade: {
            id: 'starwars_arcade',
            title: 'STARWARS ARCADE',
            images: ['arcade.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['many people'],
                dev: ['many people']
            },
            description: "Read the complete case study <a href='https://www.goodboydigital.com/case-study/star-wars-arcade' target='_blank'> here (by Goodboy) </a> :)  <br><br>TECH: Pixi.js, WebGL",
            client: "Disney/lucas",
            producer: "Goodboy Digital",
            date: "2017",
            link: "https://www.goodboydigital.com/case-study/star-wars-arcade",
            type: 'photo'
        },
        cooking: {
            id: 'cooking',
            title: 'DISNEY CAFE 🍴',
            images: ['cooking.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [91/255, 133/255, 88/255],
            team: {
                art: ['Tom Jennings'],
                dev: ['Tom Slezakovski']
            },


            description: "Vanilla Panna Cotta, Flatbread with Hummus and Figs, Diva's Calzone... You name it you got it! (do not try this at home 🔪) <br><br>TECH: Pixi.js, WebGL, p2.js, serious cooking skills",
            client: "Disney",
            producer: "Goodboy Digital",
            date: "2016",
            link: "http://work.goodboydigital.com/star-cafe/",
            type: 'photo'
        },
        trunk_santa: {
            id: 'trunk_santa',
            title: 'Trunk santa',
            images: [
                'trunk_trunk001.jpg',
                'trunk_trunk002.jpg',
                'trunk_trunk003.jpg',
                'trunk_trunk004.jpg',
                'trunk_trunk005.jpg',
                'trunk_trunk006.jpg',
                'trunk_trunk007.jpg',
                'trunk_trunk008.jpg',
                'trunk_trunk009.jpg',
                'trunk_trunk010.jpg',
                'trunk_trunk011.jpg',
                'trunk_trunk012.jpg',
                'trunk_trunk013.jpg',
                'trunk_trunk014.jpg',
                'trunk_trunk015.jpg',
                'trunk_trunk016.jpg',
                'trunk_trunk017.jpg',
                'trunk_trunk018.jpg',
                'trunk_trunk019.jpg',
                'trunk_trunk020.jpg',
                'trunk_trunk021.jpg',
                'trunk_trunk022.jpg',
                'trunk_trunk023.jpg',
            ],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['<a href="http://suarjulien.com">Julien suard</a>'],
                dev: []
            },
            description: "Christmas experiment, 2015 edition! Tight collaboration with my friend Julien Suard! Chop some wood and get that fire going! 🔥 <br><br>TECH: 2D slicing, Pixi.js, WebGL, p2.js",
            client: "",
            producer: "CHRISTMAS EXPERIMENT",
            date: "2015",
            link: "http://work.goodboydigital.com/trunks-santa/",
            type: 'photo'
        },


        sleigher3000: {
            id: 'sleigher3000',
            title: 'sleigher3000',
            images: ['sleigher3000.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['John Denton'],
                dev: ['Mat Groves']
            },
            description: "Christmas Experiment, 2017 edition! Starfox meets Mario Kart! 🌟 TECH: Pixi.js, 3D, WebGL",
            client: "",
            producer: "CHRISTMAS EXPERIMENT",
            date: "2017",
            link: "http://work.goodboydigital.com/sleigher-3000/",
            type: 'photo'
        },

        danger_mouse: {
            id: 'danger_mouse',
            title: 'DANGER MOUSE',
            images: ['dangermouse.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['Many people'],
                dev: ['Many people']
            },
            description: "Read the complete case study <a href='https://www.goodboydigital.com/case-study/danger-mouse-game' target='_blank'> here (by Goodboy) </a> :)  <br><br>TECH: Pixi.js, WebGL",
            client: "CBBC",
            producer: "Goodboy Digital",
            date: "2016-18",
            link: "https://www.bbc.co.uk/cbbc/games/danger-mouse-game",
            type: 'photo'
        },

        dennis_and_gnasher: {
            id: 'dennis_and_gnasher',
            title: 'DENNIS AND GNASHER',
            images: ['denis.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['<a href="http://suarjulien.com">Julien suard</a>', 'John Denton', 'Kim Le'],
                dev: ['Mat Groves']
            },
            description: "Leg It through Beano town, slime your enemies, play as your favourite characters from the Dennis & Gnasher, Unleashed TV show and run, jump, slide and grind your way to the finish line. Download the app on <a href=\"https://itunes.apple.com/gb/app/cbbc-dennis-gnasher/id1375959196?mt=8\" target=\"_blank\">iOS</a> or <a href=\"https://play.google.com/store/apps/details?id=uk.co.bbc.cbbc.dennisandgnasher.legit\" target=\"_blank\">Android</a> (Web version coming soon!) <br><br>TECH: HTML5, 3D, App, Pixi.js, WebGL",
            client: "CBBC",
            producer: "Goodboy Digital",
            date: "2018",
            link: "",
            type: 'photo'
        },

        dreamy: {
            id: 'dreamy',
            title: 'DREAMY',
            images: ['dreamy1.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['JULIEN SUAVE', 'THOMAS 2 CHICOS'],
                dev: ['GRALEX', 'CHENEBOLOSS']
            },
            description: "Dreamy is a game on tablet aiming to enchant the kid's routine at the hospital. Immersed into a super hero universe, the player can choose and play with his super power to fight the battle against the \"Dark Force\". See full description <a href=\"https://suardjulien.com/9/\" target=\"_blank\">here</a>. <br><br>TECH: Objective-C, iBeacon, Connected Objects",
            client: "",
            producer: "GOBELINS",
            date: "2014",
            link: "",
            type: 'photo'
        },
        dreamy2: {
            id: 'dreamy2',
            title: 'DREAMY',
            images: ['dreamy2.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['JULIEN SUAVE', 'THOMAS 2 CHICOS'],
                dev: ['GRALEX', 'CHENEBOLOSS']
            },
            description: "Dreamy is a game on tablet aiming to enchant the kid's routine at the hospital. Immersed into a super hero universe, the player can choose and play with his super power to fight the battle against the \"Dark Force\". See full description <a href=\"https://suardjulien.com/9/\" target=\"_blank\">here</a>. <br><br>TECH: Objective-C, iBeacon, Connected Objects",
            client: "",
            producer: "Gobelins",
            date: "2014",
            link: "https://suardjulien.com/9/",
            type: 'photo'
        },
        starwars_fighter1: {
            id: 'starwars_fighter1',
            title: 'STARWARS FIGHTER',
            images: ['fighter1.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['<a href="http://suarjulien.com">Julien suard</a>'],
                dev: []
            },
            description: "\"Shoot'em up\" game developped for the release of the Starwars Awakens in the cinemas. Welcome to the resistance, and the May the force be with you. Read more about the art <a href=\"https://suardjulien.com/3/\" target=\"_blank\">here</a>  <br><br>TECH: Pixi.js, WebGL <br><br> U: goodboy    P: disney",
            client: "Disney/lucas",
            producer: "Goodboy Digital",
            date: "2016",
            link: "",
            type: 'photo'
        },
        starwars_fighter2: {
            id: 'starwars_fighter2',
            title: 'STARWARS FIGHTER',
            images: ['fighter2.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['<a href="http://suarjulien.com">Julien suard</a>'],
                dev: []
            },
            description: "\"Shoot'em up\" game developped for the release of the Starwars Awakens in the cinemas. Welcome to the resistance, and the May the force be with you. Read more about the art <a href=\"https://suardjulien.com/3/\" target=\"_blank\">here</a>  <br><br>TECH: Pixi.js, WebGL <br><br> U: goodboy    P: disney",
            client: "Disney/Lucas",
            producer: "Goodboy Digital",
            date: "2016",
            link: "",
            type: 'photo'
        },
        starwars_fighter3: {
            id: 'starwars_fighter3',
            title: 'STARWARS FIGHTER',
            images: ['fighter3.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['<a href="http://suarjulien.com">Julien suard</a>'],
                dev: []
            },
            description: "\"Shoot'em up\" game developped for the release of the Starwars Awakens in the cinemas. Welcome to the resistance, and the May the force be with you. Read more about the art <a href=\"https://suardjulien.com/3/\" target=\"_blank\">here</a>  <br><br>TECH: Pixi.js, WebGL <br><br> U: goodboy    P: disney",
            client: "Disney/Lucas",
            producer: "Goodboy Digital",
            date: "2016",
            link: "",
            type: 'photo'
        },
        gumble: {
            id: 'gumble',
            title: 'ORIGINS OF DARWIN',
            images: ['gumble.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['<a href="http://suarjulien.com">Julien suard</a>'],
                dev: []
            },
            description: "Silly fish generator for Cartoon Network.",
            client: "CN",
            producer: "Goodboy Digital",
            date: "2016",
            link: "",
            type: 'photo'
        },

        lego: {
            id: 'lego',
            title: 'STACKY STACK',
            images: ['lego.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['John Denton'],
                dev: ['Mat Groves']
            },
            description: "As simple as Legos can be.",
            client: "LEGO",
            producer: "Goodboy Digital",
            date: "2017",
            link: "https://www.lego.com/assets/FranchiseSites/Portal/Stacky-Stack/v3/index.html",
            type: 'photo'
        },

        sheriff_callie: {
            id: 'sheriff_callie',
            title: 'SHERIFF CALLIE',
            images: ['sherrifcali.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [197/255, 179/255, 80/255],
            team: {
                art: ['Matt Allan'],
                dev: ['TOM Slezakovski', 'Alvin Ourrad']
            },
            description: "Howdie'! <br><br>First game I had the chance to work on at Goodboy. This will always have a special taste <3",
            client: "Disney",
            producer: "Goodboy Digital",
            date: "2015",
            link: "http://work.goodboydigital.com/sheriff-callie/",
            type: 'photo'
        },
        line_animation: {
            id: 'line_animation',
            title: 'LINE ANIMATION',
            images: ['line_animation.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "Line experiment, using different motions to move them around.  <br><br>TECH: WebGL, 3D",
            client: "",
            producer: "Experiment",
            date: "2017",
            link: "http://work.goodboydigital.com/codevember/clem/04/",
            type: 'photo'
        },
        confettis: {
            id: 'confettis',
            title: 'INSTANCING IMPLEMENTATION',
            images: ['confettis.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "Instancing implementation with Poly.js (WebGL tool). <br><br>TECH: Poly.js, WebGL",
            client: "",
            producer: "Experiment",
            date: "2017",
            link: "http://work.goodboydigital.com/experiments/clem/confettis/",
            type: 'photo'
        },
        trump: {
            id: 'trump',
            title: 'ROGUE NEWS',
            images: ['rogue_news.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['<a href="http://suarjulien.com">Julien suard</a>'],
                dev: []
            },
            description: "Draw what you you feel like and make it appear in a D.Trump gif! A good opportunity to create a drawing tool using low level WebGL (lines) and homographic 2D quad (creates a 3D perspective feel from four 2D points). <br><br>TECH: Pixi.js, WebGL",
            client: "",
            producer: "Experiment",
            date: "2017",
            link: "http://rogue-news.com/",
            type: 'photo'
        },
        starwars_rebels: {
            id: 'starwars_rebels',
            title: 'STARWARS TEAM TACTICS',
            images: ['starwars_rebels.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [205/255, 175/255, 57/255],
            team: {
                art: ['John Denton', '<a href="http://tomjennings.me">tom portfolio</a>'],
                dev: ['Mat Groves (lead)']
            },
            description: "Read the complete case study <a href='https://www.goodboydigital.com/case-study/star-wars-arcade' target='_blank'> here (by Goodboy) </a> :)  <br><br>TECH: Pixi.js, WebGL",
            client: "DISNEY/LUCAS",
            producer: "Goodboy Digital",
            date: "2016",
            link: "",
            type: 'photo'
        },
        icon_boss: {
            id: 'icon_boss',
            icon: true,
            images_hidden: ['favourite_boss_revealed.jpg'],
            title: 'MY FAVOURITE BOSS',
            images: ['icon_boss.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "",
            date: "",
            link: "",
            type: 'photo'
        },
        icon_catch: {
            id: 'icon_catch',
            icon: true,
            images_hidden: ['wrestler_revealed.jpg'],
            title: 'FOOSBALL CHAMPION',
            images: ['icon_catch.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "Goodboy player of the year (2017-18) 🏆 <br> Tower of Soul finisher (2017) <br> Father of \"THE FISH\" technique. (2017-FOREVER)",
            client: "",
            producer: "EL MACHO",
            date: "",
            link: "",
            type: 'photo'
        },
        icon_deer: {
            id: 'icon_deer',
            icon: true,
            images_hidden: ['king_of_elks_revealed.jpg'],
            title: 'King behind the wall',
            images: ['icon_deer.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "NORWAY",
            date: "2018",
            link: "",
            type: 'photo'
        },
        icon_dog: {
            id: 'icon_dog',
            icon: true,
            images_hidden: ['giugiu.jpg'],
            title: 'MY ONE TRUE LOVE',
            images: ['icon_dog.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "our family dog",
            date: "",
            link: "",
            type: 'photo'
        },
        icon_glasses: {
            id: 'icon_glasses',
            icon: true,
            images_hidden: ['shades_revealed.jpg'],
            title: 'veni vidi vici',
            images: ['icon_glasses.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: ['JOHN DENTON'],
                dev: ['MAT GROVES']
            },
            description: "\"Liberty Global Appathon\" multiplayer game that we had the chance to develop for the Metrological TV boxes. \"Hands down\" the funniest game we ever did at Goodboy! 🎉 <br><br>TECH: Websocket, Raspberry PI, Node.js, Pixi.js, WebGL.",
            client: "",
            producer: "APPATHON LIBERTY GLOBAL",
            date: "",
            link: "### add link to the game here",
            type: 'photo'
        },
        icon_mom: {
            id: 'icon_mom',
            icon: true,
            images_hidden: ['maman.jpg'],
            title: 'MY FAVOURITE MOM',
            images: ['icon_mom.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [207/255, 175/255, 63/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "",
            date: "",
            link: "",
            type: 'photo'
        },
        icon_movie: {
            id: 'icon_movie',
            icon: true,
            images_hidden: ['favourite_movie_revealed.jpg'],
            title: 'J\'aime ce film.',
            images: ['icon_movie.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "\"Non mais oh ! Comment tu parles de ton père ! T'as pas honte ? Qui c'est qui t'a nourri ?! Jamais moi je parlerais comme ça de mon père, jamais ! Moi mon père il était charron. Et je peux te dire que ça filait doux ! Ça, la mère de la Bath elle mouffetait pas ! Et les gamins pareil !\" <br><br>OSS 117 ",
            client: "",
            producer: "",
            date: "",
            link: "",
            type: 'photo'
        },
        icon_contact: {
            id: 'icon_contact',
            icon: 'true',
            images_hidden: ['email_revealed.jpg'],
            title: 'Pop me an email',
            images: ['icon_contact.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "All these emails while I was only truly waiting for yours.",
            client: "",
            producer: "organisation freak",
            date: "",
            link: "",
            email: "clem.chenebault@gmail.com",
            type: 'photo'
        },
        icon_julien: {
            id: 'icon_julien',
            icon: 'true',
            images_hidden: ['email_revealed.jpg'],
            title: 'My first [designer] crush',
            images: ['icon_pen.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "",
            date: "",
            link: "http://suardjulien.com/",
            type: 'photo'
        },
        icon_rugby: {
            id: 'icon_rugby',
            icon: true,
            images_hidden: ['starwars_rebels.jpg'],
            title: 'RUGBY',
            images: ['icon_rugby.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "",
            date: "",
            link: "",
            type: 'photo'
        },
        icon_saxo: {
            id: 'icon_saxo',
            icon: true,
            images_hidden: ['starwars_rebels.jpg'],
            title: 'SEXY SAXO',
            images: ['icon_saxo.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "",
            date: "",
            link: "",
            type: 'photo'
        },
        icon_address: {
            id: 'icon_address',
            icon: true,
            images_hidden: ['address_revealed.jpg'],
            title: 'LONDON BASED',
            images: ['icon_saxo.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "E14 8JY",
            date: "",
            link: "",
            type: 'photo'
        },
        icon_twitter: {
            id: 'icon_twitter',
            icon: true,
            images_hidden: ['starwars_rebels.jpg'],
            title: '@mad_clem',
            images: ['icon_rugby.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "TWITTER",
            date: "",
            link: "https://twitter.com/mad_clem",
            type: 'photo'
        },
        icon_boss2: {
            id: 'icon_boss2',
            icon: true,
            images_hidden: ['starwars_rebels.jpg'],
            title: 'BOSS 2',
            images: ['icon_rugby.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "",
            date: "",
            link: "",
            type: 'photo'
        },
        icon_github: {
            id: 'icon_github',
            icon: true,
            images_hidden: ['starwars_rebels.jpg'],
            title: 'GITHUB',
            images: ['icon_rugby.jpg'],
            color: false,
            codeColor: [],
            colorGradient: [20/255, 48/255, 82/255],
            team: {
                art: [],
                dev: []
            },
            description: "",
            client: "",
            producer: "",
            date: "",
            link: "https://github.com/madclem",
            type: 'photo'
        }
    }
}
