import { BallTriangle } from "react-loader-spinner";
import useTitle from "../../hooks/useTitle";

const ErrorLoading = () => {
  useTitle("Error");
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#FF0000"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      ></BallTriangle>{" "}
      <h1 className="text-red-600 text-3xl mt-3 border-2 border-red-600 p-5 rounded">
        You do not have Permission
      </h1>
    </div>
  );
};

export default ErrorLoading;
