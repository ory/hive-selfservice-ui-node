# ORY Kratos ExpressJS Self-Service UI Reference

[![CircleCI](https://circleci.com/gh/ory/kratos-selfservice-ui-node.svg?style=badge)](https://circleci.com/gh/ory/kratos-selfservice-ui-node)

This is an exemplary Self Service UI for [Ory Kratos](https://github.com/ory/kratos) Self Service features:

- Registration
- Login
- Logout
- User settings
  - Update profile
  - Change password
- Password reset
- ORY Kratos user error page

Additionally:

- Dashboard (requires login)

## Configuration

This application can be configured using two environment variables:

- `KRATOS_PUBLIC_URL` (required): The URL where ORY Kratos's Public API is located at. If
  this app and ORY Kratos are running in the same private network, this should
  be the private network address (e.g. `kratos-public.svc.cluster.local`).
- `TLS_CERT_PATH` (optional): Path to certificate file. Should be set up together with `TLS_KEY_PATH` to enable HTTPS.
- `TLS_KEY_PATH` (optional): Path to key file Should be set up together with `TLS_CERT_PATH` to enable HTTPS.

This is the easiest mode as it requires no additional set up. This app runs on port `:4455`
and ORY Kratos `KRATOS_PUBLIC_URL` URL.

This mode relies on the browser's ability to send cookies regardless of the port. Cookies set for
`127.0.0.1:4433` will thus also be sent when requesting `127.0.0.1:4455`. For environments
where applications run on separate subdomains, check out [Multi-Domain Cookies](https://www.ory.sh/kratos/docs/guides/multi-domain-cookies)

To authenticate incoming requests, this app uses ORY Kratos' `whoami` API to check
whether the session is valid or not.

## Development

To run this app with dummy data and no real connection to ORY Kratos, use:

```shell script
$ NODE_ENV=stub npm start
```

### Test with ORY Kratos

The easiest way to test this app with a local installation of ORY Kratos is to have the [ORY Kratos Quickstart](https://www.ory.sh/kratos/docs/quickstart/)
running. This is what that would look like:

```shell script
# start the quickstart using docker compose as explained in the tutorial: https://www.ory.sh/kratos/docs/quickstart/
export KRATOS_PUBLIC_URL=http://127.0.0.1:4433/
export PORT=4455

# In ORY Kratos run the quickstart:
#
#   make quickstart-dev
# 
# Next you need to kill the docker container that runs this app in order to free the ports:
#
#   docker kill kratos_kratos-selfservice-ui-node_1

npm start
```

### Update TypeScript SDK

If you've made changes to the ORY Kratos API you may want to manually generate
the TypeScript SDK in order for URLs and payloads to work as expected. It is
expected that you start this guide from this project's root, wherever you
checked it out. You also need to have the
[`openapi-generator` installed](https://openapi-generator.tech/docs/installation).

```shell script
# Set path to kratos:
export KRATOS_DIR=/path/to/kratos
make build-sdk
```

#### Building the Docker Image

```shell script
# Set path to kratos:
export KRATOS_DIR=/path/to/kratos
make build-sdk-docker
```

#### Clean up

```shell script
make clean-sdk
```
