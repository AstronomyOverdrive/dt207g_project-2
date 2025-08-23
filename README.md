# DT207G Project Staff Frontend
By William Pettersson
## About
This is a webapplication that interacts with my restaurant [backend](https://github.com/AstronomyOverdrive/project-1).<br>
This frontend is for the /staff parts of the API and requires the user to be logged in.
<br><br>
When accessing the webpage without being logged in you will automatically be redirected to the login page.<br>
After logging in your JWT will be saved in localstorage and be sent with every fetch call to /staff endpoints.<br>
Non-admin accounts will be able to see all current orders as well as mark them as completed which will then hide them,
the order information displayed is: items in order, customer name & phone as well as date/time and order id.<br>
Admin accounts will be able to register new staff accounts, remove staff accounts, update company description as well as
add, remove and update menu items.
