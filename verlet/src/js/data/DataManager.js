
const data = [
    {
        title: 'GIUGIU THE DOG',
        images: ['giugiu.jpg'],
        color: false,
        codeColor: [],
        colorGradient: [33/255, 104/255, 235/255],
        team: {
            art: [],
            dev: []
        },
        description: "Oh he decisively impression attachment friendship so if everything. Whose her enjoy chief new young. Felicity if ye required likewise so doubtful. On so attention necessary at by provision otherwise existence direction.",
        client: "Disney",
        producer: "Goodboy Digital",
        date: "2017",
        type: 'photo'
    },
    {
        title: 'DANGER MOUSE',
        images: ['dangermouse.jpg'],
        color: true,
        codeColor: [249/255, 211/255, 34/255],
        colorGradient: [33/255, 104/255, 235/255],
        team: {
            art: ['Julien suard', 'John Denton'],
            dev: ['Mat Groves', 'Li Wen']
        },
        description: "Oh he decisively impression attachment friendship so if everything. Whose her enjoy chief new young. Felicity if ye required likewise so doubtful. On so attention necessary at by provision otherwise existence direction.",
        client: "Disney",
        producer: "Goodboy Digital",
        date: "2017",
        type: 'photo'
    },
    {
        title: 'DDD-2018',
        images: ['ddd-2018.jpg'],
        color: false,
        codeColor: [],
        colorGradient: [212/255, 84/255, 84/255],
        team: {
            art: ['Julien suard'],
            dev: []
        },
        description: "Oh he decisively impression attachment friendship so if everything. Whose her enjoy chief new young. Felicity if ye required likewise so doubtful. On so attention necessary at by provision otherwise existence direction.",
        client: "Disney",
        producer: "Goodboy Digital",
        date: "2017",
        type: 'photo'
    },
    {
        title: 'DENNIS AND GNASHER',
        images: ['dennis.jpg'],
        color: false,
        codeColor: [],
        colorGradient: [232/255, 28/255, 43/255],
        team: {
            art: ['Julien suard', 'John Denton'],
            dev: ['Mat Groves', 'Li Wen']
        },
        description: "Oh he decisively impression attachment friendship so if everything. Whose her enjoy chief new young. Felicity if ye required likewise so doubtful. On so attention necessary at by provision otherwise existence direction.",
        client: "Disney",
        producer: "Goodboy Digital",
        date: "2017",
        type: 'photo'
    },
    {
        title: 'DREAMY',
        images: ['dreamy.jpg'],
        color: false,
        codeColor: [],
        colorGradient: [33/255, 104/255, 235/255],
        team: {
            art: ['Julien suard', 'John Denton'],
            dev: ['Mat Groves', 'Li Wen']
        },
        description: "Oh he decisively impression attachment friendship so if everything. Whose her enjoy chief new young. Felicity if ye required likewise so doubtful. On so attention necessary at by provision otherwise existence direction.",
        client: "Disney",
        producer: "Goodboy Digital",
        date: "2017",
        type: 'photo'
    },
    {
        title: 'DANGER MOUSE',
        images: [
            'dm_idle_01.png',
            'dm_idle_02.png',
            'dm_idle_03.png',
            'dm_idle_04.png',
            'dm_idle_05.png',
            'dm_idle_06.png',
            'dm_idle_07.png',
            'dm_idle_08.png',
            'dm_idle_09.png',
            'dm_idle_10.png',
            'dm_idle_11.png'
        ],
        color: false,
        codeColor: [249/255, 211/255, 34/255],
        colorGradient: [33/255, 104/255, 235/255],
        team: {
            art: ['Julien suard', 'John Denton'],
            dev: ['Mat Groves', 'Li Wen']
        },
        description: "Oh he decisively impression attachment friendship so if everything. Whose her enjoy chief new young. Felicity if ye required likewise so doubtful. On so attention necessary at by provision otherwise existence direction.",
        client: "Disney",
        producer: "Goodboy Digital",
        date: "2017",
        type: 'photo'
    },
    {
        title: 'NIGHT EYE',
        images: ['night-eye.jpg'],
        color: false,
        codeColor: [],
        colorGradient: [20/255, 48/255, 82/255],
        team: {
            art: ['Julien suard', 'John Denton'],
            dev: ['Mat Groves', 'Li Wen']
        },
        description: "Oh he decisively impression attachment friendship so if everything. Whose her enjoy chief new young. Felicity if ye required likewise so doubtful. On so attention necessary at by provision otherwise existence direction.",
        client: "Disney",
        producer: "Goodboy Digital",
        date: "2017",
        type: 'photo'
    },
    {
        title: 'SLEIGHER 3000',
        images: ['sleigher-3000.jpg'],
        color: false,
        codeColor: [],
        colorGradient: [33/255, 104/255, 235/255],
        team: {
            art: ['Julien suard', 'John Denton'],
            dev: ['Mat Groves', 'Li Wen']
        },
        description: "Oh he decisively impression attachment friendship so if everything. Whose her enjoy chief new young. Felicity if ye required likewise so doubtful. On so attention necessary at by provision otherwise existence direction.",
        client: "Disney",
        producer: "Goodboy Digital",
        date: "2017",
        type: 'photo'
    },
    {
        title: 'STARWARS FIGHTER',
        images: ['starwars.jpg'],
        color: false,
        codeColor: [],
        colorGradient: [33/255, 104/255, 235/255],
        team: {
            art: ['Julien suard', 'John Denton'],
            dev: ['Mat Groves', 'Li Wen']
        },
        description: "Oh he decisively impression attachment friendship so if everything. Whose her enjoy chief new young. Felicity if ye required likewise so doubtful. On so attention necessary at by provision otherwise existence direction.",
        client: "Disney",
        producer: "Goodboy Digital",
        date: "2017",
        type: 'photo'
    }
]

export default class DataManager
{
    constructor()
    {
        this.data = [];

        let colors = [
            [233, 119, 120],
            [137, 199, 182],
            [255, 213, 126],
            [173, 132, 199],
            [121, 152, 201],
        ]

        this.size = {
            width: 3,
            height: 3,
        }
        let id = 0;
        for (var i = 0; i <= this.size.width; i++) {
            for (var j = 0; j <= this.size.height; j++) {
        // for (var i = 0; i < data.length; i++) {
            // data[i]
                let idC = id;
            // let d = data[i]
                let d = data[idC % data.length]
                d.id= id;

                this.data.push(d);

                id++;
        // }
            }
        }
    }

    getDataAt(x, y)
	{
		let index = (x  + (this.size.width * y));

		return this.data[index];
	}
}
