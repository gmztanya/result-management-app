# Result Management Application (Backend APIs)
This repository contains the backend APIs for a Result Management Application, facilitating test result management for Teachers and Students.

## Features
##### _For Teachers_
- Login/logout: Authentication for teachers.
- View all student records: Access to all student records.
- Add, edit, and delete records: Teachers can manage student data.
##### _For Students_
- Login/logout: Authentication for students.
- Search records: Find records using roll number and name.
- Send student reports via email: Email the logged in student's report to that student's email id.

## Technologies Used
- Express.js: Backend server and routing.
- Sequelize: For efficient data management.
- JWT (JSON Web Tokens): User access and authentication.
- Nodemailer: For sending emails.
- Jest: Unit testing with Jest for >90% coverage.
- Async/Await.

## Setup Instructions
1. Clone the repository.
2. Install the dependencies and devDependencies:
This project requires [Node.js](https://nodejs.org/) v16+ to run.

    ```
    cd result-management-app
    npm i
    ```
3. Configure the database settings in config/default.js file. Replace the db credntials in the default.js file with your db credentials.
4. Run the application:

    ```sh
    npm start
    ```
5. To test the APIs, make use of Postman or other similar API testing tools. 
6. In case you are using Postman, kindly check the result-management-app/postman_collection folder for the postman collection. 

## API Endpoints

#### **POST /user/register**: Register Student and Teacher users.
Authorization token - not required.
Request Body (as JSON) sample - 
 ```
{
    "username": "tony",
    "password": "1234",
    "userType": "teacher",
    "email": "tony@gmail.com"
}
 ```
where userType can be "teacher" or "student"

#### **POST /auth/login**: To login with the registered user
Authorization token - not required.
Request Body (as JSON) sample - 
 ```
{
    "username": "tony",
    "password": "1234"
}
 ```
Successful login generates a token that should to be set as the **"Authorization"** header for all subequent requests. 
>If you are using postman to test the APIs, you can add the token as an environment variable. In the request tab for auth/login, go to **Tests** and add the following script:
```
var jsonData = JSON.parse(responseBody);
pm.environment.set("authorization", 'Bearer ' + jsonData.token);
```
>For subsequent requests, go to **Headers**, and add **Authorization** followed by {{authorization}} as the value. 
If you are adding the Authorization value directly, without setting it as an environment variable, you can copy the token we receive in the auth/login response and paste it as the header value. Make sure to prefix it with 'Bearer' string. e.g. **Bearer xxxxx**

#### **POST /auth/logout**: To logout the registered user
Authorization token - not required.
Request Body - not required. 
> added this API to clear the authorization token. In case you added the token in the enviroment variables, you can make use of the below script to empty its value.
```
pm.environment.set("authorization", '');
```

### **Teacher APIs**

#### **POST /teacher/add-student**: To add student records 
Authorization token - required. Added as a header - "Authorization". 
Request Body (as JSON) sample - 
 ```
{
    "rollNumber": "A0001",
    "name": "mitch",
    "dateOfBirth": "1993-10-10",
    "score": "90",
    "email": "mitch@gmail.com"
}
 ```

#### **GET /teacher/list-students**: To get the list of student records 
Authorization token - required. Added as a header - "Authorization". 
Request Body - not required

#### **DELETE /teacher/delete-student/{{rollNumber}}**: To delete a particular student record
Authorization token - required. Added as a header - "Authorization". 
Request Body - not required. 
RollNumber is passed in the url. 

#### **PUT /teacher/edit-student/{{rollNumber}}**: To edit a particular student record
Authorization token - required. Added as a header - "Authorization". 
Request Body - (as JSON) sample - 
 ```
{
    "score": "100"
}
 ```
 RollNumber is passed in the url.
 
### **Student APIs**

#### **POST /student/search**: To search a particular student record
Authorization token - required. Added as a header - "Authorization". 
Request Body - (as JSON) sample - 
 ```
{
    "rollNumber": "A0001",
    "name": "Mitch"
}
 ```
#### **POST /student/send-mail**: To email the student score to a particular student
Authorization token - required. Added as a header - "Authorization". 
Request Body - (as JSON) sample - 
 ```
{
    "email": "mitch@gmail.com",
}
 ```
 
## Testing
 Run the test cases:
```
npm test
```

## Linting
 Run the below command:
```
npm run lint:fix
```
