import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "./types";

const baseUrl = 'http://localhost:3000/api/diaries'


export const getAllDiaries = () => {
    return axios
      .get<DiaryEntry[]>(baseUrl)
      .then(response => response.data)
}

export const createDiary = (data: NewDiaryEntry) => {
    return axios
        .post<DiaryEntry>(baseUrl, data)
        .then(response => response.data)
}