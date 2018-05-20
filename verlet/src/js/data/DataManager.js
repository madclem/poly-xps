import data from './data';

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

        this.fillGrid(data.layout.main);
    }

    fillGrid(layout)
    {
        this.data.length = 0;

        this.size = {
            width: layout.size[0],
            height: layout.size[1],
        }

        // let data = layout.grid;
        let id = 0;
        for (var x = 0; x < this.size.width; x++) {
            for (var y = 0; y < this.size.height; y++) {
                let indexData = this.getIndexat(x, y);
                let d = data.data[layout.grid[indexData]];

                this.data[indexData]= d;

                id++;
            }
        }
    }

    getIndexat(x, y)
    {
        return (x  + ((this.size.width) * y));
    }
    getDataAt(x, y)
	{
		let index = this.getIndexat(x, y);

		return this.data[index];
	}
}
