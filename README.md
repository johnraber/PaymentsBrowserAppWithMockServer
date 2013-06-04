This is NOT an official reference implementation using the entire PayPal payments REST API.
This project will not be kept in sync with the PayPal payments REST API.

The purpose of this project is to start to understand how 'good' the
   new Payments RESTful API is from the perspective of writing an in-browser
   application ( as much as possible since have to consider PCI compliance/security)
   and to start understanding how to qualify/quantify 'good' from the 
   perspective of a consumer of the API.

Please note that I mocked the server and slightly modified the real API behavior
to support partial updates using 'PATCH' and full updates using 'PUT'. This is
to exercise the full power of state mgmt avaiable in the browser client using
JQuery and Backbone. I also wanted to use CORS ( cross origin resource sharing ) to
write the entire application in the browser.  I also choose to not mock OAuth 2 to reduce complexity.
The tech stack used is to both rapid prototype as well as use the latest 
well supported/documented lightweight ( read javascript/front end ) frameworks
that push state mgmt and the abiltiiy to orchestrate out to the client.


The project on the master branch does NOT contain a specific Use Case Flow. 
It was meant to exercise the API to:

1. Understand the resource hiearchy relationships as it is  5/6 levels deep.
2. Understand the resource hydration strategy the server is using... for example
   when calling get on the top level Payment resource the fully hydrated
   Payments resource is returned.
3. Exercise a fairly strict but pragmatic REST paradigm to harness the power of
   the client side (backbone) and server mocking (restify/node) libraries available.
4. Exercise the entire resource model from the perspective of 'GET', 'POST', 'PUT',
   and 'PATCH'.  'DELETE' is not supported in the nominal Use Cases yet only cancel
   which is reflected as state attribute on a resource such as a Payment.



This project is meant as a boiler plate that can very easily be modified (on branches
or seperate repos) for specific Use Cases.  In fact, you will probably remove more
code than add for a specific Use Case.  My intent is to due this if time permits.



TODO  Need to test out the json error payload that can be returned along with 
      the specific HTTP codes for each service call


