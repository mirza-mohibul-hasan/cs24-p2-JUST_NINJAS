import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import moment from "moment";
import jsPDF from "jspdf";

const CalculateBills = () => {
  const [stsInfo, setStsInfo] = useState(null);
  const [contractorsInfo, setContractorsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token || !user) {
          return (
            <div className="flex justify-center flex-col items-center h-full">
              <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#ff0000"
                ariaLabel="ball-triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          );
        }
        const response = await axios.get(
          `http://localhost:3000/sts-manager/details-for-entry/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setStsInfo(response.data?.stsInfo);
        setContractorsInfo(response.data?.contractorsInfo);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);
  if (loading || !stsInfo) {
    return (
      <div className="flex justify-center flex-col items-center h-full">
        <p className="text-5xl text-center">You Do not Have STS</p>
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#ff0000"
          ariaLabel="ball-triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }
  console.log(contractorsInfo);
  const generatePDFReport = async (registrationId) => {
    console.log(registrationId);
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token || !user) {
        return (
          <div className="flex justify-center flex-col items-center h-full">
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="#ff0000"
              ariaLabel="ball-triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        );
      }
      const response = await axios.get(
        `http://localhost:3000/sts-manager/calculate-bills/${registrationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const {
        stsId,
        contractorId,
        fineRate,
        basicPay,
        deficit,
        contractorFine,
        totalBill,
        date,
      } = response.data;
      const doc = new jsPDF();
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
      doc.text(`Date: ${new Date(date).toLocaleString()}`, 10, 40);
      doc.text(`STS ID: ${stsId}`, 10, 50);
      doc.text(`Contractor ID: ${contractorId}`, 10, 60);
      doc.text(`Fine Rate: ${fineRate}`, 10, 70);
      doc.text(`Basic Pay: ${basicPay}`, 10, 80);
      doc.text(`Deficit: ${deficit}`, 10, 90);
      doc.text(`Contractor Fine: ${contractorFine}`, 10, 100);
      doc.text(`Total Bill: ${totalBill}`, 10, 110);

      doc.save(`${date + contractorId}.pdf`);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="text-3xl my-3 uppercase">Calculate Bills For:</h1>
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr className="bg-blue-200">
              <th>SN</th>
              <th>Company Name</th>
              <th>Area of Collection</th>
              <th>Payment(Per TON)</th>
              <th>Require Waste Per Day (TON)</th>
              <th>Prepared By</th>
              <th>Registration Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contractorsInfo?.map((contractor, index) => (
              <tr key={contractor._id} className="hover">
                <th>{index + 1}</th>

                <td>{contractor.companyName}</td>
                <td>{contractor.areaOfCollection}</td>
                <td>{contractor.paymentPerTonWaste}</td>
                <td>{contractor.reqAmountWastePerDay}</td>
                <td>{user?.email}</td>
                <td>{moment(contractor.registrationDate).format("lll")}</td>
                <td>
                  <button
                    onClick={() => generatePDFReport(contractor.registrationId)}
                    className="btn btn-sm bg-[#4765ebc3] text-white"
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

export default CalculateBills;
