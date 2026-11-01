import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getActividades } from "../../utils/apiRoutes";
import TablaGeneral from "../../components/tables/TablaGeneral";

export default function ActividadesPage() {
  const [data, setData] = useState();

  const { getTokken } = useContext(AuthContext);
  const token = getTokken();

  const getDataApi = async () => {
    const res = await getActividades(token);
    console.log("res actividades: ", res)
    setData(res.data.data);
  };

  useEffect(() => {
    getDataApi();
  });

  return <TablaGeneral datos={data} />;
}
