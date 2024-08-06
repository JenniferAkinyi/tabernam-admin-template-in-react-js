import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';


const AreaCard = ({ colors, percentFillValue, cardInfo }) => {
  const [ quantity, setQuantity ] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the collection in Firestore
        const productsRef = collection(db, 'Products', 'Fertilizer', 'Available');
        const productsSnapshot = await getDocs(productsRef);

        // Sum all soldQuantity values
        const quantity = productsSnapshot.docs.reduce((total, doc) => {
          const data = doc.data();
          // Convert soldQuantity to a number
          const quantity = Number(data.quantity) || 0;
          return total + quantity;
          }, 0);

        setQuantity(quantity);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filledValue = (percentFillValue / `${quantity}`) * 360; // 360 degress for a full circle
  const remainedValue = 360 - filledValue;

  const data = [
    { name: "Remained", value: remainedValue },
    { name: "Achieved Sales", value: filledValue },
  ];

  const renderTooltipContent = (value) => {
    return `${(value / 360) * 100} %`;
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{cardInfo.value}</div>
        <p className="info-text">{cardInfo.text}</p>
      </div>
      <div className="area-card-chart">
        <PieChart width={100} height={100}>
          <Pie
            data={data}
            cx={50}
            cy={45}
            innerRadius={20}
            fill="#e4e8ef"
            paddingAngle={0}
            dataKey="value"
            startAngle={-270}
            endAngle={150}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={renderTooltipContent} />
        </PieChart>
      </div>
    </div>
  );
};

export default AreaCard;

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  percentFillValue: PropTypes.number.isRequired,
  cardInfo: PropTypes.object.isRequired,
};
