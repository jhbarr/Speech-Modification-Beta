import AsyncStorage from "@react-native-async-storage/async-storage";

/*
* saveFreeLessons -> This function saves a list of free lessons to react natives async storage (frontend)
*   Everytime it is called, it will overwrite the value that was already there (if it existed)
*/
export async function saveFreeLessons({ freeLessons }){ 
    try {
        await AsyncStorage.setItem('freeLessonTitles', JSON.stringify(freeLessons));
    } catch (error) {
        console.log('Error storing lesson titles', error)
    }
}  