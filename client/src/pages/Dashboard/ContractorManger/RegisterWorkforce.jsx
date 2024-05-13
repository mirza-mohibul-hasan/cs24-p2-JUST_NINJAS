import { useForm } from "react-hook-form";
import useTitle from "../../../hooks/useTitle";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import Swal from "sweetalert2";

const RegisterWorkforce = () => {
  useTitle("Register Thirdparty Company");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useContext(AuthContext);
  const [wardInfo, setWardInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user) {
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
        console.log("User", user);
        const response = await axios.get(
          `http://localhost:3000/ward/${user?.assignedCompany}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWardInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);
  if (!wardInfo || loading) {
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
  const onSubmit = async (data) => {
    console.log(data);
    try {
      if (data.password !== confirmPassword) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Password not matched.",
          showConfirmButton: false,
          timer: 700,
        });
      } else {
        const formData = new FormData();
        formData.append("employeeId", data.employeeId);
        formData.append("fullName", data.fullName);
        formData.append("dateOfBirth", data.dateOfBirth);
        formData.append("dateOfHire", data.dateOfHire);
        formData.append("jobTitle", data.jobTitle);
        formData.append("paymentPerHour", data.paymentPerHour);
        formData.append("contact", data.contact);
        formData.append("collectionRoute", data.collectionRoute);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("wardNumber", wardInfo?.wardNumber);
        formData.append("managerId", user?.userId);
        formData.append("avatar", data.avatar[0]);
        console.log(data);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.post(
          "http://localhost:3000/workforce/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);
        if (response.data?.success) {
          Swal.fire({
            icon: "success",
            title: response.data?.message,
            text: "Congratulations",
          });
          reset();
        } else {
          Swal.fire({
            icon: "error",
            title: response.data?.message,
            text: "Try Agin Later",
          });
        }
      }
    } catch (error) {
      console.error("Error creating user:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 700,
      });
    }
  };
  const handleConfim = (e) => {
    const confirmPassword = e?.target?.value;
    setConfirmPassword(confirmPassword);
  };
  return (
    <div className="card flex-shrink-0 md:w-2/5 mx-auto my-5 rounded p-5 bg-[#97979719] text-[#717070]">
      <div className="card-body">
        <h1 className="text-lg text-center font-semibold text-[#717070] px-5 uppercase">
          Create of Contractor Manager
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="text-base ">
          <div className="grid lg:grid-cols-2 gap-2">
            <div className="form-control flex flex-col mt-1">
              <label className="label">
                <span className="label-text uppercase">Employee ID</span>
              </label>
              <input
                type="text"
                name="employeeId"
                {...register("employeeId")}
                placeholder="rashiddncc123"
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
                required
              />
            </div>
            <div className="form-control flex flex-col mt-1">
              <label className="label">
                <span className="label-text uppercase">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                {...register("fullName")}
                placeholder="Junaid Ahmed"
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
                required
              />
            </div>
            <div className="form-control flex flex-col mt-1">
              <label className="label">
                <span className="label-text uppercase">Date of Birth</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                {...register("dateOfBirth")}
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
                required
              />
            </div>
            <div className="form-control flex flex-col mt-1">
              <label className="label">
                <span className="label-text">Date of Hire</span>
              </label>
              <input
                type="date"
                name="dateOfHire"
                {...register("dateOfHire")}
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
                required
              />
            </div>
            <div className="form-control flex flex-col mt-1">
              <label className="label">
                <span className="label-text uppercase">Job Title</span>
              </label>
              <select
                id="jobTitle"
                name="jobTitle"
                {...register("jobTitle")}
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
                required
              >
                <option value="">Select Title</option>
                <option value="outsourced">Outsourced</option>
                <option value="contractors">Contractors</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            <div className="form-control flex flex-col mt-1">
              <label className="label">
                <span className="label-text uppercase">
                  Assign Collection Route
                </span>
              </label>
              <select
                id="collectionRoute"
                name="collectionRoute"
                {...register("collectionRoute")}
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
                required
              >
                <option value="">Select Route</option>
                {wardInfo?.areas?.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control flex flex-col mt-1">
              <label className="label">
                <span className="label-text uppercase">
                  Payment Per Hour(TAKA)
                </span>
              </label>
              <input
                type="text"
                name="paymentPerHour"
                {...register("paymentPerHour")}
                placeholder="100.50"
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
                required
              />
            </div>
            <div className="form-control flex flex-col mt-1">
              <label className="label">
                <span className="label-text uppercase">Contact Number</span>
              </label>
              <input
                type="text"
                name="contact"
                {...register("contact")}
                placeholder="+8801991347811"
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
                required
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="text"
                name="email"
                {...register("email")}
                placeholder="abc@xyz.com"
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                required
                {...register("password")}
                placeholder="Your password"
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              />
              {errors.password?.type === "minLength" && (
                <p className="text-red-600">
                  Password must be more than six characters
                </p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-600">
                  Password must have one Uppercase and one special character.
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                onChange={handleConfim}
                type="password"
                required
                placeholder="Confirm Password"
                className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Picture</span>
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                {...register("avatar")}
                className="input input-bordered bg-gray-100 rounded py-1 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4 file:rounded-md
              file:border-0 file:text-sm file:font-semibold
              file:bg-[#cad2f4c3] file:text-[#4765ebc3]
              hover:file:bg-[#b6c2f5c3]"
              />
            </div>
          </div>

          <div className="form-control mt-6 flex justify-center pb-3">
            <input
              type="submit"
              value="Register"
              className="text-[#4765ebc3] border rounded p-1 font-semibold hover:bg-[#4765ebc3] hover:text-white border-[#4765ebc3] uppercase w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterWorkforce;
