import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Input } from 'react-native-elements';

class InputField extends PureComponent<any, any> {
    _handleChange = value => {
        this.props.onChange(this.props.name, value);
    };
    _handleTouch = () => {
        this.props.onTouch(this.props.name);
    };
    render() {
        const { label, error, ...rest } = this.props;
        return (
            <Input
                label={label}
                onChangeText={this._handleChange}
                onBlur={this._handleTouch}
                {...rest}
                errorMessage={error}
                errorStyle={{ color: 'red' }}
            />
        )
    }
}

export default InputField;