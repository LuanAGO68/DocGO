from fastapi import FastAPI
from routers.user_router import router

app = FastAPI(title="User Management Service")
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)