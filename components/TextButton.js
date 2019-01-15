import React, {PureComponent} from 'react';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';

export default class TextButton extends PureComponent {
    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={{...styles.containerStyle, ...this.props.containerStyle}}>
                    <Text style={{...styles.textStyle, ...this.props.textStyle}}>{this.props.text}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    textStyle: {
        color: '#fff',
        fontSize: 20
    }
});