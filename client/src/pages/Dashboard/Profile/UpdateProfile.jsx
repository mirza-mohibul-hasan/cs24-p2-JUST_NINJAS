import { useContext, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import { BallTriangle } from "react-loader-spinner";
import Swal from "sweetalert2";
import axios from "axios";
import { useForm } from "react-hook-form";
import useTitle from "../../../hooks/useTitle";

const UpdateProfile = () => {
  useTitle("Update Profile");
  const { user } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data) => {
    try {
      // console.log(data);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.put("http://localhost:3000/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);
      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: response.data?.message,
          text: "Congratulations",
        });
        reset;
      } else {
        Swal.fire({
          icon: "error",
          title: response.data?.message,
          text: "Try Agin Later",
        });
      }
    } catch (error) {
      console.error("Error updating:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 700,
      });
    }
  };

  if (!user) {
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
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(selectedFile);
  };
  const changePhoto = async () => {
    try {
      if (!selectedFile) {
        throw new Error("Please select a file.");
      }

      const formData = new FormData();
      formData.append("avatar", selectedFile);
      formData.append("id", user._id);
      formData.append("oldavatar", user.avatar);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.put(
        `http://localhost:3000/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Swal.fire(
          "Success",
          "Profile picture updated successfully.",
          "success"
        );
      } else {
        throw new Error("Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error.message);
      Swal.fire("Error", error.message, "error");
    }
  };
  return (
    <div>
      <div className="">
        <h1 className="text-2xl uppercase font-bold">Edit Profile</h1>
        <h1 className="text-3xl text-center font-bold text-[#2145e6dd]">
          Update Photo
        </h1>
        <hr className="border border-[#2145e6] rounded-lg w-96 mx-auto my-5" />
        <div className="flex justify-center items-center gap-5">
          <div className="w-32 rounded-full border-2  border-blue-500 ">
            <img
              className="rounded-full p-1"
              src={`http://localhost:3000/profilepic/${user?.avatar}`}
            />
          </div>
          <div className="flex flex-col gap-4 disabled">
            <p className="text-xl text-red-600 font-bold">
              You can not update profile photo
            </p>
            <input
              disabled
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full max-w-xs"
            />
            <button
              disabled
              onClick={changePhoto}
              className="btn btn-xs btn-outline btn-primary"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      <div className="hero min-h-screen">
        <div className="hero-content w-full">
          <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-[#dadff3]">
            <div className="card-body">
              <h1 className="text-3xl text-center font-bold text-[#2145e6]">
                Update Details
              </h1>
              <p className="text-[#2145e6] text-center border border-[#2145e6] rounded-lg font-semibold"></p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={user.name}
                    {...register("newname")}
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
                    defaultValue={user.email}
                    id="email"
                    name="email"
                    {...register("newemail")}
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
                    defaultValue={user.nid}
                    id="nid"
                    name="nid"
                    {...register("newnid")}
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
                    defaultValue={user.address}
                    id="address"
                    name="address"
                    {...register("newaddress")}
                    placeholder="House-34, Bijay Sarani, Dhaka"
                    className="input input-bordered bg-gray-100"
                  />
                </div>
                <div className="form-control mt-6 ">
                  <input
                    className="text-white btn bg-[#2145e6] border-[#2145e6]"
                    type="submit"
                    value="Update"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
