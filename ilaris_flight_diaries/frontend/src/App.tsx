import { useEffect, useState } from "react";
import { getAllDiaries, createDiary } from "./diaryService";

import { DiaryEntry } from "./types";
import axios from "axios";



function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [newDate, setNewDate] = useState("")
  const [newVisibility, setNewVisibility] = useState("")
  const [newWeather, setNewWeather] = useState("")
  const [newComment, setNewComment] = useState("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data)
    })
  }, []);

  const notify = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage("")
    }, 10000)
  }

  const diaryEntryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()

    createDiary({
      date: newDate,
      weather: newWeather,
      visibility: newVisibility,
      comment: newComment
    }).then(data => {
      setDiaries(diaries.concat(data))
    }).catch(error => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          notify(error.response.data)
        }
      }
    });


    setNewDate("");
    setNewVisibility("");
    setNewWeather("");
    setNewComment("");
  };
  
  return (
    <>
      <div>
        <h2>Add new entry</h2>
        <div style={{color: 'red'}}>{errorMessage}</div>
        <form onSubmit={diaryEntryCreation}>
          date 
          <input
            type="date"
            value={newDate}
            onChange={(event) => setNewDate(event.target.value)} 
          /><br/>
          visibility  
          great <input
            type="radio"
            name="visibility"
            onChange={() => setNewVisibility("great")} 
          />
          good <input
            type="radio"
            name="visibility"
            onChange={() => setNewVisibility("good")} 
          />
          ok <input
            type="radio"
            name="visibility"
            onChange={() => setNewVisibility("ok")} 
          />
          poor <input
            type="radio"
            name="visibility"
            onChange={() => setNewVisibility("poor")} 
          />
          <br/>
          
          weather  
          sunny <input
            type="radio"
            name="weather"
            onChange={() => setNewWeather("sunny")} 
          />
          rainy <input
            type="radio"
            name="weather"
            onChange={() => setNewWeather("rainy")} 
          />
          cloudy <input
            type="radio"
            name="weather"
            onChange={() => setNewWeather("cloudy")} 
          />
          stormy <input
            type="radio"
            name="weather"
            onChange={() => setNewWeather("stormy")} 
          />
          windy <input
            type="radio"
            name="weather"
            onChange={() => setNewWeather("windy")} 
          />
          <br/>
          comment
          <input
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)} 
          /><br/>
          <button type='submit'>add</button>
        </form>
      </div>
      <div>
        <h2>Diary entries</h2>
        {diaries.map(diary => (
          <div key={diary.id}>
            <h3>{diary.date}</h3>
            <p>
              visibility: {diary.visibility}<br/>
              weather: {diary.weather}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
