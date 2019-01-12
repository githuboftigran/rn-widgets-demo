/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, SafeAreaView, Slider, StyleSheet, Text, View} from 'react-native';
import BroadcastView from 'rn-broadcast-view-tmp';
import AstbeltActivityIndicator from 'rn-astbelt-activity-indicator-tmp';

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            broadcasting: false,
            astbeltProgress: 0,
        };
    }

    render() {
        const minValue = 0;
        const maxValue = 100;
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.itemContainer}>
                        <Button title={'broadcast'}
                                onPress={() => this.setState({broadcasting: !this.state.broadcasting})}
                                style={styles.button}
                        />
                        <BroadcastView style={{width: 90, height: 90}} broadcasting={this.state.broadcasting}/>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.itemContainer}>
                        <Slider style={{width: 160, height: 40}}
                                onValueChange={(value) => this.setState({astbeltProgress: minValue + value / (maxValue - minValue)})}
                                minimumValue={minValue}
                                maximumValue={maxValue}
                        />
                        <AstbeltActivityIndicator style={{width: 100, height: 100}} progress={this.state.astbeltProgress}/>

                    </View>
                    <View style={styles.divider}/>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#303232',
    },
    itemContainer: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 4,
    },
    button: {
        height: 44
    },
    divider: {
        height: 1,
        backgroundColor: '#9aa'
    },
});