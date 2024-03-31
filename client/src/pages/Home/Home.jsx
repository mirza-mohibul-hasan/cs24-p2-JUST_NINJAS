import useTitle from "../../hooks/useTitle";

const Home = () => {
  useTitle("Home");
  return (
    <div className="px-5 dark:bg-slate-800">
      <div className="py-5 space-y-3">
        <h1 className="text-5xl md:text-7xl text-center font-semibold dark:text-gray-50">
          Welcome to <span className="text-blue-400">EcoSync</span>
        </h1>
        <p className="text-2xl md:text-3xl text-center font-semibold dark:text-gray-400">
          Revolutionizing Waste Management <br />
          in Dhaka North City Corporation
        </p>
      </div>
      <div className="bg-[#F8CF40] rounded-2xl flex justify-center">
        <img src="truck.png" alt="" className="w-[85%]" />
      </div>
    </div>
  );
};

export default Home;
