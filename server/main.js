import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { TasksCollection } from '../imports/db/TasksCollection'
import '../imports/api/tasksMethods'

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date()
  })

const SEED_USERNAME = 'Meteorite'
const SEED_PASSWORD = 'password'

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD
    })
  }

  if (!Accounts.findUserByUsername('David')) {
    Accounts.createUser({
      username: 'David',
      password: 'korneffel.exe'
    })
  }

  if (!Accounts.findUserByUsername('Korneffel')) {
    Accounts.createUser({
      username: 'Korneffel',
      password: 'korneffel'
    })
  }

  if (!Accounts.findUserByUsername('Elisabeth')) {
    Accounts.createUser({
      username: 'Elisabeth',
      password: 'Gerson'
    })

    const user = Accounts.findUserByUsername(SEED_USERNAME)

    if (TasksCollection.find().count() === 0) {
      [
        'First Task',
        'Second Task',
        'Third Task',
        'Fourth Task',
        'Fifth Task',
        'Sixth Task',
        'Seventh Task'
      ].forEach(taskText => insertTask(taskText, user))
    }
  }
})
