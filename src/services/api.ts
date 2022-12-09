import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['Release'],
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.consumet.org' }),
  endpoints: builder => ({}),
});
