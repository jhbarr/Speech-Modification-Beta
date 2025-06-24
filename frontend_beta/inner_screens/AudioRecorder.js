import { View, StyleSheet, Button } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

const audioSource = {
    uri: "https://www.speechmodification.com/uploads/2/5/6/7/25671452/r-blends_phrases.mp3"
}

export default function App() {
  const player = useAudioPlayer({uri: "https://www.speechmodification.com/uploads/2/5/6/7/25671452/r-blends_phrases.mp3"});

  return (
    <View style={styles.container}>
      <Button
        title={player.loading ? "Loading..." : "Play Sound"}
        disabled={player.loading}
        onPress={async () => {
            try {
            await player.play();
            } catch (e) {
            console.error("Error playing sound:", e);
            }
        }}
        />
      <Button
        title="Replay Sound"
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});