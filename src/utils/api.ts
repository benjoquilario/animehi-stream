const getJSON = async function (url: string): Promise<any> {
  const res = await fetch(url);
  const data = await res.json();

  return data;
};

export default getJSON;
