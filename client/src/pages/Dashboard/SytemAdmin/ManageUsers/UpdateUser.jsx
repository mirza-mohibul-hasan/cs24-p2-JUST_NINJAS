import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useTitle from "../../../../hooks/useTitle";

const UpdateUser = () => {
  useTitle("Update User");
  const { register, handleSubmit, reset } = useForm();
  const [userDetails, setUserDetails] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, [id]);
  // console.log(userDetails);
  const onSubmit = async (data) => {
    try {
      // console.log(data);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.put(
        `http://localhost:3000/users/${id}`,
        data,
        {
          headers: {
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
  return (
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
                  defaultValue={userDetails.name}
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
                  defaultValue={userDetails.email}
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
                  defaultValue={userDetails.nid}
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
                  defaultValue={userDetails.address}
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
  );
};

export default UpdateUser;
