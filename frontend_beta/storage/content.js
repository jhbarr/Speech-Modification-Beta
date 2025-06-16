import * as SecureStore from "@react-native-async-storage/async-storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

/*
* saveBatchQueue (async) -> This function is used to add another element to the list of completed tasks that need to be 
*   sent and synced with the backend. 
* 
* FIELDS 
*   task_title (String) -> This is the name of the task that has been completed
* 
* ADDITIONAL
* Every time a new item is added, we don't want to replace the existing list of completed tasks. 
* We only want to update it
*/
export async function saveBatchQueue( task_title ) {
    try{
        const value = SecureStore.getItem("batchQueue")

        if (value != null) {
            // Key exists — parse and append
            const existingList = JSON.parse(value);

            if (Array.isArray(existingList)) {
                updatedList = [...existingList, task_title];
            } else {
                // If existing data is not an array, reset it
                updatedList = [task_title];
            }
        } else {
            // Key doesn't exist — create a new list
            updatedList = [task_title];
        }   

        await AsyncStorage.setItem("batchQueue", JSON.stringify(updatedList));
        console.log("List updated successfully");
    }
    catch (error) {
        Alert.alert("Error updating batch queue", error);
    }
}

/*
* saveFreeTasks ?
*/

/*
* saveFreeLessons -> This function saves a list of free lessons to react natives async storage (frontend)
*   Everytime it is called, it will overwrite the value that was already there (if it existed)
* 
* FIELDS
*   freeLessons (list) -> This is a list of disctionary objects representing every free lesson in the database
* 
* ADDITIONAL
* This function should be called whenever the frontend and backend are synced so that the frontend can store the
* latest information regarding lessons.
*/
export async function saveFreeLessons(freeLessons){ 
    try {
        await SecureStore.setItem('freeLessons', JSON.stringify(freeLessons));
    } catch (error) {
        console.log('Error storing lessons', error)
    }
}  