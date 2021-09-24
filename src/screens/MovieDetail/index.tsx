import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PosterLandscape from '../../components/PosterLandscape';
import PosterPortrait from '../../components/PosterPortrait';
import TrailerButton from '../../components/TrailerButton';
import { RootStackParamList } from '../../router/Router';
import { colors } from '../../style';
import { addDays, format } from 'date-fns';
import { useCallback } from 'react';
import { getSessions, Session } from '../../service';
import Loading from '../../components/Loading';
import ErrorContent from '../../components/ErrorContent';
import { useQuery } from 'react-query';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodyBackgroundColor,
  },
  posterPortraitContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
  },
  detailsContainer: {
    flex: 1,
    margin: 5,
  },
  boldText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  regularText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '400',
  },
  synopsis: {
    marginBottom: 8,
  },
  segmentedControl: {
    marginTop: 15,
  },
  sessionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sessionItemContainer: {
    marginTop: 10,
  },
  sessionList: {
    marginBottom: 20,
  },
  roomItem: {
    flexDirection: 'row',
    marginLeft: 5,
    marginBottom: 5,
  },
  roomTime: {
    color: colors.white,
    fontSize: 15,
    marginRight: 20,
  },
  roomType: {
    marginRight: 4,
    color: '#000',
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    borderRadius: 4,
  },
});

const mapJsDayInPtDay: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda', // segunda-feira quebrou no layout
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
};

const MovieDetail = ({ route }: Props) => {
  const { movie, city } = route.params;

  const [days] = useState(() => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const dayAfterTomorrow = addDays(tomorrow, 1);
    const twoDaysAfterTomorrow = addDays(tomorrow, 2);
    return [today, tomorrow, dayAfterTomorrow, twoDaysAfterTomorrow];
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const daySelected = days[selectedDayIndex];

  const { isLoading: loading, data: sessions } = useQuery(
    `FETCH_SESSIONS_${movie.id}_${city.cityId}_${format(
      daySelected,
      'yyyy-MM-dd',
    )}`,
    () =>
      getSessions(city.cityId, movie.id, daySelected).then(
        response => response.data,
      ),
  );

  const renderTrailerButton = () => {
    if (movie.trailers.length) {
      return <TrailerButton trailerURL={movie.trailers[0].url} />;
    }
    return null;
  };

  const handleDayChange = useCallback(
    (value: string) => {
      const selectedDay = days.find(
        day => mapJsDayInPtDay[day.getDay()] === value,
      );
      const dayIndex = days.findIndex(day => day === selectedDay);
      setSelectedDayIndex(dayIndex);
    },
    [days],
  );

  return (
    <View style={styles.container}>
      <PosterLandscape imageURL={movie.posterHorizontalUrl}>
        <View style={styles.posterPortraitContainer}>
          <PosterPortrait
            imageURL={movie.posterPortraitUrl}
            width={170}
            height={170}
          />
        </View>
      </PosterLandscape>
      <View style={styles.detailsContainer}>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <Text style={styles.boldText}>
          Classificação:{' '}
          <Text style={styles.regularText}>{movie.contentRating}</Text>
        </Text>
        <Text style={[styles.boldText, styles.synopsis]} numberOfLines={3}>
          Synopsis: <Text style={styles.regularText}>{movie.synopsis}</Text>
        </Text>

        {renderTrailerButton()}

        <SegmentedControl
          style={styles.segmentedControl}
          values={days.map(day => mapJsDayInPtDay[day.getDay()])}
          selectedIndex={selectedDayIndex}
          onValueChange={handleDayChange}
        />
        <SessionComponent loading={loading} sessions={sessions || []} />
      </View>
    </View>
  );
};

type TSessionComponentProps = {
  loading: boolean;
  sessions: Session[];
};

function SessionComponent({ loading, sessions }: TSessionComponentProps) {
  if (loading) {
    return <Loading />;
  }
  if (sessions.length === 0) {
    return <ErrorContent message="Não há sessões disponíveis no momento" />;
  }
  return (
    <FlatList
      data={sessions}
      style={styles.sessionList}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.sessionItemContainer}>
          <Text style={styles.sessionTitle}>{item.name}</Text>
          {item.rooms[0].sessions.map(room => (
            <View style={styles.roomItem} key={room.id}>
              <Text style={styles.roomTime}>{room.time}</Text>
              {room.types.map(type => (
                <Text key={type.id} style={styles.roomType}>
                  {type.alias}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}
    />
  );
}

export default MovieDetail;
