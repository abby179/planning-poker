# Running locally

## Start Backend

1. Go to `server` foler.

2. Install requirements:

```
pip install -r requirements.txt
```

3. Spin up datastore (separate terminal):

```
docker-compose up
```

4. Export the datastore URL env var:

```
export DATASTORE_EMULATOR_HOST=0.0.0.0:8081
```

5. Start the project (same terminal that you exported the env var):

```
uvicorn main:app --reload
```

## Start Frontend

1. Go to `client` folder.

2. Install requirements:

```
yarn install
```

3. Start server:

```
yarn start
```

# API-Docs

Access it on http://127.0.0.1:8000/docs .
