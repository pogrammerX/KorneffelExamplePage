import { Meteor } from 'meteor/meteor'
import React, { useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { TasksCollection } from '../db/TasksCollection'
import { Task } from './Task'
import { TaskForm } from './TaskForm'
import { LoginForm } from './LoginForm'

const toggleChecked = ({ _id, isChecked }) =>
  Meteor.call('tasks.setIsChecked', _id, !isChecked)

const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id)

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false)
  const user = useTracker(() => Meteor.user())
  const logout = () => Meteor.logout()
  const userFilter = user ? { userId: user._id } : {}

  const hideCompletedFilter = { isChecked: { $ne: true } }
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter }

  const tasks = useTracker(() => {
    if (!user) {
      return []
    }

    return TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 }
      }
    ).fetch()
  })

  return (
    <div className='app'>
      <header>
        <div className='app-bar'>
          <div className='app-header'>
            <h1>Example Site</h1>
          </div>
        </div>
      </header>

      {user
        ? (
          <>
            <div className='user' onClick={logout}>
              Logout
            </div>
            <TaskForm user={user} />

            <div className='filter'>
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>

            <ul className='tasks'>
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </>
          )
        : (
          <LoginForm />
          )}
    </div>

  )
}
