import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home';
import MovieDetail from '../screens/MovieDetail';
import { colors } from '../style';
import { City, Movie } from '../service';
import { CitySelection } from '../screens/CitySelection';

const HomeStack = createNativeStackNavigator();

export type RootStackParamList = {
  CitySelection: undefined;
  Home: { city: City };
  MovieDetail: { movie: Movie; city: City };
};

const homeOptions: NativeStackNavigationOptions = {
  title: 'CineFortaleza',
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.headerBackgroundColor },
};

const citySelectionOptions: NativeStackNavigationOptions = {
  title: 'Seleção de Cidade',
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.headerBackgroundColor },
};

const movieDetailOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerTransparent: true,
  headerShadowVisible: false,
  headerTitle: '',
  headerTintColor: colors.white,
};

export default () => (
  <NavigationContainer>
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="CitySelection"
        component={CitySelection}
        options={citySelectionOptions}
      />
      <HomeStack.Screen name="Home" component={Home} options={homeOptions} />
      <HomeStack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={movieDetailOptions}
      />
    </HomeStack.Navigator>
  </NavigationContainer>
);
