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
import Label from './Slider/Label';
import Notch from './Slider/Notch';
import Thumb from './Slider/Thumb';
import Rail from './Slider/Rail';
import RailSelected from './Slider/RailSelected';

const v2Styles = {marginLeft: 50, width: 300};

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
            v2Low: 100,
            v2High: 200,
        };
    }

    handleBroadcastPress = () => this.setState({broadcasting: !this.state.broadcasting});
    handleAstBeltValueChange = low => this.setState({astbeltProgress: low / 100});
    handleSliderChange = (low, high, fromUser) => this.setState({rangeLow: low, rangeHigh: high})
    handleSetMin500 = () => this.setState({min: 500})
    handleSetMax700 = () => this.setState({max: 700})

    handleV2Set20 = () => {
        this.setState({v2Low: 20});
    }

    handleV2ValueChange = (low, high) => {
        this.setState({ v2Low: low, v2High: high });
    }

    renderV2Label = value => {
        const text = Number.isNaN(value) ? 'Nothing' : `Value: ${Math.round(value)}`;
        return <Label text={text}/>;
    }

    renderV2Thumb = () => <Thumb/>
    renderV2Notch = value => <Notch/>
    renderRail = () => <Rail/>
    renderRailSelected = () => <RailSelected/>

    render() {
        const { broadcasting, astbeltProgress, rangeLow, rangeHigh, min, max, v2Low, v2High } = this.state;
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>

                    <View style={styles.itemContainerHorizontal}>
                        <TextButton
                            text={'Broadcast'}
                            onPress={this.handleBroadcastPress}
                            containerStyle={styles.button}
                        />
                        <BroadcastView style={{width: 100, height: 100}} broadcasting={broadcasting}/>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.itemContainerHorizontal}>
                        <RangeSlider
                            rangeEnabled={false}
                            style={{width: 160, height: 70}}
                            onValueChanged={this.handleAstBeltValueChange}
                        />
                        <AstbeltActivityIndicator
                          style={{width: 100, height: 100}}
                          progress={astbeltProgress}
                        />
                    </View>
                    <View style={styles.divider}/>
                    <View style={[styles.rangeSliderItemContainer, {marginTop: 16}]}>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <RangeSlider
                                valueType="time"
                                gravity={'center'}
                                labelStyle={'none'}
                                style={{width: '80%', height: 70}}
                                min={min}
                                max={max}
                                selectionColor="#3df"
                                blankColor="#f618"
                                step={1000 * 60 * 60}
                                textFormat="HH:mm"
                                onValueChanged={this.handleSliderChange}
                            />

                            <Text style={{
                                fontSize: 20,
                                color: '#fff',
                            }}>
                                {`[${rangeLow.getHours()}, ${rangeHigh.getHours()}]`}
                            </Text>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 16}}>
                            <TextButton
                                text="Set min to 500"
                                containerStyle={styles.setHighLowButton}
                                onPress={this.handleSetMin500}
                            />

                            <TextButton
                                text="Set max to 600"
                                containerStyle={styles.setHighLowButton}
                                onPress={this.handleSetMax700}
                            />
                        </View>
                    </View>
                    <View style={styles.divider}/>
                    <RangeSlider2
                      style={v2Styles}
                      min={100}
                      max={200}
                      step={1}
                      railStyle={styles.v2RailStyle}
                      onValueChanged={this.handleV2ValueChange}
                      renderThumb={this.renderV2Thumb}
                      renderLabel={this.renderV2Label}
                      renderNotch={this.renderV2Notch}
                      renderRail={this.renderRail}
                      renderRailSelected={this.renderRailSelected}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{
                            fontSize: 20,
                            color: '#fff',
                        }}>{Math.round(v2Low)}</Text>
                        <TextButton text={'SetLow to 20'} onPress={this.handleV2Set20} containerStyle={{marginTop: 40}}/>
                        <Text style={{
                            fontSize: 20,
                            color: '#fff',
                        }}>{Math.round(v2High)}</Text>
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
    v2RailStyle: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#7f7f7f',
    },
    v2RailSelectedStyle: {
        height: 4,
        backgroundColor: '#4499ff',
    },
});
