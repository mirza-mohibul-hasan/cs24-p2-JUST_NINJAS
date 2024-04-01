import { useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import axios from "axios";
import useTitle from "../../../../hooks/useTitle";
const CreateUser = () => {
  useTitle("Create User");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [confirmPassword, setConfirmPassword] = useState("");
  const onSubmit = async (data) => {
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
        // console.log(data);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("nid", data.nid);
        formData.append("address", data.address);
        formData.append("password", data.password);
        formData.append("avatar", data.avatar[0]);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.post(
          "http://localhost:3000/users",
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
    <div className="hero min-h-screen">
      <div className="hero-content w-full">
        <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-[#dadff3] dark:bg-gray-600">
          <div className="card-body">
            <h1 className="text-3xl text-center font-bold text-[#2145e6]">
              Create User Here
            </h1>
            <p className="text-[#2145e6] text-center border border-[#2145e6] rounded-lg font-semibold"></p>
            <form onSubmit={handleSubmit(onSubmit)} className="dark:text-black">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  {...register("name")}
                  placeholder="Mohibul Refat"
                  className="input input-bordered bg-gray-100"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  required
                  id="email"
                  name="email"
                  {...register("email")}
                  placeholder="mirza@mohibul.com"
                  className="input input-bordered bg-gray-100"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">NID</span>
                </label>
                <input
                  type="text"
                  required
                  id="nid"
                  name="nid"
                  {...register("nid")}
                  placeholder="12763456"
                  className="input input-bordered bg-gray-100"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input
                  type="text"
                  required
                  id="address"
                  name="address"
                  {...register("address")}
                  placeholder="House-34, Bijay Sarani, Dhaka"
                  className="input input-bordered bg-gray-100"
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
                  className="input input-bordered bg-gray-100"
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
                  className="input input-bordered bg-gray-100"
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
                  className="file-input file-input-primary w-full"
                />
              </div>
              <div className="form-control mt-6 ">
                <input
                  className="text-white btn bg-[#2145e6] border-[#2145e6]"
                  type="submit"
                  value="Create"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
