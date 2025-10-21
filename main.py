# main.py
from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from random import randint
from typing import List

app = FastAPI(title="Dice Roller API")

# serve the static frontend
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return FileResponse("static/index.html")

@app.get("/api/roll")
def roll(count: int = Query(2, ge=1, le=10)) -> dict:
    """Roll `count` dice and return results between 1 and 6.
    Limit to 10 dice to keep payload small.
    """
    results: List[int] = [randint(1, 6) for _ in range(count)]
    return {"dice": results, "total": sum(results)}