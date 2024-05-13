import { useForm } from "react-hook-form";
import useTitle from "../../../../hooks/useTitle";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import Swal from "sweetalert2";

const CreateContractorManager = () => {
  useTitle("Create Contractor Manager");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useContext(AuthContext);
  const [allThirdparty, setAllThirdparty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    const fetchThirdparty = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
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

        const response = await axios.get(
          "http://localhost:3000/thirdparty/all-thirdparty",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllThirdparty(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchThirdparty();
  }, []);
  console.log(allThirdparty);
  if (!user || loading) {
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
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("contact", data.contact);
        formData.append("assignedCompany", data.assignedCompany);
        formData.append("accessLevel", data.accessLevel);
        formData.append("userName", data.userName);
        formData.append("password", data.password);
        formData.append("avatar", data.avatar[0]);
        console.log(formData);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.post(
          "http://localhost:3000/thirdparty/add-contractor-manager",
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
    <div className="card flex-shrink-0 lg:w-2/5 mx-auto my-5 rounded p-5 bg-[#97979719] text-[#717070]">
      <div className="card-body">
        <h1 className="text-lg text-center font-semibold text-[#717070] px-5 uppercase">
          Create of Contractor Manager
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-base grid lg:grid-cols-2 gap-2"
        >
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

          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Assign Company</span>
            </label>
            <select
              id="assignedCompany"
              name="assignedCompany"
              {...register("assignedCompany")}
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            >
              <option value="">Select Company</option>
              {allThirdparty?.map((thirdparty) => (
                <option key={thirdparty._id} value={thirdparty.registrationId}>
                  {thirdparty?.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Access Level</span>
            </label>
            <select
              id="accessLevel"
              name="accessLevel"
              {...register("accessLevel")}
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            >
              <option value="">Select Access Level</option>

              <option value="general">General</option>
              <option value="super">Super</option>
            </select>
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">User Name</span>
            </label>
            <input
              type="text"
              name="userName"
              {...register("userName")}
              placeholder="junaid123"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
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
              // {...register("password", {
              //   minLength: 6,
              //   pattern: /(?=.*[A-Z])(?=.*[!@#$&*])/,
              // })}
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
          <div className="form-control mt-6 flex justify-center pb-3">
            <input
              type="submit"
              value="Register"
              className="text-[#4765ebc3] border rounded p-1 font-semibold hover:bg-[#4765ebc3] hover:text-white border-[#4765ebc3] uppercase w-full lg:-mb-4 lg:p-2"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContractorManager;
