import { AreaCards, AreaCharts, AreaTable } from "../../components";
import AreaTop from "../../components/dashboard/areaTop/AreaTop";

const Dashboard = () => {
  return (
    <div className="content-area">
      <AreaTop/>
      <AreaCards />
      <AreaCharts />
      <AreaTable />
    </div>
  );
};

export default Dashboard;
