import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View, Keyboard } from 'react-native';
import { useQuery } from 'react-query';
import ErrorContent from '../../components/ErrorContent';
import Loading from '../../components/Loading';
import MovieListItem from '../../components/MovieListItem';
import { RootStackParamList } from '../../router/Router';
import { getMovies } from '../../service';
import { colors } from '../../style';
import { SearchComponent } from './SearchComponent';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bodyBackgroundColor,
    flex: 1,
    flexDirection: 'column',
  },
  movieList: {},
});

const Home = ({ navigation, route }: Props) => {
  const city = route.params.city;
  const {
    isLoading: loading,
    isError,
    data: movies,
  } = useQuery(`FETCH_MOVIES_${city.cityId}`, () =>
    getMovies(city.cityId).then(response => response.data),
  );

  const [search, setSearch] = useState('');

  const handleChangeSearchText = useCallback(text => {
    setSearch(text);
  }, []);
  const handleClearSearch = useCallback(() => {
    Keyboard.dismiss();
    setSearch('');
  }, []);
  const filteredMovies = useMemo(() => {
    if (search.trim().length === 0) {
      return movies || [];
    }
    return (
      movies?.filter(movie =>
        movie.title.toLowerCase().includes(search.toLowerCase()),
      ) || []
    );
  }, [search, movies]);

  if (loading) {
    return <Loading />;
  }

  if (isError || !movies?.length) {
    return <ErrorContent message="Não há filmes disponíveis no momento" />;
  }

  return (
    <View style={styles.container}>
      <SearchComponent
        value={search}
        onChangeText={handleChangeSearchText}
        onClear={handleClearSearch}
      />
      <View style={{ height: 15 }} />
      {filteredMovies.length > 0 ? (
        <FlatList
          style={styles.movieList}
          numColumns={2}
          data={filteredMovies}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MovieListItem
              movie={item}
              onPress={() =>
                navigation.push('MovieDetail', { movie: item, city })
              }
            />
          )}
        />
      ) : (
        <ErrorContent
          message={`Não encontramos nenhum filme com o nome: ${search}`}
        />
      )}
    </View>
  );
};

export default Home;
