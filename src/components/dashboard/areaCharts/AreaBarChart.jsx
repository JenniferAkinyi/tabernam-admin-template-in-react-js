import React, { useContext, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../../context/ThemeContext";
import { FaArrowUpLong } from "react-icons/fa6";
import { LIGHT_THEME } from "../../../constants/themeConstants";
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import "./AreaCharts.scss";

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [ totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the collection in Firestore
        const productsRef = collection(db, 'SalesReport','currentDate', 'Items');
        const productsSnapshot = await getDocs(productsRef);

        // Sum all soldQuantity values
        const totalPrice = productsSnapshot.docs.reduce((total, doc) => {
          const data = doc.data();
          // Convert soldQuantity to a number
          const price = Number(data.totalPrice) || 0;
          return total + price;
          }, 0);

        setTotalPrice(totalPrice);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatTooltipValue = (value) => {
    return `${value}k`;
  };

  const formatYAxisLabel = (value) => {
    return `${value}k`;
  };

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const data = [
    {
      month: "Jan",
      totalPrice: '',
    },
    {
      month: "Feb",
      totalPrice: '',
    },
    {
      month: "Mar",
      totalPrice: '',
    },
    {
      month: "Apr",
      totalPrice: '',
    },
    {
      month: "May",
      totalPrice: '',
    },
    {
      month: "Jun",
      totalPrice: '',
    },
    {
      month: "Jul",
      totalPrice: '',
    },
    {
      month: "Aug",
      totalPrice: totalPrice,
    },
    {
      month: "Sep",
      totalPrice: '',
    },
    {
      month: "Oct",
      totalPrice: '',
    },
    {
      month: "Nov",
      totalPrice: '',
    },
    {
      month: "Dec",
      totalPrice: '',
    },
  ]

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Total Revenue</h5>
        <div className="chart-info-data">
          <div className="info-data-value">{`Ksh.${totalPrice}`}</div>
          <div className="info-data-text">
            <FaArrowUpLong />
            <p>5% than last month.</p>
          </div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis
              padding={{ left: 10 }}
              dataKey="month"
              tickSize={0}
              axisLine={false}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
                fontSize: 14,
              }}
            />
            <YAxis
              padding={{ bottom: 10, top: 10 }}
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
              }}
            />
            <Tooltip
              formatter={formatTooltipValue}
              cursor={{ fill: "transparent" }}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              dataKey="totalPrice"
              fill="green"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="loss"
              fill="#e3e7fc"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
