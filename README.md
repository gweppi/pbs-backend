# PBs - Backend

PBs stands for Personal Bests. This repo contains the backend for the [iOS app](https://github.com/gweppi/pbs-ios) I have also built.
The app shows what you would normally see on [swimrankings](https://www.swimrankings.net) when you searched for your best set records - but more user-friendly.

You can spin up your own instance by pulling the image from GitHub Container Registry: `docker pull ghcr.io/gweppi/pbs-backend:latest`

You can also try it out by querying an instance hosted on `api.pbs.gwep.dev`

## Endpoints

The API consicts of the following endpoints
- /
- /search
- /style

### /
Use this endpoint to retrieve the personal bests of a swimmer by using the user's swimranking-ID as a query component: `?athleteId=4038916`

### /search
This endpoint can be used to fetch a swimmer's swimranking-ID based on their name. Use it by passing name as a query component: `?name=Phelps`
In the component, you can put either the name or the surname, or both in order to query results.

## Examples