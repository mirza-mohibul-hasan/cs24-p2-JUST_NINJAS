import { useContext } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import { useForm } from "react-hook-form";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import Swal from "sweetalert2";
import useTitle from "../../../../hooks/useTitle";

const CreateSTS = () => {
  useTitle("Create STS");
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
    let stsId = data.capacity + data.latitude + data.longitude + Date.now();
    data.stsId = stsId.replace(/[^a-z0-9]/g, "");
    data.capacity = parseFloat(data.capacity);
    data.latitude = parseFloat(data.latitude);
    data.longitude = parseFloat(data.longitude);
    data.fineRate = parseFloat(data.fineRate);
    data.ward_num = parseInt(data.ward_num);
    data.addedBy = user?.email;

    try {
      // console.log(data);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post("http://localhost:3000/sts/add", data, {
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
              CREATE STS
            </h1>
            <p className="text-[#2145e6] text-center border border-[#2145e6] rounded-lg font-semibold"></p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ward Number</span>
                </label>
                <input
                  type="number"
                  id="ward"
                  name="ward_num"
                  {...register("ward_num")}
                  placeholder="17"
                  className="input input-bordered bg-gray-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Capacity (Tonnes)</span>
                </label>
                <input
                  type="text"
                  id="capacity"
                  name="capacity"
                  {...register("capacity")}
                  placeholder="Enter capacity"
                  className="input input-bordered bg-gray-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Latitude</span>
                </label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  {...register("latitude")}
                  placeholder="Enter latitude"
                  className="input input-bordered bg-gray-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Longitude</span>
                </label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  {...register("longitude")}
                  placeholder="Enter longitude"
                  className="input input-bordered bg-gray-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fine Rate(Per Ton) TAKA</span>
                </label>
                <input
                  type="text"
                  id="fineRate"
                  name="fineRate"
                  {...register("fineRate")}
                  placeholder="200.20"
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

export default CreateSTS;
