import { StyleSheet, View, Dimensions, Text} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Vimeo } from 'react-native-vimeo-iframe';

const screenWidth = Dimensions.get('window').width;
const playerHeight = screenWidth * 9 / 16; // 16:9 aspect ratio

export default function VideoPlayer({ videoObject }){

    /*
    * extractVideoInfo -> This function extracts whether a video link is a youtube or vimeo link
    *   It additionally returns the video ID
    * 
    * FIELDS 
    *   link (String) -> The link to the video
    */
    const extractVideoInfo = (link) => {
        const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;

        const youtubeMatch = link.match(youtubeRegex);
        if (youtubeMatch) {
            // console.log({ platform: 'youtube', id: youtubeMatch[1] })
            return { platform: 'youtube', id: youtubeMatch[1] };
        }

        const vimeoMatch = link.match(vimeoRegex);
        if (vimeoMatch) {
            // console.log({ platform: 'vimeo', id: vimeoMatch[1] })
            return { platform: 'vimeo', id: vimeoMatch[1] };
        }

        return { platform: 'unknown', id: null };
    }

    // Extract the video id and the platform from the provided video link
    const videoContent = extractVideoInfo(videoObject);

    return (
        <View style={{ flex: 1 }}>
            {videoContent.platform === "youtube" 
                ? (
                <View style={[styles.youtubeContainer, {alignSelf: 'center'}]}>
                    <YoutubePlayer 
                        key={videoObject.id}
                        height={playerHeight}
                        videoId={videoContent.id} // just the YouTube ID
                    />
                </View>
                )
                :
                (
                <View style={[styles.vimeoContainer, { alignSelf: 'center' }]}>
                    <Vimeo
                        key={videoContent.id}
                        videoId={videoContent.id}
                    />
                </View>
                )
            }
        </View>
    )

}

const styles = StyleSheet.create({
    vimeoContainer: {
        height: playerHeight,
        width: '95%', 
        backgroundColor: '#FBFAF5', 
        // overflow: 'hidden',
        borderRadius: 20,
        marginTop: 50,

        padding: 16,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 6 }, // Shadow offset (x, y)
        shadowOpacity: 0.25, // Shadow opacity (0-1)
        shadowRadius: 3.84, // Shadow blur radius
    },
    vimeo: {
        height: '100%', 
        width: '100%', 
        backgroundColor: '#FBFAF5',
    },
    youtubeContainer: {
        height: playerHeight,            // Controls the height of the video
        // overflow: 'hidden',
        width: '95%',          // Optional: full screen width
        backgroundColor: '#FBFAF5', // Avoid white flash behind iframe
        borderRadius: 20,       // Optional: rounded corners
        marginTop: 50,     // Optional: spacing

        padding: 16,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 6 }, // Shadow offset (x, y)
        shadowOpacity: 0.25, // Shadow opacity (0-1)
        shadowRadius: 3.84, // Shadow blur radius
  },
})