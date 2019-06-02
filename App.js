/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import BroadcastView from 'rn-broadcast-view';
import AstbeltActivityIndicator from 'rn-astbelt-activity-indicator';
import RangeSlider from 'rn-range-slider';
import TextButton from './components/TextButton';

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            broadcasting: false,
            astbeltProgress: 0,
            rangeLow: 0,
            rangeHigh: 100,
            min: 200,
            max: 1000,
        };
    }

    render() {
        const { broadcasting, astbeltProgress, rangeLow, rangeHigh, min, max } = this.state
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>

                    <View style={styles.itemContainerHorizontal}>
                        <TextButton
                            text={'Broadcast'}
                            onPress={() => this.setState({broadcasting: !broadcasting})}
                            containerStyle={styles.button}
                        />
                        <BroadcastView style={{width: 100, height: 100}} broadcasting={broadcasting}/>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.itemContainerHorizontal}>
                        <RangeSlider
                            rangeEnabled={false}
                            style={{width: 160, height: 70}}
                            onValueChanged={(low, high, fromUser) => {
                                this.setState({astbeltProgress: low / 100})
                            }}
                        />
                        <AstbeltActivityIndicator style={{width: 100, height: 100}}
                                                  progress={astbeltProgress}/>

                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.rangeSliderItemContainer}>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <RangeSlider
                              ref={component => this._slider = component}
                              gravity={'center'}
                              labelStyle={'bubble'}
                              style={{width: 200, height: 70}}
                              min={min}
                              max={max}
                              selectionColor="#3df"
                              blankColor="#f618"
                              step={20}
                              onValueChanged={(low, high, fromUser) => {
                                  this.setState({rangeLow: low, rangeHigh: high})
                              }}/>

                            <Text style={{
                                fontSize: 20,
                                color: '#fff'
                            }}>{`[${rangeLow}, ${rangeHigh}]`}</Text>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 16}}>
                            <TextButton
                              text="Set low to 300"
                              containerStyle={styles.setHighLowButton}
                              onPress={() => {this._slider.setLowValue(300)}}
                            />

                            <TextButton
                              text="Set high to 700"
                              containerStyle={styles.setHighLowButton}
                              onPress={() => {this._slider.setHighValue(700)}}
                            />
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 16}}>
                            <TextButton
                              text="Set min to 500"
                              containerStyle={styles.setHighLowButton}
                              onPress={() => this.setState({min: 500})}
                            />

                            <TextButton
                              text="Set max to 600"
                              containerStyle={styles.setHighLowButton}
                              onPress={() => this.setState({max: 600})}
                            />
                        </View>
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
    itemContainerHorizontal: {
        height: 120,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    itemContainerVertical: {
        height: 160,
        justifyContent: 'space-between',
        padding: 12,
    },
    rangeSliderItemContainer: {
        height: 220,
        justifyContent: 'space-between',
        padding: 12,
    },
    button: {
        height: 44,
        width: 100,
        backgroundColor: '#4286f4',
    },
    setHighLowButton: {
        marginHorizontal: 16,
        height: 44,
        width: 160,
        backgroundColor: '#4286f4',
    },
    divider: {
        height: 1,
        backgroundColor: '#9aa'
    },
});