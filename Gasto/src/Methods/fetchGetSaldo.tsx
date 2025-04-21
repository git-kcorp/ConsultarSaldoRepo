
const fetchGetSaldo = async (credential: string) => {
  const response = await fetch("https://consultarsaldofunction.azurewebsites.net/api/GetSaldoV2", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${credential}`,
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.log("Error en la petición:", response.status);
  }
};

export default fetchGetSaldo;
