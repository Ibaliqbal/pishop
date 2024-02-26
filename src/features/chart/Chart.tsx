// import { useProfit } from "@/hooks/useProfit";
// import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
// import { v4 as uuidv4 } from "uuid";

const data = [
  { name: "2017", react: 32, angular: 37, vue: 60 },
  { name: "2018", react: 42, angular: 42, vue: 54 },
  { name: "2019", react: 51, angular: 41, vue: 54 },
  { name: "2020", react: 60, angular: 37, vue: 28 },
  { name: "2021", react: 51, angular: 31, vue: 27 },
  { name: "2022", react: 95, angular: 44, vue: 49 },
];

const RechartsExample = () => {
  // const { profits } = useProfit();
  // const [dataChart, setDataChart] = useState<
  //   { id: string; profitAt: string; profit: number }[]
  // >([]);
  // useEffect(() => {
  //   const fiveDaysAgo = new Date();
  //   fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  //   // Filter dan kelompokkan data
  //   const result: { id: string; profitAt: string; profit: number }[] =
  //     profits.reduce(
  //       (acc: { id: string; profitAt: string; profit: number }[], cur) => {
  //         // Hanya include data 5 hari terakhir
  //         if (
  //           new Date(cur.profitAt?.toDate().toLocaleDateString()) >= fiveDaysAgo
  //         ) {
  //           // Cek jika tanggal sudah ada
  //           const found = acc.find(
  //             ({ profitAt }) =>
  //               profitAt === cur.profitAt?.toDate().toLocaleDateString()
  //           );

  //           if (found) {
  //             // Jumlahkan profit
  //             acc.push({
  //               id: found.id,
  //               profitAt: found.profitAt,
  //               profit: (found.profit = found.profit + cur.profitUpdate),
  //             });
  //           } else {
  //             // Tambah item baru
  //             acc.push({
  //               id: cur.id,
  //               profitAt: cur.profitAt.toDate().toLocaleDateString(),
  //               profit: cur.profitUpdate,
  //             });
  //           }
  //         } else {
  //           acc.push({
  //             id: uuidv4(),
  //             profitAt: fiveDaysAgo.toLocaleDateString(),
  //             profit: 0,
  //           });
  //         }

  //         return acc;
  //       },
  //       [] as { id: string; profitAt: string; profit: number }[]
  //     );

  //   // Isi array dengan hitung mundur tanggal
  //   const countdownDates = Array(5)
  //     .fill(0)
  //     .map((_, index) => {
  //       return new Date().getDate() - index;
  //     });
  //   const resultData =
  //     countdownDates.length === result.length
  //       ? result
  //       : countdownDates.map((date) => {
  //           const findProfit = result.find(
  //             (d) => new Date(d.profitAt).getDate() === date
  //           );
  //           if (findProfit) {
  //             return { ...findProfit, profit: findProfit.profit };
  //           } else {
  //             const fullDate = new Date().setDate(date);
  //             return {
  //               id: uuidv4(),
  //               profitAt: new Date(fullDate).toLocaleDateString(),
  //               profit: 0,
  //             };
  //           }
  //         });
  //   setDataChart(resultData);
  // }, [profits]);

  // const yAxis = {
  //   tickFormatter: (value: string) => {
  //     if (+value >= 1000000) {
  //       return `${Math.round(+value / 1000000)}M`;
  //     }
  //     return value;
  //   },
  // };
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="bump" dataKey="react" stroke="#16a34a" fill="#16a34a" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RechartsExample;
