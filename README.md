# JwtDemo
A secure JWT implementation using refresh and access token stored in a service worker for maximum security

This simple web application has been developed in order to demonstrate a proper implementation and use of
JSON Web Tokens for securing APIs, mitigating flaws in afforementioned authentication technique.

More specifically it implements :

- *Refresh and Access Token Authentication instead of a single JWT*, following Standards like refresh token rotation.
- *Access Token "Revocation"* via a blacklist with the help of Redis Cache.
- *Frontend secure token storage in memory of service worker* to make them inaccessible from XSS attacks.

Frontend is developed with Angular framework and backend is based on AspNet 7. Postgresql is the used database.

The implementation is not using any specific algorithm.

The only data structure used for security reasons is the hashes provided by REDIS cache which are record 
types structured as collections of field-value pairs in order to store important information about a 
user and access them very fast.

For a better abstraction and easier usage from interested parties, the whole project is based on docker compose.

## Backend

### Objects

First of all, necessary objects are needed to store corresponding information about tokens and options of JSON Web Token. Class JsonWebToken is used for storing refresh and access token strings as well as the lifetime of the last. Class JWTOptions helps in storing in memory the given settings for the token via the appsettings.json file so there is no need to access it in runtime. Those options refer to claims that can be used when issuing an access token (like valid issuer, audience etc.) as well as to arguments in Bearer token scheme initialization in program startup.  Class RefreshToken holds the refresh token string and a struct with important information about user needed for the access token issue (username and user roles) as well as its issue time. Those values are serialized and saved along refresh token in Redis cache (key: refresh token, value: serialized RefreshTokenInfo object).

EF Core was also used with code-first approach for easily migrating over databases and applying queries with the help of LINQ.


### Services

Services folder contains files necessary for creating and managing tokens and user account actions. AccountService is responsible for user actions signing-up / in /out while Access and Refresh Token Manager services handle procedures related to them (token blacklisting, refreshing, revoking etc.). JWTHandler service contains code for the access token generation with the help of the refresh token while setting registered claims’ values according to options and user info given. Created services are registered in the start of program with the correct type in order to be able to access them via corresponding controllers. Transient objects are always different; a new instance is provided to every controller and every service. Singleton objects are the same for every object and every request.Those services implement corresponding interfaces and are used in controllers for handling requests respectively.

### Middleware

The most important part of the blacklisting process is done with the help of custom middleware that checks every request’s access token against the Redis cache. This process is done to ensure that requests submitted after a user signed out or requested a token revocation (in case of interception suspicion) will not be served. There is also an error middleware in case where a request is malformed.  

### Controllers

All controllers are annotated with Authorize attribute, following the default Bearer scheme that has been set up accordingly.
For demo purposes, data is randomly generated and not fetched from database. 

### Appsettings.json

This file contains connection string for postgresql and redis cache databases as well as settings for JWT claims.

## Frontend

### Storing Tokens in service worker

The most important part implemented in client side is storing safely the tokens in a service worker which also acts like a proxy managing and modifying incoming HTTP requests.

There is ngsw-worker.js which is added by service-worker package and contains code for caching requests and resources like images as well as adding capabilities of push notifications etc. As this functionality does not cover authorization token handling, a new JavaScript file has been created, auth-worker.js to override fetch event listener and to save refresh and access tokens in memory. There is also a message event listener in order to exchange data between main and service thread via a broadcast channel. This communication is achieved with the help of the custom WorkerManagement service created for that purpose, but tokens themselves never pass from service to main thread.

### Handling HTTP requests

Even though main thread creates HTTP request with the help of HTTP Client, service worker intercepts them for necessary modifications. Header authorization bearer is set accordingly with access token and then worker processes the request, returning to main thread the results of API call by responding to fetch event. This way, neither the request containing the access token nor the tokens themselves can be intercepted as they are handled in a whole different context, not accessible by user and by extension, an attacker.

### Communication between main and worker thread

The application’s different interfaces and functionalities depending on user’s roles as well as if he is signed in or not, lead to the need of communication with the service thread to get that information. That is possible with the help of WorkerManagement service and with the use of a broadcast channel for messages exchange. For this reason, a message event listener is added in service thread (listening on the specific channel) and an onmessage function is used to retrieve the data posted by this thread to the main thread. This data is then resolved as a promise and returned to the caller function. This angular service helps to retrieve information like user’s roles and sign in status by checking if both refresh and access token are present in the service thread.


## Functionality

### Signing Up Functionality

Signing up is a straight forward process where a user must fill the given register form and then submit it. A new user is created and inserted in database. For an extra layer of security, it is a good idea to salt the already hashed password. In this prokect PBKDF2 algorithm is used to reduce vulnerability to brute-force attacks. Depending on the application’s specifications, user could receive an email for account confirmation and activation or wait for an admin to accept his signup request. This implementation shows up a successful registration form and user can redirect in sign in page.

### Signing In Functionality

When a user submits a sign in form, service worker recognizes sign-in endpoint in the URL in order to treat it differently from other requests. It continues to process the request but instead of returning the response fetched to the main thread, which contains refresh and access token, it first saves those tokens in worker memory and creates a new response for the client setting the body to the roles extracted from the access token. Those are used from the frontend to redirect user to corresponding landing page as well as modify the user interface accordingly. In this way, frontend is not aware of access and refresh tokens, making it almost impossible to intercept them with XSS attacks.
In case of an http error, the response remains untouched and returned to client in order to display the error message properly to the user (for example invalid credentials, Redis or database connection problems etc.).
When backend generates refresh and access token, it inserts the first in Redis cache along the necessary values described, “activating” in a manner and making it usable. 
 

### Authentication and Authorization of resources 
Controllers are annotated with authorize attribute and they are set up to use JWT bearer token authentication scheme, as used in the implementation.The application’s roles are implemented with an enumeration for consistency and saved in database as a serialized string array for better management. Because Asp.Net’s authorize attribute needs strings to work properly, nameof  function is used to get the role string. For multiple roles, string interpolation is used and roles are separated with a comma. Access for unauthorized users is given by the AllowAnonymous attribute.
If a user is not signed in and request access to protected resources, application will return a 401 HTTP error whilst if he does not hold the necessary roles a 403 HTTP error will occur like below:

If someone has managed to intercept access token and the user has been signed out or asked for a revocation, then the middleware will throw an unauthorized error for the requests that contain this token in their headers as it will be present in the blacklist in Redis cache.

###	Making HTTP Requests

When frontend client makes an HTTP request, our worker intercepts it and set authorization header bearer along with access token. Then it carries out the request with the newly added headers so it can be authorized from our controllers and responds to client by returning the results of the response received.

#### Renewing access token

When the access token expires, we must renew it with the help of our auth worker as described in client code. If a 401 error is fetched as response to a request that we have set auth headers, it means that our access token has expired, so we refresh it and then retry the request with the new access token. Following the rotation standard, a new refresh token is also issued without extending its lifetime but keeping the same absolute expiration time as the first one. The previous one is “deactivated” by removing it from Redis while the new one is inserted. This process is repeated “silently”, without the user knowing, until we reach the end of the refresh token lifetime, where he needs to reenter his credentials.

###	Signing Out

As with signing in process, service worker handles sign-out request differently. If sign-out endpoint is included in URL, fetch event must replace the body of the incoming request in order to put refresh token needed for sign-out actions in the backend. As this information is hidden from main thread, the request created in the frontend has a null body with the purpose to be replaced in fetch event. If 401 error occurs during this process, access token must be refreshed as the corresponding controller needs the user to be authenticated. When the request is handled and both access and refresh token have been revoked (deactivate current refresh token by removing it from Redis and blacklist the active access token by inserting it) then those tokens are also removed from the memory variables of the service worker.

## Docker

Project is based on docker compose. Its main building blocks are the postgresql database and redis cache.
There is also a pgadmin image, a web workbench for postgresql, in order to be able to monitor overall I/O 
as well as execute queries. Data and logs for those images are persisted via docker volumes, folders of system
that are mounted on images on runtime. To apply necessary migrations to database, sql script generated from
dotnet ef tool, is placed inside initdb folder of postgresql image.

Service workers can be registered and executed only over HTTPS communication with a valid SSL. As many browsers do not accept self-signed certificates in production environment, application should run on development mode, where service workers do not have the restraints referred. Application communicates with the rest of the images through proper connection strings (localhost is now used instead of the internal IP address of the bridged docker’s network), listening on ports exposed to host machine.

If the developer has a valid SSL certificate, he can setup an AspNet runtime’s certificate’s location properly in docker compose file, so the application is served from Kestrel, a cross-platform web server for ASP.NET Core, running on that image. In that case he must
publish the project and place the output inside publish folder of spa-server section of compose. Then the contents will be mounted
in AspNet's runtime image. In docker compose he can opt for running the application over https, filling correctly     *ASPNETCORE_Kestrel__Certificates__Default__Password* and *ASPNETCORE_Kestrel__Certificates__Default__Path* enviroment variables for 
the certificate as well as *ASPNETCORE_URLS: https://+:443;http://+:80* and *ASPNETCORE_HTTPS_PORT: 443* to set application's ports.

For production environments, a reverse proxy server like Nginx or Apache is suggested in order to forward incoming requests to Kestrel with a better load balance. In this case, connection strings inside appsettings.json file must be changed to the given IP addresses of composition’s virtual network. The only ports that need to be exposed are those of the proxy server, for the public to has access on the web application. Configuration for the proxy server should be placed inside the proper folder of Docker and is depending mainly on
what the developer would like for the application.

As this is a demo and for the reasons referred, both proxy server and kestrel are commented out in docker-compose.yaml.
If someone would like to bind ports to bare machine he can set *network_mode: host* and change network
ip addresses accordingly from *networks* section. This functionality is available only for linux host machines.

Environment variables like database passwords and mounting locations of host machine can be set inside .env file of Docker folder.

After executing docker compose and images are up and running, the user can now start the application from their editor or IDE
(Visual Studio 2022 is suggested) in debug mode. Npm must be available on the computer in order to install node_modules with npm install inside ClientApp folder. Aspnet 7 sdk and typescript must also be present for the development and debug-running  of the app. 

