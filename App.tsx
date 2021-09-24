import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import Router from './src/router/Router';
import { colors } from './src/style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodyBackgroundColor,
  },
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 10,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#152238" />
        <Router />
      </View>
    </QueryClientProvider>
  );
};

export default App;
