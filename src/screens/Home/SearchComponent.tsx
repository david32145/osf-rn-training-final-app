import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { colors } from '../../style';
import Icon from 'react-native-vector-icons/MaterialIcons';

type TSearchComponentProps = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
};

export function SearchComponent({
  value,
  onChangeText,
  onClear,
}: TSearchComponentProps) {
  return (
    <View style={styles.container}>
      <Icon name="search" color={colors.borderColor} size={24} />
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
      />
      {value.trim().length > 0 && (
        <Icon
          name="close"
          color={colors.borderColor}
          size={24}
          onPress={onClear}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 10,
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  textInput: {
    color: colors.borderColor,
    fontSize: 16,
    height: 48,
    width: '75%',
    marginHorizontal: 10,
  },
});
