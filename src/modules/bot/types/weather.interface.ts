export interface IWeatherItemFromAPI {
  dt: number;

  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };

  weather: {
    id: number;
    main: string;
    description: string;
  }[];

  wind: {
    speed: number;
    deg: number;
  };
}

export interface IForecastFromAPI {
  list: IWeatherItemFromAPI[];
}

export interface IWeatherMappedItem {
  current?: boolean;
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;

  weather: {
    id: number;
    main: string;
    description: string;
  };

  wind: {
    speed: number;
    deg: number;
  };
}
