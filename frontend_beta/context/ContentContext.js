import { createContext, useEffect, useContext, useState, useRef } from 'react';
import { Alert, AppState } from 'react-native';

import api from '../utils/api'
import { AuthContext } from '../context/AuthContext';
import { getBatchQueue, saveBatchQueue, clearBatchQueue, saveFreeLessons, getFreeLessons} from '../storage/content';

export const ContentContext = createContext()


export const ContentProvider = ({ children }) => {
    // The global user email kept by the AuthContext
    const { userEmail, isAuthenticated } = useContext(AuthContext); // NEED TO PERSISTENTLY STORE THEIR EMAIL

    // Global list of lessons
    const [freeLessons, setFreeLessons] = useState([])
    // Global list of tasks
    const [freeTasks, setFreeTasks] = useState({})

    // These state variables will be used to handle keeping track of time and app state
    // This is so that the batch api calls can be sent out regularly
    const [appState, setAppState] = useState(AppState.currentState);
    const appStateRef = useRef(AppState.currentState);
    const intervalRef = useRef(null);

    /*
    * getFreeLessons (async) -> This function will retrieve all of the free lessons available to the logged in user
    *   It will compile a list of all of the lessons as well as which ones have been completed.
    * 
    * FIELDS 
    *   email (String) -> The email of the user
    * 
    * ADDITIONAL
    * The list compiled by this function will be available to the user while they are logged into the app
    * It should be periodically synced with the data in the backend so that there is consistency across 
    * the whole application
    */
    const retrieveFreeLessons = async () => {
        try {
            // Retrieve all of the free lessons in the database
            // Also retrieve all of the free lessons that the user has completed
            const res_all = await api.get('api/all-free-lessons/')
            // const res_completed = await api.get(`api/free-completed-lessons/${userEmail}/`)
            
            // Get the actual data
            // Additionally, aggregate all of the completed lesson titles into a list
            const all_lessons = res_all.data // -> List of objects
            // const completed_lessons = new Set(res_completed.data.map(item => item.lesson_id)) // -> List of objects
           
            // Give each lesson a property called 'is_completed'
            // This is determined by whether the lesson's id was returned by the free-completed-lessons call
            // const updatedLessons = all_lessons.map(lesson => ({
            //     ...lesson,
            //     is_completed: completed_lessons.has(lesson.id)
            // }))
            
            // Sort the lessons by id number
            // ** For some reason they come out a little jumbled in the API call
            all_lessons.sort((a, b) => a.id - b.id) // convert back to updatedLessons in the future for lesson completion flow
            
            // // Update the global state with the retrieved lessons
            setFreeLessons(all_lessons) // convert back to updatedLessons in the future for lesson completion flow

            // Also update the lesson data in persistent storage
            saveFreeLessons(all_lessons) // convert back to updatedLessons in the future for lesson completion flow

        }
        // Throw an error alert if anything goes wrong
        catch (error) {
            let errorMessage = "Something went wrong";

            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert("Error loading free lessons", errorMessage);
        }
    }


    /*
    * getFreeTasksByLesson (async) -> Get all of the tasks that belong to a certain lesson. Additionally, check which 
    *   tasks have been completed by the user so far and aggregate that information into one list
    * 
    * FIELDS
    *   email (String) -> The email of the current user
    *   lesson (String) -> The title of the lessons whose tasks we are trying to query
    * 
    * ADDITIONAL
    * Similarly to the getFreeLessons() method, we are aggregating which tasks have been completed by the user too
    */
    const getFreeTasksByLesson = async (lesson_id) => {

        // Check if the the tasks from this lesson have already been fetched
        if (!(lesson_id in freeTasks)){
            try {
                const res_tasks = await api.get(`api/free-tasks-by-lesson/${lesson_id}/`)
                // const res_completed = await api.get(`api/free-completed-tasks/${userEmail}/`)

                // Get the actual data
                // Additionally, aggregate all of the completed task titles into a list
                const tasks_by_lesson = res_tasks.data
                // const completed_tasks = new Set(res_completed.data.map(item => item.task_id))
            
                // Give each lesson a property called 'is_completed'
                // This is determined by whether the tasks's id was returned by the free-completed-tasks call 
                // const updated_tasks = all_tasks.map(task => ({
                //     ...task,
                //     is_completed: completed_tasks.has(task.id)
                // }))

                // Update the free tasks setting the current lesson_id to its respective tasks
                // ** NOTE ** To use a variable name as a key, you must put brackets around it
                setFreeTasks(prevData => ({
                    ...prevData,
                    [lesson_id]: tasks_by_lesson
                }))
                
            }
            // Handle any errors gracefully
            catch (error) {
                let errorMessage = "Something went wrong";

                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                Alert.alert("Error loading free tasks", errorMessage);
            }
        } 
        else {
            console.log(freeTasks[lesson_id])
        }
    }

    /*
    * completeFreeTask -> This function will mark a free task as completed on the frontend and add that information
    *   to a queue that will be batched and synced with the backend periodically
    * 
    * FIELDS
    *   lesson (String) -> The name of the lesson that the task belongs to
    *   task (String) -> The name of the task 
    * 
    * ADDITIONAL
    * This function is in charge of locally marking a task as complete and then checking whether all of the tasks
    * beloning to the lesson have been completed. If so, mark that lesson as completed as well. 
    * Only the completed tasks need to be added to the backend batch because the backend will handle marking lessons 
    * as completed
    */
    const completeFreeTask = async (lesson_id, task_id) => {
        console.log("\n\nExecuting completeFreeTask")

        try {
            // Mark the task as complete locally
            console.log(freeTasks, typeof(lesson_id))
            const updatedTasks = freeTasks[lesson_id].map(task =>
            task.id === task_id
                ? { ...task, is_completed: true }
                : task
            )

            // Update the global state variable
            setFreeTasks(prevData => ({
                ...prevData,
                [lesson_id]: updatedTasks
            }))
            console.log("completed task", task_id)


            // Now check if all of the tasks belonging to the lesson have been completed
            // We have to use updatedTasks and not the state variable freeTasks because at this point, the state variable
            // Hasn't updated yet
            const task_by_lesson = updatedTasks.filter(item => item.lesson === lesson_id && item.is_completed === true)
            const num_completed = task_by_lesson.length
            
            // Check if all of the tasks belonging to the specific lesson have been completed
            // First find the lesson with the match id
            const lesson = freeLessons.find(item => item.id === lesson_id)

            // If the length of the lesson tasks completed is equal to the number of tasks in the lesson
            // that means that the lesson itself is also complete
            if (lesson.num_tasks === num_completed) {
                const updatedLessons = freeLessons.map(lesson => 
                    lesson.id === lesson_id
                    ? { ...lesson, is_completed: true}
                    : lesson
                )

                setFreeLessons(updatedLessons)
                console.log("Completed lesson", lesson_id)
            }
            
            // Add the task to the batch queue
            await saveBatchQueue(task_id)
        }
        catch (error) {
            let errorMessage = "Something went wrong";

            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert("Error with completing the lessons", errorMessage);
    
        }

    }



    /*
    * syncCompletedTasks (async) -> This function will send all of the completed tasks in a batch to the backend so that 
    *   they can be marked as completed serverside. 
    * 
    * FIELDS 
    *   email (String) -> The email of the current user
    * 
    * ADDITIONAL
    * This function will also take the completed tasks and lessons returned by the backend to double check that all of the
    * completed tasks are marked as so on the frontend side. 
    */
    const syncCompletedTasks = async () => {
        console.log("\n\nExecuting syncCompletedTasks")

        const batch_queue = JSON.parse(await getBatchQueue())
        console.log("Current batch queue", batch_queue)
        
        // Don't do anything if there is nothing in the batch queue
        if (batch_queue.length == 0) return

        try {

            const res = await api.post('api/mark-completed-lessons/', { email: userEmail, task_ids: batch_queue })

            // Handle lesson completions
            const { newly_completed_tasks, newly_completed_lessons } = res.data;
            console.log("Response", newly_completed_tasks, newly_completed_lessons)
            
            // Check that the completed tasks and lessons are reflected correctly on the frontend
            // Find the task with the matching task title and check that it is complete on the frontend too
            newly_completed_tasks.forEach(function(item) { 
                const task = freeTasks.find(element => element.id === item)
                
                // If there is a mismatch between the frontend and the backend, mark the frontend task as complete
                // *** FOR NOW *** throw an error for debugging purposes
                if (task.is_completed !== true) {
                    Alert.alert("There was a mismatch between frontend and backend (with tasks)")
                }
            })

            // For the completed lessons as well. Check that the frontend and the backend match with respect to completion flags
            newly_completed_lessons.forEach(function(item) { 
                const lesson = freeLessons.find(element => element.id === item)

                if (lesson.is_completed !== true) {
                    Alert.alert("There was a mismatch between frontend and backend (with lessons)")
                }
            })


            // Clear the batch queue in async storage now that they are correcly synced
            await clearBatchQueue()
            console.log("Sync was successful")
        }
        catch (error) {
            let errorMessage = "Something went wrong";

            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert("Error sending batch tasks to backend", errorMessage);
        }
    }



    /*
    * freeLessonLoadInit (async) -> This function will load all of the free lessons from the backend and store them in the global
    *   state variable
    * 
    * FIELDS 
    *   none
    * 
    * ADDITIONAL
    * This funciton should be called when the Home page is initially mounted so that api references can have access to the different 
    * lesson titles. 
    */
    const freeLessonLoadInit = async () => {
        try {
            // 1. Check if lessons are stored in Async Storage
            const freeLessons =  JSON.parse(await getFreeLessons())
            if (freeLessons != null) {
                setFreeLessons(freeLessons)

            // Otherwise retrieve the lessons from the backend and store them
            // retrieveFreeLessons will store them both locally in state variables and in persistent storage
            } else {
                retrieveFreeLessons()
            }
        } catch (error) {
            let errorMessage = "Something went wrong";

            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert("Error initializing free lessons from backend", errorMessage);
        }
    }


    /*
    * This useEffect will be in charge of executing the batch task API calls to the backend.
    * This will occur both every X amount of time and when the user resumes using the app after it has gone
    * stale. 
    * We don't need to check if there is anything to batch, because the syncCompletedTasks() method will
    * do so for us
    */
    // useEffect(() => {
    //     if (isAuthenticated === true) {
    //         syncCompletedTasks()

    //         // Set interval for running every X seconds (e.g., 30 sec)
    //         intervalRef.current = setInterval(syncCompletedTasks, 30000);
            
    //         // Handle app resume
    //         // This sets up a listener for changes in the app state
    //         // the nextAppState is the new state that the app is entering
    //         const subscription = AppState.addEventListener("change", nextAppState => {

    //             // This checks if the app WAS running in the background but has 
    //             // now become active
    //             if (
    //                 appStateRef.current.match(/inactive|background/) &&
    //                 nextAppState === "active"
    //             ) {
    //                 // If the app HAS become active, we want to run our code
    //                 console.log("App has come to the foreground!");
    //                 syncCompletedTasks();
    //             }
    //             // This stores the current app state
    //             appStateRef.current = nextAppState;
    //             setAppState(nextAppState);
    //         });

    //         // Clean up
    //         // This code runs when the component unmounts
    //         // So in this case, that would just be when the app is entirely closed
    //         return () => {
    //         if (intervalRef.current) clearInterval(intervalRef.current);
    //         subscription.remove();
    // };
    //     }
    // }, [])



    return (
        <ContentContext.Provider value={{ retrieveFreeLessons, getFreeTasksByLesson, completeFreeTask, syncCompletedTasks, freeLessonLoadInit, freeLessons, freeTasks }}>
            {children}
        </ContentContext.Provider>
    )
}