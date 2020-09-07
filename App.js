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
import RangeSlider2 from './Slider';

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        const now = new Date();
        this.state = {
            broadcasting: false,
            astbeltProgress: 0,
            rangeLow: now,
            rangeHigh: now,
            min: now,
            max: new Date(now.getTime() + 1000 * 60 * 60 * 24),
            v2Low: 0,
            v2High: 100,
        };
    }

    handleV2Set20 = () => {
        this.setState({v2Low: 20});
    }

    handleV2ValueChange = (low, high) => {
        this.setState({ v2Low: low, v2High: high });
    }

    render() {
        const { broadcasting, astbeltProgress, rangeLow, rangeHigh, min, max, v2Low, v2High } = this.state;
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
                            ref={component => this._astSlider = component}
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
                    <View style={[styles.rangeSliderItemContainer, {marginTop: 16}]}>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <RangeSlider
                                valueType="time"
                                ref={component => this._slider = component}
                                gravity={'center'}
                                labelStyle={'none'}
                                style={{width: '80%', height: 70}}
                                min={min}
                                max={max}
                                selectionColor="#3df"
                                blankColor="#f618"
                                step={1000 * 60 * 60}
                                textFormat="HH:mm"
                                onValueChanged={(low, high, fromUser) => {
                                    this.setState({rangeLow: low, rangeHigh: high})
                                }}
                            />

                            <Text style={{
                                fontSize: 20,
                                color: '#fff'
                            }}>{`[${rangeLow.getHours()}, ${rangeHigh.getHours()}]`}</Text>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 16}}>
                            <TextButton
                                text="Set low to 300"
                                containerStyle={styles.setHighLowButton}
                                onPress={() => {this._astSlider.setLowValue(100)}}
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
                    <RangeSlider2
                      style={{marginLeft: 50, width: 300}}
                      min={0}
                      max={100}
                      step={10}
                      low={v2Low}
                      high={v2High}
                      onValueChanged={this.handleV2ValueChange}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{
                            fontSize: 20,
                            color: '#fff',
                        }}>{v2Low}</Text>
                        <TextButton text={'SetLow to 20'} onPress={this.handleV2Set20}/>
                        <Text style={{
                            fontSize: 20,
                            color: '#fff',
                        }}>{v2High}</Text>
                    </View>
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
        backgroundColor: '#9aa',
    },
});
