// ── Weather Mock Data ────────────────────────────────────────────────────────
export const WEATHER_DB = {
  mumbai: {
    temp: 31, humidity: 78, condition: "Partly Cloudy", icon: "⛅", wind: 18, uv: 7,
    weekly: [
      { d: "Mon", h: 32, l: 27 }, { d: "Tue", h: 31, l: 26 }, { d: "Wed", h: 30, l: 25 },
      { d: "Thu", h: 33, l: 28 }, { d: "Fri", h: 29, l: 24 }, { d: "Sat", h: 28, l: 24 }, { d: "Sun", h: 30, l: 26 },
    ],
    hourly: [
      { t: "6am", temp: 26, hum: 80 }, { t: "9am", temp: 28, hum: 75 }, { t: "12pm", temp: 31, hum: 70 },
      { t: "3pm", temp: 32, hum: 68 }, { t: "6pm", temp: 30, hum: 72 }, { t: "9pm", temp: 27, hum: 78 },
    ],
  },
  delhi: {
    temp: 27, humidity: 55, condition: "Sunny", icon: "☀️", wind: 12, uv: 9,
    weekly: [
      { d: "Mon", h: 28, l: 18 }, { d: "Tue", h: 30, l: 20 }, { d: "Wed", h: 31, l: 21 },
      { d: "Thu", h: 27, l: 17 }, { d: "Fri", h: 26, l: 16 }, { d: "Sat", h: 29, l: 19 }, { d: "Sun", h: 32, l: 22 },
    ],
    hourly: [
      { t: "6am", temp: 19, hum: 60 }, { t: "9am", temp: 23, hum: 55 }, { t: "12pm", temp: 27, hum: 50 },
      { t: "3pm", temp: 29, hum: 45 }, { t: "6pm", temp: 26, hum: 52 }, { t: "9pm", temp: 21, hum: 58 },
    ],
  },
  bangalore: {
    temp: 24, humidity: 65, condition: "Light Rain", icon: "🌦", wind: 14, uv: 5,
    weekly: [
      { d: "Mon", h: 25, l: 18 }, { d: "Tue", h: 23, l: 17 }, { d: "Wed", h: 24, l: 18 },
      { d: "Thu", h: 22, l: 16 }, { d: "Fri", h: 26, l: 19 }, { d: "Sat", h: 25, l: 18 }, { d: "Sun", h: 23, l: 17 },
    ],
    hourly: [
      { t: "6am", temp: 18, hum: 72 }, { t: "9am", temp: 21, hum: 68 }, { t: "12pm", temp: 24, hum: 63 },
      { t: "3pm", temp: 25, hum: 60 }, { t: "6pm", temp: 22, hum: 66 }, { t: "9pm", temp: 19, hum: 70 },
    ],
  },
  pune: {
    temp: 29, humidity: 60, condition: "Clear Sky", icon: "🌤", wind: 10, uv: 8,
    weekly: [
      { d: "Mon", h: 30, l: 20 }, { d: "Tue", h: 29, l: 19 }, { d: "Wed", h: 31, l: 21 },
      { d: "Thu", h: 28, l: 18 }, { d: "Fri", h: 30, l: 20 }, { d: "Sat", h: 27, l: 17 }, { d: "Sun", h: 29, l: 19 },
    ],
    hourly: [
      { t: "6am", temp: 20, hum: 65 }, { t: "9am", temp: 24, hum: 62 }, { t: "12pm", temp: 29, hum: 58 },
      { t: "3pm", temp: 31, hum: 55 }, { t: "6pm", temp: 28, hum: 60 }, { t: "9pm", temp: 22, hum: 63 },
    ],
  },
  kolkata: {
    temp: 33, humidity: 82, condition: "Humid & Hazy", icon: "🌫", wind: 8, uv: 6,
    weekly: [
      { d: "Mon", h: 34, l: 26 }, { d: "Tue", h: 33, l: 25 }, { d: "Wed", h: 35, l: 27 },
      { d: "Thu", h: 32, l: 24 }, { d: "Fri", h: 31, l: 24 }, { d: "Sat", h: 33, l: 25 }, { d: "Sun", h: 34, l: 26 },
    ],
    hourly: [
      { t: "6am", temp: 26, hum: 85 }, { t: "9am", temp: 29, hum: 82 }, { t: "12pm", temp: 33, hum: 78 },
      { t: "3pm", temp: 34, hum: 75 }, { t: "6pm", temp: 31, hum: 80 }, { t: "9pm", temp: 27, hum: 84 },
    ],
  },
  chennai: {
    temp: 35, humidity: 80, condition: "Hot & Humid", icon: "☀️", wind: 16, uv: 10,
    weekly: [
      { d: "Mon", h: 36, l: 28 }, { d: "Tue", h: 35, l: 27 }, { d: "Wed", h: 37, l: 29 },
      { d: "Thu", h: 34, l: 26 }, { d: "Fri", h: 36, l: 28 }, { d: "Sat", h: 35, l: 27 }, { d: "Sun", h: 33, l: 26 },
    ],
    hourly: [
      { t: "6am", temp: 28, hum: 82 }, { t: "9am", temp: 31, hum: 79 }, { t: "12pm", temp: 35, hum: 75 },
      { t: "3pm", temp: 36, hum: 72 }, { t: "6pm", temp: 33, hum: 78 }, { t: "9pm", temp: 29, hum: 83 },
    ],
  },
  hyderabad: {
    temp: 30, humidity: 58, condition: "Mostly Sunny", icon: "🌤", wind: 11, uv: 8,
    weekly: [
      { d: "Mon", h: 31, l: 22 }, { d: "Tue", h: 30, l: 21 }, { d: "Wed", h: 32, l: 23 },
      { d: "Thu", h: 29, l: 20 }, { d: "Fri", h: 31, l: 22 }, { d: "Sat", h: 28, l: 19 }, { d: "Sun", h: 30, l: 21 },
    ],
    hourly: [
      { t: "6am", temp: 22, hum: 63 }, { t: "9am", temp: 25, hum: 60 }, { t: "12pm", temp: 30, hum: 55 },
      { t: "3pm", temp: 32, hum: 52 }, { t: "6pm", temp: 29, hum: 57 }, { t: "9pm", temp: 24, hum: 61 },
    ],
  },
  srinagar: {
    temp: 14, humidity: 70, condition: "Cool & Cloudy", icon: "☁️", wind: 20, uv: 3,
    weekly: [
      { d: "Mon", h: 15, l: 6 }, { d: "Tue", h: 14, l: 5 }, { d: "Wed", h: 12, l: 4 },
      { d: "Thu", h: 16, l: 7 }, { d: "Fri", h: 13, l: 5 }, { d: "Sat", h: 11, l: 3 }, { d: "Sun", h: 14, l: 6 },
    ],
    hourly: [
      { t: "6am", temp: 6, hum: 75 }, { t: "9am", temp: 9, hum: 72 }, { t: "12pm", temp: 13, hum: 68 },
      { t: "3pm", temp: 15, hum: 65 }, { t: "6pm", temp: 12, hum: 69 }, { t: "9pm", temp: 8, hum: 73 },
    ],
  },
};

export const DEFAULT_WEATHER = {
  temp: 28, humidity: 64, condition: "Partly Cloudy", icon: "⛅", wind: 13, uv: 6,
  weekly: [
    { d: "Mon", h: 29, l: 20 }, { d: "Tue", h: 28, l: 19 }, { d: "Wed", h: 30, l: 21 },
    { d: "Thu", h: 27, l: 18 }, { d: "Fri", h: 29, l: 20 }, { d: "Sat", h: 26, l: 17 }, { d: "Sun", h: 28, l: 19 },
  ],
  hourly: [
    { t: "6am", temp: 20, hum: 70 }, { t: "9am", temp: 23, hum: 66 }, { t: "12pm", temp: 27, hum: 62 },
    { t: "3pm", temp: 29, hum: 58 }, { t: "6pm", temp: 26, hum: 63 }, { t: "9pm", temp: 21, hum: 68 },
  ],
};
