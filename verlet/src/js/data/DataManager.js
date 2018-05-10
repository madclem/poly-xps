
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
                let idC = i + j;
                let c = colors[idC % colors.length];
                let d = {
                    id,
                    color: [c[0]/255, c[1]/255, c[2]/255],
                    title: 'THIS IS A TEST',
                    image: null
                }

                if(Math.random() > .6)
                {
                    d.type = 'link';
                    d.url = 'http://google.co.uk';
                }
                else
                {
                    d.type = 'photo';
                    d.url = 'http://google.co.uk';
                }
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
