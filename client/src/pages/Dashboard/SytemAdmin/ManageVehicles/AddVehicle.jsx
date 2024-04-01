import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import { BallTriangle } from "react-loader-spinner";
import useTitle from "../../../../hooks/useTitle";
const AddVehicle = () => {
  useTitle("Add Vehicles");
  const { user, loading } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
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
    data.fuel_cost_loaded = parseFloat(data.fuel_cost_loaded);
    data.fuel_cost_unloaded = parseFloat(data.fuel_cost_unloaded);
    data.capacity = parseFloat(data.capacity);
    data.vehicleId = data.registration_number
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    data.addedBy = user?.email;

    try {
      // console.log(data);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        "http://localhost:3000/vehicle/add",
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
        reset();
      } else {
        Swal.fire({
          icon: "error",
          title: response.data?.message,
          text: "Try Agin Later",
        });
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
  return (
    <div className=" min-h-screen">
      <div className="hero-content w-full">
        <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-[#dadff3]">
          <div className="card-body">
            <h1 className="text-3xl text-center font-bold text-[#2145e6]">
              ADD VEHICLE
            </h1>
            <p className="text-[#2145e6] text-center border border-[#2145e6] rounded-lg font-semibold"></p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Registration Number</span>
                </label>
                <input
                  type="text"
                  id="registration_number"
                  name="registration_number"
                  {...register("registration_number")}
                  placeholder="DHAKA-D-11-9999"
                  className="input input-bordered bg-gray-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Type</span>
                </label>
                <select
                  id="type"
                  name="type"
                  {...register("type")}
                  className="select select-bordered bg-gray-100"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="opentruck">Open Truck</option>
                  <option value="dumptruck">Dump Truck</option>
                  <option value="compactor">Compactor</option>
                  <option value="containercarrier">Container Carrier</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Capacity</span>
                </label>
                <select
                  id="capacity"
                  name="capacity"
                  {...register("capacity")}
                  className="select select-bordered bg-gray-100"
                  required
                >
                  <option value="">Select Capacity</option>
                  <option value={3}>3 ton</option>
                  <option value={5}>5 ton</option>
                  <option value={7}>7 ton</option>
                  <option value={15}>15 ton</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Fuel cost per km (fully loaded)
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="fuel_cost_loaded"
                  name="fuel_cost_loaded"
                  {...register("fuel_cost_loaded")}
                  placeholder="Enter cost"
                  className="input input-bordered bg-gray-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Fuel cost per km (unloaded)
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="fuel_cost_unloaded"
                  name="fuel_cost_unloaded"
                  {...register("fuel_cost_unloaded")}
                  placeholder="Enter cost"
                  className="input input-bordered bg-gray-100"
                  required
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

export default AddVehicle;
