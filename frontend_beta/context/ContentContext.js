import { createContext, useEffect, useContext, useState } from 'react';
import { Alert, AppState } from 'react-native';

import api from '../utils/api'
import { AuthContext } from '../context/AuthContext';

export const ContentContext = createContext()

export const ContentProvider = ({ children }) => {
    // The global user email kept by the AuthContext
    const { userEmail } = useContext(AuthContext); // NEED TO PERSISTENTLY STORE THEIR EMAIL

    // Global list of lessons
    const [freeLessons, setFreeLessons] = useState([])
    // Global list of tasks
    const [freeTasks, setFreeTasks] = useState([])

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
    const getFreeLessons = async () => {
        try {
            // Retrieve all of the free lessons in the database
            // Also retrieve all of the free lessons that the user has completed
            const res_all = await api.get('api/all-free-lessons/')
            const res_completed = await api.get(`api/free-completed-lessons/${userEmail}/`)
            
            // Get the actual data
            // Additionally, aggregate all of the completed lesson titles into a list
            const all_lessons = res_all.data
            const completed_lessons = res_completed.data.map(item => item.lesson_title)
           
            // For each lesson, check whether it has been completed and mark it accordingly
            for (let i = 0; i < all_lessons.length; i++) {
                const current = all_lessons[i];

                if (completed_lessons.includes(current.lesson_title)) {
                    current.is_completed = true
                }
                else {
                    current.is_completed = false
                }
            }

            setFreeLessons(all_lessons)

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
    const getFreeTasksByLesson = async (lesson) => {
        try {
            const res_all = await api.get(`api/free-tasks-by-lesson/${lesson}/`)
            const res_completed = await api.get(`api/free-completed-tasks/${userEmail}/`)

            // Get the actual data
            // Additionally, aggregate all of the completed task titles into a list
            const all_tasks = res_all.data
            const completed_tasks = res_completed.data.map(item => item.lesson_title)
           
            // For each task, check whether it has been completed and mark it accordingly
            for (let i = 0; i < all_tasks.length; i++) {
                const current = all_tasks[i];
                
                // if the task has been completed, mark it as so
                if (completed_tasks.includes(current.lesson_title)) {
                    current.is_completed = true
                }
                else {
                    current.is_completed = false
                }
            }

            setFreeTasks(freeTasks + all_tasks)
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
    const completeFreeTask = (lesson_title, task_title) => {
        // Add the task to the batch queue
        // IMPLEMENT LATER

        // Mark the task as complete locally
        const updatedTasks = freeTasks.map(task =>
        task.task_title === task_title
            ? { ...task, completed: true }
            : task
        )
        // Update the global state variable
        setFreeTasks(updatedTasks)

        // Now check if all of the tasks belonging to the lesson have been completed
        const task_by_lesson = freeTasks.filter(item => item.task_title === task_title)
        const num_completed = task_by_lesson.length

        const lesson = freeTasks.filter(item => item.lesson_title === lesson_title)
        if (lesson.num_tasks == num_completed) {
            const updatedLessons = freeLessons.map(lesson => 
                lesson.lesson_title === lesson_title
                ? { ...lesson, completed: true}
                : lesson
            )

            setFreeLessons(updatedLessons)
        }


    }


        return (
        <ContentContext.Provider value={{ getFreeLessons, getFreeTasksByLesson }}>
            {children}
        </ContentContext.Provider>
    )
}