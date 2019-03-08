Student Registration
====================

Local development
-----------------

1. Build and run Docker containers:

    ```
    $ docker-compose up -d
    ```

2.  Run database migrations:

    ```
    $ docker exec -ti registration_app_1 knex migrate:latest
    ```

3.  Browse [http://localhost:8094](http://localhost:8094).

Run unit tests
--------------

Run unit tests:

```
$ docker exec -ti registration_app_1 yarn test
```

You should see something like this:

```
 PASS  __tests__/api.test.js (14.915s)
  registration test
    ✓ post registration  POST /api/register (1118ms)
  common students test
    ✓ get common students  GET /api/commonstudents (10ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        14.97s, estimated 17s
Ran all test suites.
...
```
