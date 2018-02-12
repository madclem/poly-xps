class Cache {
  constructor()
  {
    this._json = {};
    this._text = {};
  }

  addJson(json, id) 
  {
    this._json[id] = json;
  }

  getJson(id) {
    if (this._json[id]) 
    {
        return this._json[id];
    }
    else 
    {
        console.warn(id + " not found in Cache");
        return null;
    }
  }
}

export default Cache;