
const data = [
    {
        title: 'MY DOG.',
        image: 'giugiu.jpg',
        type: 'photo'
    },
    {
        title: 'DANGER MOUSE',
        image: 'dangermouse.jpg',
        type: 'photo'
    },
    {
        title: 'DDD-2018',
        image: 'ddd-2018.jpg',
        type: 'photo'
    },
    {
        title: 'DENNIS AND GNASHER',
        image: 'dennis.jpg',
        type: 'photo'
    },
    {
        title: 'DREAMY',
        image: 'dreamy.jpg',
        type: 'photo'
    },
    {
        title: 'HEY DUGGEE',
        image: 'hey-duggee.jpg',
        type: 'photo'
    },
    {
        title: 'NIGHT EYE',
        image: 'night-eye.jpg',
        type: 'photo'
    },
    {
        title: 'SLEIGHER 3000',
        image: 'sleigher-3000.jpg',
        type: 'photo'
    },
    {
        title: 'STARWARS FIGHTER',
        image: 'starwars.jpg',
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

        let types = [
            'photo', 'link'
        ]

        this.size = {
            width: 4,
            height: 4,
        }
        let id = 0;
        for (var i = 0; i <= this.size.width; i++) {
            for (var j = 0; j <= this.size.height; j++) {
                let idC = id;
                let d = data[idC % data.length]
                d.id= id;

                this.data.push(d);

                id++;
            }
        }
    }

    getDataAt(x, y)
	{
		let index = x + (5) * y;
		return this.data[index];
	}
}
