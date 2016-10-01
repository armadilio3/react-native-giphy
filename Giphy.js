import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    Text,
    ListView,
    Image,
    Animated,
    TouchableOpacity,
} from 'react-native';

import GiphyAPI from './giphyAPI.js';

var watermark = require("./Images/watermark.png");

class Giphy extends Component {

    constructor(props){

        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            dataSource:ds.cloneWithRows([]),
            height: new Animated.Value(0),
            containerHeight: new Animated.Value(0),
        }

        this.api = new GiphyAPI();

    }

    componentDidMount(){

        this.api.getTrending((response) => {

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            this.setState({
                dataSource:ds.cloneWithRows(response),
            });

        });
        
    }

    componentWillReceiveProps(newProps){

        //Open close animation
        if(newProps.isVisible){

            Animated.timing(         
                this.state.height,   
                {
                    toValue: 135,
                    duration: 200,
                }            
            ).start();         

        }else{

            Animated.timing(       
                this.state.height,   
                {
                 toValue: 0,
                 duration:200,
                }            
            ).start();

        }

        //Search
        this.searchGifs(this.props.searchPhrase);


    }

    searchGifs(phrase){

        if(phrase && phrase.length > 0){

            this.api.getSearch(phrase,(response) => {

                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

                this.setState({
                    dataSource:ds.cloneWithRows(response),
                });

            });

        }else{

            this.api.getTrending((response) => {

                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

                this.setState({
                    dataSource:ds.cloneWithRows(response),
                });

            });
            
        }

    }

    gifPressed(data){

        if(this.props.onPress){
            this.props.onPress(data);
        }

    }

    renderRow(rowData){

        return(
            <TouchableOpacity activeOpacity={0.85} onPress={() => this.gifPressed(rowData)} style={styles.gifContainer}>
                <Image 
                    source={{uri:rowData.images.fixed_height.url}} 
                    style={{
                        height:100,
                        width:parseInt(rowData.images.fixed_height.width)*0.5,
                        marginHorizontal:1.25
                    }} />
            </TouchableOpacity>
        )

    }

    render(){

            return(
                
                <Animated.View style={[{height:this.state.height,overflow:"hidden"}]}>
                    <Image source={watermark} style={styles.watermark} resizeMode={"contain"} />
                    <View style={styles.container}>
                        <ListView
                            fixDoubleTapIssue={true} //https://github.com/facebook/react-native/issues/4229
                            keyboardShouldPersistTaps={true}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => this.renderRow(rowData)}
                            horizontal={true}
                            initialListSize={1}
                            scrollRenderAheadDistance={100}
                            showsHorizontalScrollIndicator={false} />
                    </View>
                </Animated.View>
            );

    }

}

const styles = StyleSheet.create({

    container: {
        backgroundColor:"white",
        paddingHorizontal:5,
        borderTopWidth:1,
        borderTopColor:"lightgray",
        overflow:"hidden",
    },
    gifContainer: {
        backgroundColor:"#EEE",
        height:100,
        marginTop:5,
        marginBottom:10,
    },
    watermark: {
        width:80,
    }

});

module.exports = Giphy;