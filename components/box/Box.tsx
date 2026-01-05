import React from 'react';
import { Pressable, Text } from 'react-native';
import { BoxProps } from '../../types';
import { styles } from './BoxStyles';

const Box: React.FC<BoxProps> = ({ value, onPress, disabled, isWinning }) => {
  return (
    <Pressable
      style={[styles.box, isWinning && styles.winningBox]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, value === 'X' ? styles.x : styles.o]}>
        {value}
      </Text>
    </Pressable>
  );
};

export default Box;
