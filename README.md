Student Registration
====================

Local development
-----------------

1. Build and run Docker containers:

    ```
    $ docker-compose up -d
    ```

2.  Run database migrations and seeding:

    ```
    $ docker exec -ti registration_app_1 knex migrate:latest
    $ docker exec -ti registration_app_1 knex seed:run
    ```

3.  Application is served at [http://localhost:8094](http://localhost:8094).

Run unit tests
--------------

Run unit tests:

```
$ docker exec -ti registration_app_1 yarn test
```

You should see something like this:

```
 PASS  __tests__/api.test.js (20.002s)
  registration test
    ✓ it succeeds (2039ms)
  common students test
    ✓ get common students GET /api/commonstudents (28ms)
    ✓ get common students GET /api/commonstudents (23ms)
  suspension test
    ✓ if the student exists, it succeeds (25ms)
    ✓ if the student does not exist, it fails (37ms)
  retrieve students for notification
    ✓ if all the teacher and students exist, it succeeds (22ms)
    ✓ if all the teacher and students exist, it succeeds (11ms)
    ✓ if the teacher or any students do not exist, it fails (21ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        31.581s
Ran all test suites.
...
```
