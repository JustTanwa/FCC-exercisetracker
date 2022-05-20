# Exercise Tracker

This is the boilerplate for the Exercise Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker


## Goal

The goal is to pass all the test cases as stated on the intructions page on FCC. I am completing this project to learn more about and practice using MongoDB Atlas and Express.

I will use express to handle different routing method such as GET and POST and respond with appropriate data taken from the data base.

The data will be stored in a cloud service, MongoDB, I will practice creating schema, using model to create documents. I will also use query parameter to fetch and update document.

## What I learnt

I encountered a bug where the tests would failed when fail when posting new exercises. I initially tried to solve this by combining everything into one database but this made the application more complicated when querying the user document. So, I reverted back to using two databases, one for the user and one for the exercises with a foreign key linking it to each users. This method was better for querying the database for exercise which meets the criteria of the date contraints. 

To solve the bug, I inspected the dev tools and looked at each network request made by FCC tests and saw that the response sent was a "failure to find UID" so I checked the id which was passed to when querying the database. Fixing this, it resolved all test issues and passes all test.

