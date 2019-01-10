import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import BroadcastView from 'rn-broadcast-view';

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            broadcasting: false
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <Button title={'broadcast'}
                            onPress={() => this.setState({broadcasting: !this.state.broadcasting})}
                            style={styles.button}
                    />
                    <BroadcastView style={{width: 90, height: 90}} broadcasting={this.state.broadcasting}/>
                </View>
                <View style={styles.divider}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#fff',
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
        backgroundColor: '#444'
    },
});
