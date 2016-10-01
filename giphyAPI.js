const HOST = "http://api.giphy.com/";
const API_KEY = "dc6zaTOxFJmzC";

class GiphyAPI {

    constructor(options = {}){

        //Use api key or default to the public key
        if(options.api_key){
            this.api_key = options.api_key;
        }else{
            this.api_key = API_KEY;
        }

    }

    _requestTrending(callback){

        //http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC
        fetch(HOST + "v1/gifs/trending?api_key=" + API_KEY,
        {

        method: "GET",
            })
            .then((response) => response.json()).catch((error) => {
                console.warn(error);
            })
            .then((responseText) => {
                callback(responseText);
            })
            .catch((error) => {
                console.warn(error);
            });

    }

    _requestSearch(phrase,callback){

        phrase.split(' ').join('+');
        //http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC   
        fetch(HOST + "v1/gifs/search?q= " + phrase + "&api_key=" + API_KEY,
        {

        method: "GET",
            })
            .then((response) => response.json()).catch((error) => {
                console.warn(error);
            })
            .then((responseText) => {
                callback(responseText);
            })
            .catch((error) => {
                console.warn(error);
            });

    }

    getTrending(callback){

        this._requestTrending((response) => {

            if(response && response.data){
                callback(response.data);
            }else{
                callback([])
            }
            

        });

    }

    getSearch(phrase, callback){

        this._requestSearch(phrase, (response) => {

            if(response && response.data){
                callback(response.data);
            }else{
                callback([])
            }

        });

    }

}

module.exports = GiphyAPI;