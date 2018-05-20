import data from './data';

export default class DataManager
{
    constructor()
    {
        this.data = [];

        this.debug = false;
        let colors = [
            [233, 119, 120],
            [137, 199, 182],
            [255, 213, 126],
            [173, 132, 199],
            [121, 152, 201],
        ]

        // setTimeout(()=>{
            // this.fillGrid(data.layout.about);
        // }, 6000)
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

                if(this.debug) console.log(data, indexData, layout.grid[indexData]);
                this.data[indexData]= d;

                id++;
            }
        }
        if(this.debug) console.log(this.data);
    }

    getIndexat(x, y)
    {
        return (x  + ((this.size.width) * y));
    }
    getDataAt(x, y)
	{
		let index = this.getIndexat(x, y);
        if(this.debug) console.log(index, this.data[index]);

		return this.data[index];
	}
}
