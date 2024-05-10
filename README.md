# APPLICA CORP SWE CHALLENGE

## HOW TO RUN

- if you have docker and can run a ``make`` command, just run ``make up`` and it will build a docker image with the API and run it on the port ``8080``.
- you can use ``make down`` to clean the volumes that the docker-compose created.
- if you prefer to run the application more traditionally, I've used NodeJS v18.16.0 and a ``nvm use`` in the root directory will setup the node version if needed.

> if you guys and/or gals wish a Golang version, just say the word. I made it with NodeJS because of the Job Description.

## PROBLEM

- You need to implement a simple RESTful API that will return a detailed list of blog
posts, structured as a JSON response.

- When the user hits our HTTP service, the backend must fetch the blog entries from
the following endpoint: **GET https://jsonplaceholder.typicode.com/posts**

- The user must request a paginated set of blog posts, providing the start (0-indexed)
of the results and the size of the content list. The user will provide this data as a
query string on the URL. For example, if the user wants to see the blog posts from
the number 11 to number 20, the request will have start = 10 and size = 10.

- Each of the blog posts returned must contain the information about its author. The
information regarding the blog authors can be fetched from the following endpoint:
GET https://jsonplaceholder.typicode.com/users

- Each blog post has an userId property, use that to know who is the author of the
item.

- The blog site we're consuming has a defined list of authors, so the previous endpoint
will always return the same set of results.

- The information of the author of each blog post must be included on the response,
inside the user property.

- Each of the blog posts returned may have comments, so they also need to be
appended to the response for each of the results. The comments can be retrieved
from the following endpoint: **GET https://jsonplaceholder.typicode.com/posts/:postId/comments**

- The comments contents must be included for each blog post, inside a comments
property. If a blog post doesn't have comments yet, the property must be present with
an empty list.

- Our API must handle the following status code responses:
200 - A list of blog posts were found and returned
404 - The URL was not matched or there were no blog results for the specified
pagination parameters.
500 - Any other server error.

## OBSERVATIONS

- [this issue](https://github.com/typicode/jsonplaceholder/issues/65) showed me how to paginate the response

