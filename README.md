# Cherry Mobile
Cherry Mobile is a meal-tracking mobile app designed to make it easy
to enter your meals and track your weekly, monthly, and yearly average calorie intakes. 
This allows its users to more accurately make dietary adjustments
to lose weight, gain muscle, or reach their other fitness goals!

## Youtube Overview
[![Josh Roundy on YouTube](https://i.ytimg.com/vi/IligeviHT-M/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBSs1LjCeiiuzzGoyFB_rqaKufOyA)](https://www.youtube.com/watch?v=UaZFytZe6NA "Cherry Mobile Overview")

## Planning
NOTE: Figma was used as a rough draft and several design changes were made afterward
<br><br>
Figma: https://www.figma.com/design/NGpP6fxiM1XJ2M6X4ij1My/Cherry-Mobile-Design-Board?node-id=0-1&t=gTW0nvCkMQB3KiuX-1

## Security
All data is transmitted with HTTPS and securely stored on an AWS RDS PostgreSQL database. The data API requires bearer auth, only allowing a user to access their own data.

## Backend
Cherry's backend is made with a Spring Boot authentication and data API
that connects with a Microsoft SQL Server database and the OpenAI API. 
<br><br>
The Spring Boot web server is deployed to an AWS EC2 instance and the database uses Postgres SQL RDS.

## Frontend
Cherry's front end consists of a React Native mobile app that makes HTTP requests
to the back end, getting the authorization and data it needs.

## Conclusion
Cherry Mobile was designed to be an improved version of Cherry web: https://cherry.joshroundy.dev .
Cherry uses AI to let users describe their meals with normal language or take pictures of their meals rather than requiring the use of complicated menus and searches, providing highly accurate estimates of calorie and protein content.
