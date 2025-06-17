import AsyncStorage from '@react-native-async-storage/async-storage';
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
        // Try to retrieve the task batch queue from async storage
        const value = await AsyncStorage.getItem("batchQueue")
        let updatedList = JSON.parse(value)

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
        console.log("Batch queue updated successfully");
    }
    catch (error) {
        let errorMessage = "Something went wrong";

            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert("Error saving batch queue", errorMessage);
    }
}



/*
* getBatchQueue (async) -> Retrieve the task batch queue from the async storage so that it can be sent to the backend
*   for processing
* 
* FIELDS 
*   none
* 
* ADDITIONAL
* This function should simply return a list with all of the tasks that have been completed over the past x amount of time
*/
export async function getBatchQueue() {
    try {
        return await AsyncStorage.getItem('batchQueue');
    } catch (error) {
        console.log('Error retrieving batch queue tasks', error)
    }
}




/*
* clearBatchQueue (async) -> This function will clear all of the completed tasks from the batch queue in async storage
* 
* FIELDS 
*   none
*
* ADDITIONAL
* This function should be used when the batch queue is synced with the backend
*/
export async function clearBatchQueue() {
    await AsyncStorage.removeItem('batchQueue');
}


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
        await AsyncStorage.setItem('freeLessons', JSON.stringify(freeLessons));
    } catch (error) {
        console.log('Error storing lessons', error)
    }
}  


/*
* getFreeLessons (async) -> Retrieve the free lessons from async storage
* 
* FIELDS
*   none
*/
export async function getFreeLessons() {
    try {
        return await AsyncStorage.getItem('freeLessons');
    } catch (error) {
        console.log('Error retrieving free lessons', error)
    }
}