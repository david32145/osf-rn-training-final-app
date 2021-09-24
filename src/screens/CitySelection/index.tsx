import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from 'react-query';
import ErrorContent from '../../components/ErrorContent';
import Loading from '../../components/Loading';
import { RootStackParamList } from '../../router/Router';
import { City, getCities } from '../../service';
import { colors } from '../../style';

type TCitySelectionProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CitySelection'>;
};

export function CitySelection({ navigation }: TCitySelectionProps) {
  const {
    isLoading: loading,
    isError,
    data: cities,
  } = useQuery('FETCH_CITIES', () =>
    getCities().then(response =>
      response.data.sort((a, b) => a.cityName.localeCompare(b.cityName)),
    ),
  );

  const handleCitySelection = useCallback(
    (city: City) => {
      navigation.push('Home', {
        city,
      });
    },
    [navigation],
  );

  if (loading) {
    return <Loading />;
  }

  if (isError || !cities?.length) {
    return <ErrorContent message="Não foi possível carregar as cidades" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cities}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => String(item.cityId)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleCitySelection(item)}>
            <Text style={styles.itemText}>{item.cityName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodyBackgroundColor,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  item: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
  },
});
