# Requirements:
You must have nodejs and npm setup on your machine.

# Get Started

1. Move to testServer director using cd testServer
2. Install the necessary packages using npm install
3. Create an env file with the following fields:

```

DB_PATH=mongodb+srv://sameer920:SameerAccessBackend@cluster0.omrw2fl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
GOOGLE_CLIENT_ID=<Your Google OAUTH CLIENT ID>
GOOGLE_CLIENT_SECRET=<<Your Google OAUTH CLIENT SECRET>
CALLBACK_URL=http://localhost:2121/auth/login/user/google/redirect
SECRET_STRING=EFMC234f4o3few!@e43-023-2044
PINECONE_API_KEY=4763fdc8-c495-491a-9285-5e2841adcad0
PINECONE_ENVIRONMENT=us-west4-gcp-free
PINECONE_INDEX=finbot
SUCCESS_LOGIN_REDIRECT=http://localhost:3000/Dashboard
FAILURE_LOGIN_REDIRECT=http://localhost:3000/login
PORT=2121
COOKIE_SAME_SITE=""
SERVER_ADDR=http://localhost:2121
GOOGLE_GENAI_KEY=AIzaSyDc4wKrfOeWCWmUDMHG-sSuNLwgvhMcALk
```

4. Run the server using node index.js



## To access the frontend

1. Move to frontend Directory
2. Install the necessary packages using npm install
3. In this directory, create an env file with the following contents:

VITE_APP_SERVERURL=http://localhost:2121

4. Run the frontend using npm run dev
