import { useContext, useEffect, useState } from "react";
import useTitle from "../../../../hooks/useTitle";
import { AuthContext } from "../../../../provider/AuthProvider";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";
import jsPDF from "jspdf";
import moment from "moment";

const AllBilling = () => {
  useTitle("Billing Report");
  const [myreports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!user) return;

        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/billing/all-bills`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMyReports(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching assigned vehicles:", error.message);
      }
    };

    fetchData();
  }, [user]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#2145e6"
          ariaLabel="ball-triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }
  const generatePDFReport = (report) => {
    const doc = new jsPDF();
    const {
      billTime,
      weightOfWaste,
      vehicleInfo,
      distance,
      costPerKm,
      fuelAllocation,
      stsId,
      landfillId,
      billedBy,
    } = report;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const headerText = "EcoSync System";
    const textWidth =
      (doc.getStringUnitWidth(headerText) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(headerText, centerX, 20);
    doc.setLineWidth(0.5);
    doc.line(centerX - 10, 22, centerX + textWidth + 10, 22);
    doc.text("Bill Details", 10, 30);
    doc.setFont("helvetica", "normal");
    doc.text(`Bill Time: ${new Date(billTime).toLocaleString()}`, 10, 40);
    doc.text(`Weight of Waste: ${weightOfWaste} tons`, 10, 50);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle Info", 10, 65);
    doc.setFont("helvetica", "normal");
    doc.text(`Registration Number: ${vehicleInfo.registration_number}`, 10, 75);
    doc.text(`Capacity: ${vehicleInfo.capacity} tons`, 10, 85);
    doc.text(
      `Fuel Cost Loaded: ${vehicleInfo.fuel_cost_loaded} per km`,
      10,
      95
    );
    doc.text(
      `Fuel Cost Unloaded: ${vehicleInfo.fuel_cost_unloaded} per km`,
      10,
      105
    );
    doc.text(`Type: ${vehicleInfo.type}`, 10, 115);
    doc.setFont("helvetica", "bold");
    doc.text("Distance and Cost", 10, 130);
    doc.setFont("helvetica", "normal");
    doc.text(`Distance: ${distance} km`, 10, 140);
    doc.text(`Cost Per Km: ${costPerKm} Tk`, 10, 150);
    doc.text(`Fuel Allocation: ${fuelAllocation} Tk`, 10, 160);
    doc.setFont("helvetica", "bold");
    doc.text("From STS and To Landfill", 10, 175);
    doc.setFont("helvetica", "normal");
    doc.text(`From STS: ${stsId}`, 10, 185);
    doc.text(`To Landfill: ${landfillId}`, 10, 195);
    doc.setFont("helvetica", "bold");
    doc.text("Billed By", 10, 210);
    doc.setFont("helvetica", "normal");
    doc.text(`Billed By: ${billedBy}`, 10, 220);

    doc.save("report.pdf");
  };

  return (
    <div>
      <h1 className="text-3xl my-3 uppercase">Reports:</h1>
      <div className="overflow-x-auto w-auto">
        <table className="table text-center">
          <thead>
            <tr className="bg-blue-200">
              <th>SN</th>
              <th>From</th>
              <th>Time</th>
              <th>Vehicle Number</th>
              <th>Capacity (TON)</th>
              <th>Weight Of Waste (TON)</th>
              <th>Fuel Cost(TK)</th>
              <th>Prepared By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {myreports?.map((report, index) => (
              <tr key={report._id} className="hover">
                <th>{index + 1}</th>
                <td>{report.areaName}</td>
                <td>{moment(report.billTime).format("lll")}</td>
                <td>{report.vehicleInfo.registration_number}</td>
                <td>{report.vehicleInfo.capacity}</td>
                <td>{report.weightOfWaste}</td>
                <td>{report.fuelAllocation}</td>
                <td>{report.billedBy}</td>
                <td>
                  <button
                    onClick={() => generatePDFReport(report)}
                    className="btn btn-xs btn-info"
                  >
                    Generate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBilling;
