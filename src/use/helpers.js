export const dateNormalize = (date) => {
  // Data fix for:
  // 1. new Date(2001, 5, 21);
  // 2. Date.now().
  date = new Date(date);

  const month = date.getMonth() === 0 ? 12 : date.getMonth() + 1;
  let fixMonth = month;
  if(month < 10) {
    fixMonth = "0" + month;
  }
  return date.getFullYear() + "-" + fixMonth + "-" + date.getDate();
};

const CACHE = [];

export const getByINN = (INN, cb) => {
  let url =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
  let token = "5a5e1d8d7ab18d3b42989fb686d9c977d1c9be2c";
  let query = INN;
  
  let options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({ query: query }),
  };

  let idx = -1;
  CACHE.forEach((item, currentIdx) => {
    idx = item.INN === INN ? currentIdx : -1;
  });

  if(idx !== -1) {
    cb(CACHE[idx]);
    return;
  }

  fetch(url, options)
  .then((response) => response.json())
  .then(({ suggestions }) => {
    const company = suggestions[0];
    const data = {
      name: company.value,
      INN: company.data.inn,
      OGRN: company.data.ogrn,
      address: company.data.address.value,
      date: company.data.state.registration_date,
      id: company.data.hid
    };


    CACHE.push(data);
    cb(data);
  })
  .catch((error) => console.log("error", error));
};