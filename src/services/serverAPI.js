// export const SERVER_URL = "https://your-heroku-app.herokuapp.com"; 


export const SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";