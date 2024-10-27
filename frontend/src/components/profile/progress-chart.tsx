// Import required modules
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

interface myComponentProps {
  totalVal?: number | string;
  bgColor?: string;
}

const MyDoughnutChart = ({ totalVal, bgColor }: myComponentProps) => {
  const total = Number(totalVal) || 40;
  const options = {
    cutout: "75%",
    hover: {
      mode: null, // Disable hover effect
    },
    tooltip: {
      enabled: false, // Disable tooltip on hover
    },
    // plugins: {
    //   beforeDraw: (chart: any) => {
    //     const ctx = chart.ctx;
    //     const { chartArea } = chart;
    //     ctx.save();
    //     ctx.fillStyle = "red";
    //     ctx.fillRect(
    //       chartArea.left,
    //       chartArea.top,
    //       chartArea.right - chartArea.left,
    //       chartArea.bottom - chartArea.top
    //     );
    //     ctx.restore();
    //   },
    // },
  };
  const data = {
    datasets: [
      {
        // label: "Profile",
        data: [total, 100 - total],
        backgroundColor: [
          bgColor || "rgba(17, 156, 43, 1)",
          "rgba(244, 244, 244, 1)",
        ],
        hoverBackgroundColor: [
          bgColor || "rgba(17, 156, 43, 1)",
          "rgba(244, 244, 244, 1)",
        ],
        borderWidth: 0,
      },
    ],
  };

  return <Doughnut data={data} options={options as any} />;
};

export default MyDoughnutChart;
